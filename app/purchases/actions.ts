'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPurchases() {
    try {
        const purchases = await prisma.purchase.findMany({
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
        return purchases
    } catch (error) {
        console.error('Error fetching purchases:', error)
        return []
    }
}

export async function createPurchase(partnerId: string, items: { productId: string, qty: number, price: number }[]) {
    try {
        const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0)

        const result = await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    number: `PO-${Date.now()}`,
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

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: {
                            increment: item.qty
                        },
                        costPrice: item.price // Update last cost price
                    }
                })

                const warehouse = await tx.warehouse.findFirst()
                if (warehouse) {
                    await tx.stockMove.create({
                        data: {
                            productId: item.productId,
                            warehouseId: warehouse.id,
                            qty: item.qty,
                            type: 'IN',
                            reference: purchase.number,
                        }
                    })
                }
            }

            // 3. Create Accounting Journal Entry (ACH - Achats)
            const journal = await tx.journal.findFirst({ where: { code: 'ACH' } })
            if (journal) {
                await tx.journalEntry.create({
                    data: {
                        date: new Date(),
                        reference: `ACH/${purchase.number}`,
                        journalId: journal.id,
                        partnerId: partnerId,
                        items: {
                            create: [
                                {
                                    account: { connect: { code: '601100' } }, // Achats de marchandises
                                    label: `Achat ${purchase.number}`,
                                    debit: totalAmount,
                                    credit: 0,
                                },
                                {
                                    account: { connect: { code: '401100' } }, // Fournisseur
                                    label: `Achat ${purchase.number}`,
                                    debit: 0,
                                    credit: totalAmount,
                                }
                            ]
                        }
                    }
                })
            }
            return purchase
        })

        revalidatePath('/purchases')
        revalidatePath('/inventory')
        revalidatePath('/accounting')
        return { success: true, purchase: result }
    } catch (error) {
        console.error('Error creating purchase:', error)
        return { success: false, error: 'Erreur lors de la création de l\'achat' }
    }
}
