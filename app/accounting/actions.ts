'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAccounts() {
    try {
        const accounts = await prisma.account.findMany({
            orderBy: { code: 'asc' },
        })
        return accounts
    } catch (error) {
        console.error('Error fetching accounts:', error)
        return []
    }
}

export async function getJournals() {
    try {
        const journals = await prisma.journal.findMany({
            include: {
                _count: {
                    select: { entries: true }
                }
            }
        })
        return journals
    } catch (error) {
        console.error('Error fetching journals:', error)
        return []
    }
}

export async function getTrialBalance() {
    try {
        const accounts = await prisma.account.findMany({
            include: {
                journalItems: true
            },
            orderBy: { code: 'asc' }
        })

        const balance = accounts.map(acc => {
            const debit = acc.journalItems.reduce((sum, item) => sum + Number(item.debit), 0)
            const credit = acc.journalItems.reduce((sum, item) => sum + Number(item.credit), 0)
            return {
                ...acc,
                debit,
                credit,
                balance: debit - credit
            }
        })

        return balance
    } catch (error) {
        console.error('Error fetching trial balance:', error)
        return []
    }
}

export async function getGeneralLedger(accountId?: string) {
    try {
        const where = accountId ? { accountId } : {}
        const items = await prisma.journalItem.findMany({
            where,
            include: {
                account: true,
                entry: {
                    include: { journal: true }
                }
            },
            orderBy: {
                entry: { date: 'desc' }
            }
        })
        return items
    } catch (error) {
        console.error('Error fetching general ledger:', error)
        return []
    }
}
