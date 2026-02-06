'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPartners() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return partners
    } catch (error) {
        console.error('Error fetching partners:', error)
        return []
    }
}

export async function createPartner(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const isCustomer = formData.get('isCustomer') === 'on'
    const isSupplier = formData.get('isSupplier') === 'on'

    try {
        await prisma.partner.create({
            data: {
                name,
                email,
                phone,
                address,
                isCustomer,
                isSupplier,
            },
        })
        revalidatePath('/crm')
        return { success: true }
    } catch (error) {
        console.error('Error creating partner:', error)
        return { success: false, error: 'Erreur lors de la création du partenaire' }
    }
}
