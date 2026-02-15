import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(request: Request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const leadId = searchParams.get('lead_id')

    // Get user profile to check role for filtering
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('appointments')
      .select(`
        *,
        lead:leads(
          id,
          name,
          phone,
          vehicle_interest,
          assigned_to
        ),
        dealer:dealers(
          id,
          name,
          contact_name,
          contact_phone
        ),
        vehicle:vehicles(
          id,
          year,
          make,
          model,
          trim,
          price,
          mileage,
          stock_number,
          primary_image_url,
          exterior_color,
          status
        )
      `)
      .order('scheduled_at', { ascending: true })

    // Filter appointments based on role
    if (userProfile?.role === 'dealer') {
      query = query.eq('dealer_id', user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data: appointments, error } = await query

    if (error) {
      console.error('Error fetching appointments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch assigned user profiles separately to avoid RLS recursion
    const assignedUserIds = appointments?.map(a => a.lead?.assigned_to).filter(Boolean) || []
    let assignedUsers: Record<string, any> = {}
    
    if (assignedUserIds.length > 0) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', [...new Set(assignedUserIds)])
      
      if (users) {
        assignedUsers = users.reduce((acc, u) => {
          acc[u.id] = u
          return acc
        }, {} as Record<string, any>)
      }
    }

    // Attach assigned user data to appointments
    const appointmentsWithUsers = appointments?.map(apt => ({
      ...apt,
      lead: apt.lead ? {
        ...apt.lead,
        assigned_user: apt.lead.assigned_to ? assignedUsers[apt.lead.assigned_to] || null : null,
      } : null,
    })) || []

    return NextResponse.json({ appointments: appointmentsWithUsers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

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

    // Send appointment-created email alert via Edge Function (fire-and-forget)
    if (appointment.lead_id) {
      supabase
        .from('leads')
        .select('id, name, assigned_to')
        .eq('id', appointment.lead_id)
        .single()
        .then(({ data: lead }) => {
          const assignedTo = lead?.assigned_to
          if (!assignedTo) return
          import('@/lib/invoke-edge-function').then(({ invokeEdgeFunction }) => {
            invokeEdgeFunction('send-appointment-created', {
              agent_user_id: assignedTo,
              appointment: {
                id: appointment.id,
                scheduled_at: appointment.scheduled_at,
                appointment_type: appointment.appointment_type,
              },
              lead_name: lead?.name ?? null,
            })
          })
        })
        .catch((err) => console.error('[email] Appointment created alert failed:', err))
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
