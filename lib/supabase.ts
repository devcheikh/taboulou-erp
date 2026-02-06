import { createClient, SupabaseClient } from '@supabase/supabase-js'

const createSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL not defined in .env')
    }

    if (!supabaseAnonKey) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY not defined in .env')
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })
}

type SupabaseClientSingleton = SupabaseClient

const globalForSupabase = globalThis as unknown as {
    supabase: SupabaseClientSingleton | undefined
}

export const supabase = globalForSupabase.supabase ?? createSupabaseClient()

if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabase = supabase
}
