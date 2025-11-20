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
    const make = searchParams.get('make')
    const search = searchParams.get('search')
    const dealerId = searchParams.get('dealer_id')

    // Build query with joins to get dealer info
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        dealer:dealers(
          id,
          name,
          contact_phone,
          contact_email
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (make) {
      query = query.eq('make', make)
    }

    if (dealerId) {
      query = query.eq('dealer_id', dealerId)
    }

    if (search) {
      // Search across multiple fields
      query = query.or(
        `year.eq.${search},` +
        `make.ilike.%${search}%,` +
        `model.ilike.%${search}%,` +
        `stock_number.ilike.%${search}%,` +
        `vin.ilike.%${search}%`
      )
    }

    const { data: vehicles, error } = await query

    if (error) {
      console.error('Error fetching vehicles:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Unexpected error fetching inventory:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const { user, profile, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const supabase = await createClient()

    // Get dealer_id from profile if not provided
    const dealerId = body.dealer_id || profile?.dealer_id

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['year', 'make', 'model', 'vin', 'stock_number', 'price', 'mileage']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Insert vehicle
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        dealer_id: dealerId,
        year: body.year,
        make: body.make,
        model: body.model,
        trim: body.trim || null,
        vin: body.vin,
        stock_number: body.stock_number,
        price: body.price,
        mileage: body.mileage,
        exterior_color: body.exterior_color || null,
        interior_color: body.interior_color || null,
        transmission: body.transmission || null,
        fuel_type: body.fuel_type || null,
        engine: body.engine || null,
        drivetrain: body.drivetrain || null,
        body_style: body.body_style || null,
        status: body.status || 'available',
        condition: body.condition || 'used',
        primary_image_url: body.primary_image_url || null,
        image_urls: body.image_urls || [],
        features: body.features || [],
        description: body.description || null,
        facebook_posted: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating vehicle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

