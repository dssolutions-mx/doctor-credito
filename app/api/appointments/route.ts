import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const leadId = searchParams.get('lead_id')

    let query = supabase
      .from('appointments')
      .select(`
        *,
        lead:leads(
          id,
          name,
          phone,
          vehicle_interest
        ),
        dealer:dealers(
          id,
          name,
          contact_name,
          contact_phone
        )
      `)
      .order('scheduled_at', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching appointments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ appointments: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update lead status to 'cita_programada'
    if (appointment.lead_id) {
      await supabase
        .from('leads')
        .update({ status: 'cita_programada' })
        .eq('id', appointment.lead_id)
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
