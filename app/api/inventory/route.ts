import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

// Note: Vehicles/inventory table doesn't exist yet in the database
// This is a placeholder API route that can be implemented once the table is created
// For now, it returns an empty array with a note about the missing table

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

    // TODO: Once vehicles table is created, implement actual query:
    // let query = supabase.from('vehicles').select('*')
    // if (status) query = query.eq('status', status)
    // if (make) query = query.eq('make', make)
    // if (search) {
    //   query = query.or(`year.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%,stock.ilike.%${search}%`)
    // }
    // const { data, error } = await query

    // For now, return empty array with message
    return NextResponse.json({
      vehicles: [],
      message: 'Vehicles table not yet implemented in database',
    })
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
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    // TODO: Implement once vehicles table exists
    return NextResponse.json(
      { error: 'Vehicles table not yet implemented in database' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Unexpected error creating vehicle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

