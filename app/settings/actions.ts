'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function seedInitialData() {
    try {
        // 1. Create Default Warehouse
        await prisma.warehouse.upsert({
            where: { id: 'default-wh' },
            update: {},
            create: {
                id: 'default-wh',
                name: 'Entrepôt Principal',
                code: 'WH-01'
            }
        })

        // 2. Create Default Journals
        const journals = [
            { code: 'VEN', name: 'Journal des Ventes', type: 'SALE' },
            { code: 'ACH', name: 'Journal des Achats', type: 'PURCHASE' },
            { code: 'BNK', name: 'Journal de Banque', type: 'BANK' },
            { code: 'CSH', name: 'Journal de Caisse', type: 'CASH' },
            { code: 'OD', name: 'Opérations Diverses', type: 'GENERAL' },
        ]

        for (const j of journals) {
            await prisma.journal.upsert({
                where: { code: j.code },
                update: { name: j.name, type: j.type as any },
                create: { code: j.code, name: j.name, type: j.type as any }
            })
        }

        // 3. Create Core Accounts (SYSCOHADA)
        const accounts = [
            { code: '411100', name: 'Clients', type: 'ASSET' },
            { code: '401100', name: 'Fournisseurs', type: 'LIABILITY' },
            { code: '701100', name: 'Ventes de marchandises', type: 'INCOME' },
            { code: '601100', name: 'Achats de marchandises', type: 'EXPENSE' },
            { code: '521100', name: 'Banque', type: 'ASSET' },
            { code: '571100', name: 'Caisse', type: 'ASSET' },
        ]

        for (const a of accounts) {
            await prisma.account.upsert({
                where: { code: a.code },
                update: { name: a.name, type: a.type as any },
                create: { code: a.code, name: a.name, type: a.type as any }
            })
        }

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Seed error:', error)
        return { success: false, error: 'Erreur lors de l\'initialisation des données' }
    }
}

export async function exportAllData() {
    try {
        const products = await prisma.product.findMany()
        const partners = await prisma.partner.findMany()
        const sales = await prisma.sale.findMany({ include: { items: true } })
        const purchases = await prisma.purchase.findMany({ include: { items: true } })
        const entries = await prisma.journalEntry.findMany({ include: { items: true } })

        return {
            timestamp: new Date().toISOString(),
            data: {
                products,
                partners,
                sales,
                purchases,
                entries
            }
        }
    } catch (error) {
        console.error('Export error:', error)
        return null
    }
}
