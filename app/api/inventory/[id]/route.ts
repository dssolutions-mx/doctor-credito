import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()

    // Get vehicle with related data
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        dealer:dealers(
          id,
          name,
          phone,
          email,
          address,
          city,
          state
        ),
        leads:leads(
          id,
          name,
          phone,
          status,
          created_at
        ),
        appointments:appointments(
          id,
          scheduled_at,
          status,
          type
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Unexpected error fetching vehicle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const supabase = await createClient()

    // Build update object (only include provided fields)
    const updates: any = {}
    const allowedFields = [
      'year', 'make', 'model', 'trim', 'vin', 'stock_number',
      'price', 'cost', 'sale_price', 'mileage',
      'exterior_color', 'interior_color', 'transmission',
      'fuel_type', 'engine', 'drivetrain', 'body_style',
      'status', 'condition', 'primary_image_url', 'image_urls',
      'features', 'description', 'marketing_title',
      'facebook_posted', 'facebook_post_url'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    // Update vehicle
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Unexpected error updating vehicle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()

    // Check if vehicle has any leads or appointments
    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('lead_count, appointment_count')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Error fetching vehicle:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Warn if vehicle has leads or appointments
    if (vehicle.lead_count > 0 || vehicle.appointment_count > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete vehicle with existing leads or appointments',
          lead_count: vehicle.lead_count,
          appointment_count: vehicle.appointment_count,
        },
        { status: 400 }
      )
    }

    // Delete vehicle
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting vehicle:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting vehicle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
