'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: {
                lastName: 'asc',
            },
        })
        return employees
    } catch (error) {
        console.error('Error fetching employees:', error)
        return []
    }
}

export async function createEmployee(formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const jobTitle = formData.get('jobTitle') as string
    const email = formData.get('email') as string
    const baseSalary = parseFloat(formData.get('baseSalary') as string)

    try {
        await prisma.employee.create({
            data: {
                firstName,
                lastName,
                jobTitle,
                email,
                baseSalary,
            },
        })
        revalidatePath('/hr')
        return { success: true }
    } catch (error) {
        console.error('Error creating employee:', error)
        return { success: false, error: 'Erreur lors de la création de l\'employé' }
    }
}
