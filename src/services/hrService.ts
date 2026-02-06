import { supabase } from '../lib/supabase'

export async function getEmployees() {
    const { data, error } = await supabase
        .from('Employee')
        .select('*')
        .order('lastName', { ascending: true })

    if (error) {
        console.error('Error fetching employees:', error)
        return []
    }
    return data
}

export async function createEmployee(employeeData: any) {
    const { data, error } = await supabase
        .from('Employee')
        .insert([employeeData])
        .select()

    if (error) {
        console.error('Error creating employee:', error)
        return { success: false, error: error.message }
    }
    return { success: true, data }
}
