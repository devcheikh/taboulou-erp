import { supabase } from '../lib/supabase'

export async function getSales() {
    const { data, error } = await supabase
        .from('Sale')
        .select('*, partner:Partner(*), items:SaleItem(*, product:Product(*))')
        .order('date', { ascending: false })

    if (error) {
        console.error('Error fetching sales:', error)
        return []
    }
    return data
}

export async function createSale(partnerId: string, items: { productId: string, qty: number, price: number }[]) {
    try {
        const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0)
        const saleNumber = `SO-${Date.now()}`

        // 1. Create Sale
        const { data: sale, error: saleError } = await supabase
            .from('Sale')
            .insert([
                {
                    number: saleNumber,
                    partnerId,
                    totalAmount,
                    status: 'POSTED',
                },
            ])
            .select()
            .single()

        if (saleError) throw saleError

        // 2. Create Sale Items
        const saleItems = items.map(item => ({
            saleId: sale.id,
            productId: item.productId,
            qty: item.qty,
            price: item.price,
            subtotal: item.qty * item.price,
        }))

        const { error: itemsError } = await supabase
            .from('SaleItem')
            .insert(saleItems)

        if (itemsError) throw itemsError

        // 3. Update Stock & Create Stock Moves (Sequential for simplicity)
        for (const item of items) {
            // Decrement stock
            const { data: product } = await supabase
                .from('Product')
                .select('stockQty')
                .eq('id', item.productId)
                .single()

            if (product) {
                await supabase
                    .from('Product')
                    .update({ stockQty: product.stockQty - item.qty })
                    .eq('id', item.productId)
            }

            // Stock Move
            const { data: warehouse } = await supabase
                .from('Warehouse')
                .select('id')
                .limit(1)
                .single()

            if (warehouse) {
                await supabase
                    .from('StockMove')
                    .insert([
                        {
                            productId: item.productId,
                            warehouseId: warehouse.id,
                            qty: -item.qty,
                            type: 'OUT',
                            reference: sale.number,
                        },
                    ])
            }
        }

        // 4. Accounting (Optional/Simplified for now)
        const { data: journal } = await supabase
            .from('Journal')
            .select('id')
            .eq('code', 'VEN')
            .single()

        if (journal) {
            const { data: entry } = await supabase
                .from('JournalEntry')
                .insert([
                    {
                        date: new Date().toISOString(),
                        reference: `VEN/${sale.number}`,
                        journalId: journal.id,
                        partnerId: partnerId,
                    },
                ])
                .select()
                .single()

            if (entry) {
                // Find Accounts (hardcoded codes as per legacy logic)
                const { data: accClient } = await supabase.from('Account').select('id').eq('code', '411100').single()
                const { data: accVente } = await supabase.from('Account').select('id').eq('code', '701100').single()

                if (accClient && accVente) {
                    await supabase.from('JournalItem').insert([
                        {
                            entryId: entry.id,
                            accountId: accClient.id,
                            label: `Vente ${sale.number}`,
                            debit: totalAmount,
                            credit: 0,
                        },
                        {
                            entryId: entry.id,
                            accountId: accVente.id,
                            label: `Vente ${sale.number}`,
                            debit: 0,
                            credit: totalAmount,
                        },
                    ])
                }
            }
        }

        return { success: true, sale }
    } catch (error: any) {
        console.error('Error creating sale:', error)
        return { success: false, error: error.message || 'Erreur lors de la création de la vente' }
    }
}
