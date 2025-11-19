import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test connection by counting leads
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({
        connected: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      connected: true,
      message: 'Successfully connected to Supabase',
      leadsCount: count
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
