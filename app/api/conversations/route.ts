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
    const withPhone = searchParams.get('with_phone')
    const status = searchParams.get('status')
    const showAll = searchParams.get('show_all') === 'true'

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
        ),
        leads!leads_conversation_id_fkey(
          id,
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    // Filter logic:
    // - If with_phone=true: Show conversations with phone (active OR closed)
    // - If status is specified: Filter by that status
    // - If show_all=true: Show all conversations regardless of status
    // - Default: Show active conversations
    
    if (withPhone === 'true') {
      // Show conversations with phone numbers (both active and closed)
      query = query.not('phone_number', 'is', null)
      // Don't filter by status if we want to show closed conversations with phone
      if (!showAll && !status) {
        // Default: show active OR closed conversations with phone
        query = query.in('status', ['active', 'closed'])
      }
    }

    if (status && !showAll) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversations: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
