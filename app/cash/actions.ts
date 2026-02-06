'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCashBalance() {
    try {
        const journal = await prisma.journal.findFirst({ where: { code: 'CSH' } })
        if (!journal) return 0

        const items = await prisma.journalItem.findMany({
            where: {
                entry: {
                    journalId: journal.id
                },
                account: {
                    code: '571100' // Caisse
                }
            }
        })

        const balance = items.reduce((sum, item) => sum + Number(item.debit) - Number(item.credit), 0)
        return balance
    } catch (error) {
        console.error('Error fetching cash balance:', error)
        return 0
    }
}

export async function createCashMovement(type: 'IN' | 'OUT', amount: number, label: string) {
    try {
        const journal = await prisma.journal.findFirst({ where: { code: 'CSH' } })
        if (!journal) throw new Error('Journal de caisse non trouvé')

        const result = await prisma.journalEntry.create({
            data: {
                date: new Date(),
                reference: `CSH/${Date.now()} - ${label}`,
                journalId: journal.id,
                items: {
                    create: [
                        {
                            account: { connect: { code: '571100' } }, // Caisse
                            label: label,
                            debit: type === 'IN' ? amount : 0,
                            credit: type === 'OUT' ? amount : 0,
                        },
                        {
                            account: { connect: { code: type === 'IN' ? '701100' : '601100' } }, // Placeholder accounts
                            label: label,
                            debit: type === 'OUT' ? amount : 0,
                            credit: type === 'IN' ? amount : 0,
                        }
                    ]
                }
            }
        })

        revalidatePath('/cash')
        revalidatePath('/accounting')
        return { success: true }
    } catch (error) {
        console.error('Error creating cash movement:', error)
        return { success: false, error: 'Erreur lors de l\'opération de caisse' }
    }
}
