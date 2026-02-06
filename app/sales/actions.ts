'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSales() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                partner: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                date: 'desc',
            },
        })
        return sales
    } catch (error) {
        console.error('Error fetching sales:', error)
        return []
    }
}

export async function createSale(partnerId: string, items: { productId: string, qty: number, price: number }[]) {
    try {
        const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0)

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Sale
            const sale = await tx.sale.create({
                data: {
                    number: `SO-${Date.now()}`,
                    partnerId,
                    totalAmount,
                    status: 'POSTED',
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            qty: item.qty,
                            price: item.price,
                            subtotal: item.qty * item.price
                        }))
                    }
                },
                include: {
                    items: true
                }
            })

            // 2. Update Stock & Create Stock Moves
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: {
                            decrement: item.qty
                        }
                    }
                })

                // (We would ideally select a warehouse here, defaulting for now)
                const warehouse = await tx.warehouse.findFirst()
                if (warehouse) {
                    await tx.stockMove.create({
                        data: {
                            productId: item.productId,
                            warehouseId: warehouse.id,
                            qty: -item.qty,
                            type: 'OUT',
                            reference: sale.number,
                        }
                    })
                }
            }

            // 3. Create Accounting Journal Entry (VEN - Ventes)
            const journal = await tx.journal.findFirst({ where: { code: 'VEN' } })
            if (journal) {
                await tx.journalEntry.create({
                    data: {
                        date: new Date(),
                        reference: `VEN/${sale.number}`,
                        journalId: journal.id,
                        partnerId: partnerId,
                        items: {
                            create: [
                                {
                                    account: { connect: { code: '411100' } }, // Client
                                    label: `Vente ${sale.number} - ${sale.items.length} articles`,
                                    debit: totalAmount,
                                    credit: 0,
                                },
                                {
                                    account: { connect: { code: '701100' } }, // Vente de marchandises
                                    label: `Vente ${sale.number}`,
                                    debit: 0,
                                    credit: totalAmount,
                                }
                            ]
                        }
                    }
                })
            }

            return sale
        })

        revalidatePath('/sales')
        revalidatePath('/inventory')
        revalidatePath('/accounting')
        return { success: true, sale: result }
    } catch (error) {
        console.error('Error creating sale:', error)
        return { success: false, error: 'Erreur lors de la création de la vente' }
    }
}
