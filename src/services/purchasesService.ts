import { supabase } from '../lib/supabase'

export async function getPurchases() {
    const { data, error } = await supabase
        .from('Purchase')
        .select('*, partner:Partner(*), items:PurchaseItem(*, product:Product(*))')
        .order('date', { ascending: false })

    if (error) {
        console.error('Error fetching purchases:', error)
        return []
    }
    return data
}

export async function createPurchase(partnerId: string, items: { productId: string, qty: number, price: number }[]) {
    try {
        const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0)
        const purchaseNumber = `PO-${Date.now()}`

        // 1. Create Purchase
        const { data: purchase, error: purchaseError } = await supabase
            .from('Purchase')
            .insert([
                {
                    number: purchaseNumber,
                    partnerId,
                    totalAmount,
                    status: 'POSTED',
                },
            ])
            .select()
            .single()

        if (purchaseError) throw purchaseError

        // 2. Create Purchase Items
        const purchaseItems = items.map(item => ({
            purchaseId: purchase.id,
            productId: item.productId,
            qty: item.qty,
            price: item.price,
            subtotal: item.qty * item.price,
        }))

        const { error: itemsError } = await supabase
            .from('PurchaseItem')
            .insert(purchaseItems)

        if (itemsError) throw itemsError

        // 3. Update Stock & Create Stock Moves
        for (const item of items) {
            // Increment stock & update cost price
            const { data: product } = await supabase
                .from('Product')
                .select('stockQty')
                .eq('id', item.productId)
                .single()

            if (product) {
                await supabase
                    .from('Product')
                    .update({
                        stockQty: product.stockQty + item.qty,
                        costPrice: item.price
                    })
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
                            qty: item.qty,
                            type: 'IN',
                            reference: purchase.number,
                        },
                    ])
            }
        }

        // 4. Accounting (Simplified)
        const { data: journal } = await supabase
            .from('Journal')
            .select('id')
            .eq('code', 'ACH')
            .single()

        if (journal) {
            const { data: entry } = await supabase
                .from('JournalEntry')
                .insert([
                    {
                        date: new Date().toISOString(),
                        reference: `ACH/${purchase.number}`,
                        journalId: journal.id,
                        partnerId: partnerId,
                    },
                ])
                .select()
                .single()

            if (entry) {
                const { data: accAchat } = await supabase.from('Account').select('id').eq('code', '601100').single()
                const { data: accFourn } = await supabase.from('Account').select('id').eq('code', '401100').single()

                if (accAchat && accFourn) {
                    await supabase.from('JournalItem').insert([
                        {
                            entryId: entry.id,
                            accountId: accAchat.id,
                            label: `Achat ${purchase.number}`,
                            debit: totalAmount,
                            credit: 0,
                        },
                        {
                            entryId: entry.id,
                            accountId: accFourn.id,
                            label: `Achat ${purchase.number}`,
                            debit: 0,
                            credit: totalAmount,
                        },
                    ])
                }
            }
        }

        return { success: true, purchase }
    } catch (error: any) {
        console.error('Error creating purchase:', error)
        return { success: false, error: error.message || 'Erreur lors de la création de l\'achat' }
    }
}
