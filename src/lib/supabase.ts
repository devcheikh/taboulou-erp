import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! The app will likely fail to fetch data. Check your Vercel Environment Variables.')
}

// Only create the client if we have a URL, otherwise use a placeholder to avoid crashing on import
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : { from: () => ({ select: () => ({ order: () => Promise.resolve({ data: [], error: new Error('Missing Supabase URL') }) }) }) } as any
