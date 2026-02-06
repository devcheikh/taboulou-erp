import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! The app will likely fail to fetch data. Check your Vercel Environment Variables.')
}

// Helper to create a mock that returns an error instead of crashing
const createMock = (msg: string) => {
    const mockResponse = (data: any = null) => Promise.resolve({ data, error: { message: msg } });
    const chainable = {
        select: () => ({
            order: () => mockResponse([]),
            limit: () => ({ single: () => mockResponse() }),
            single: () => mockResponse(),
            eq: () => ({ single: () => mockResponse() }),
        }),
        insert: () => ({
            select: () => ({
                ...chainable.select()
            }),
        }),
        update: () => ({
            eq: () => ({
                select: () => ({
                    ...chainable.select()
                }),
            }),
        }),
        delete: () => ({
            eq: () => mockResponse(),
        }),
    };
    return { from: () => chainable };
}

// Only create the client if we have a URL, otherwise use a placeholder to avoid crashing on import
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMock('Supabase URL non configurée') as any
