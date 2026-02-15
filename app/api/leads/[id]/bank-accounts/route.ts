import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) return unauthorizedResponse()

    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('lead_bank_accounts')
      .select('*')
      .eq('lead_id', id)

    if (error) {
      console.error('Error fetching bank accounts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ bank_accounts: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) return unauthorizedResponse()

    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('lead_bank_accounts')
      .insert({
        lead_id: id,
        bank_name: body.bank_name || null,
        tenure_months: body.tenure_months ?? null,
        is_shared_account: body.is_shared_account ?? false,
        is_company_account: body.is_company_account ?? false,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bank account:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ bank_account: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) return unauthorizedResponse()

    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { bank_accounts } = body
    if (!Array.isArray(bank_accounts)) {
      return NextResponse.json({ error: 'bank_accounts must be an array' }, { status: 400 })
    }

    await supabase.from('lead_bank_accounts').delete().eq('lead_id', id)

    if (bank_accounts.length === 0) {
      return NextResponse.json({ bank_accounts: [] })
    }

    const toInsert = bank_accounts.map((b: Record<string, unknown>) => ({
      lead_id: id,
      bank_name: b.bank_name || null,
      tenure_months: b.tenure_months ?? null,
      is_shared_account: b.is_shared_account ?? false,
      is_company_account: b.is_company_account ?? false,
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('lead_bank_accounts')
      .insert(toInsert)
      .select()

    if (error) {
      console.error('Error upserting bank accounts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ bank_accounts: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
