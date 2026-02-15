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
      .from('lead_vehicle_interests')
      .select('*')
      .eq('lead_id', id)

    if (error) {
      console.error('Error fetching vehicle interests:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ vehicle_interests: data || [] })
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
      .from('lead_vehicle_interests')
      .insert({
        lead_id: id,
        make: body.make || null,
        model: body.model || null,
        color: body.color || null,
        vehicle_type: body.vehicle_type || null,
        year: body.year ?? null,
        vehicle_id: body.vehicle_id || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vehicle interest:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ vehicle_interest: data }, { status: 201 })
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

    const { vehicle_interests } = body
    if (!Array.isArray(vehicle_interests)) {
      return NextResponse.json({ error: 'vehicle_interests must be an array' }, { status: 400 })
    }

    await supabase.from('lead_vehicle_interests').delete().eq('lead_id', id)

    if (vehicle_interests.length === 0) {
      return NextResponse.json({ vehicle_interests: [] })
    }

    const toInsert = vehicle_interests.map((v: Record<string, unknown>) => ({
      lead_id: id,
      make: v.make || null,
      model: v.model || null,
      color: v.color || null,
      vehicle_type: v.vehicle_type || null,
      year: v.year ?? null,
      vehicle_id: v.vehicle_id || null,
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('lead_vehicle_interests')
      .insert(toInsert)
      .select()

    if (error) {
      console.error('Error upserting vehicle interests:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ vehicle_interests: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
