'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return products
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const sku = formData.get('sku') as string
    const salePrice = parseFloat(formData.get('salePrice') as string)
    const costPrice = parseFloat(formData.get('costPrice') as string)
    const stockQty = parseFloat(formData.get('stockQty') as string)

    try {
        await prisma.product.create({
            data: {
                name,
                sku,
                salePrice,
                costPrice,
                stockQty,
            },
        })
        revalidatePath('/inventory')
        return { success: true }
    } catch (error) {
        console.error('Error creating product:', error)
        return { success: false, error: 'Erreur lors de la création du produit' }
    }
}
