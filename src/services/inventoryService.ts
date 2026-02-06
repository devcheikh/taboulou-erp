import { supabase } from '../lib/supabase'

export async function getProducts() {
    const { data, error } = await supabase
        .from('Product')
        .select('*, category:ProductCategory(*)')
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }
    return data
}

export async function createProduct(productData: any) {
    const { data, error } = await supabase
        .from('Product')
        .insert([
            {
                name: productData.name,
                sku: productData.sku,
                salePrice: productData.salePrice,
                costPrice: productData.costPrice,
                stockQty: productData.stockQty,
            },
        ])
        .select()

    if (error) {
        console.error('Error creating product:', error)
        return { success: false, error: error.message }
    }
    return { success: true, data }
}
