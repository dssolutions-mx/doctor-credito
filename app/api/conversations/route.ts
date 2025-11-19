import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const withPhone = searchParams.get('with_phone')
    const status = searchParams.get('status')

    let query = supabase
      .from('conversations')
      .select(`
        *,
        conversation_context(*),
        messages(
          id,
          role,
          content,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    // Filter conversations that have phone numbers captured
    if (withPhone === 'true') {
      query = query.not('phone_number', 'is', null)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversations: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
