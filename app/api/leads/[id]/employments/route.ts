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
      .from('lead_employments')
      .select('*')
      .eq('lead_id', id)
      .order('is_primary', { ascending: false })

    if (error) {
      console.error('Error fetching employments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ employments: data || [] })
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
      .from('lead_employments')
      .insert({
        lead_id: id,
        employer_name: body.employer_name || null,
        payment_method: body.payment_method || null,
        payment_period: body.payment_period || null,
        income_value: body.income_value ?? null,
        tenure_months: body.tenure_months ?? null,
        is_primary: body.is_primary ?? true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating employment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ employment: data }, { status: 201 })
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

    const { employments } = body
    if (!Array.isArray(employments)) {
      return NextResponse.json({ error: 'employments must be an array' }, { status: 400 })
    }

    await supabase.from('lead_employments').delete().eq('lead_id', id)

    if (employments.length === 0) {
      return NextResponse.json({ employments: [] })
    }

    const toInsert = employments.map((e: Record<string, unknown>, idx: number) => ({
      lead_id: id,
      employer_name: e.employer_name || null,
      payment_method: e.payment_method || null,
      payment_period: e.payment_period || null,
      income_value: e.income_value ?? null,
      tenure_months: e.tenure_months ?? null,
      is_primary: idx === 0,
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('lead_employments')
      .insert(toInsert)
      .select()

    if (error) {
      console.error('Error upserting employments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ employments: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
