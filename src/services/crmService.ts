import { supabase } from '../lib/supabase'

export async function getPartners() {
    const { data, error } = await supabase
        .from('Partner')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching partners:', error)
        return []
    }
    return data
}

export async function createPartner(partnerData: any) {
    const { data, error } = await supabase
        .from('Partner')
        .insert([partnerData])
        .select()

    if (error) {
        console.error('Error creating partner:', error)
        return { success: false, error: error.message }
    }
    return { success: true, data }
}
