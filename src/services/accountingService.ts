import { supabase } from '../lib/supabase'

export async function getAccounts() {
    const { data, error } = await supabase
        .from('Account')
        .select('*')
        .order('code', { ascending: true })

    if (error) {
        console.error('Error fetching accounts:', error)
        return []
    }
    return data
}

export async function getJournals() {
    const { data, error } = await supabase
        .from('Journal')
        .select('*, entries:JournalEntry(count)')

    if (error) {
        console.error('Error fetching journals:', error)
        return []
    }
    // Transform to match legacy count structure
    return data.map((j: any) => ({
        ...j,
        _count: { entries: j.entries?.[0]?.count || 0 }
    }))
}

export async function getTrialBalance() {
    const { data: accounts, error } = await supabase
        .from('Account')
        .select('*, journalItems:JournalItem(*)')
        .order('code', { ascending: true })

    if (error) {
        console.error('Error fetching trial balance:', error)
        return []
    }

    return accounts.map((acc: any) => {
        const debit = acc.journalItems.reduce((sum: number, item: any) => sum + Number(item.debit), 0)
        const credit = acc.journalItems.reduce((sum: number, item: any) => sum + Number(item.credit), 0)
        return {
            ...acc,
            debit,
            credit,
            balance: debit - credit
        }
    })
}

export async function getGeneralLedger(accountId?: string) {
    let query = supabase
        .from('JournalItem')
        .select('*, account:Account(*), entry:JournalEntry(*, journal:Journal(*))')
        .order('createdAt', { ascending: false }) // Fallback since entry.date is nested

    if (accountId) {
        query = query.eq('accountId', accountId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching general ledger:', error)
        return []
    }
    return data
}
