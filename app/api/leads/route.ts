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

    // Get user profile to check role for filtering
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('leads')
      .select(`
        *,
        conversation:conversations(
          phone_number,
          last_intent,
          urgency,
          platform
        ),
        conversation_context:conversations(
          conversation_context(
            vehicle_interest,
            budget_range,
            credit_situation,
            urgency_indicators
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Filter leads based on role
    // Dealers can only see leads assigned to them or their dealership
    // Agents can see all leads
    // Admins can see all leads
    if (userProfile?.role === 'dealer') {
      // Dealers see leads assigned to them or unassigned leads
      query = query.or(`assigned_to.eq.${user.id},assigned_to.is.null`)
    }
    // Agents and admins see all leads (no filter)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch assigned user profiles separately to avoid RLS recursion
    const leadIds = leads?.map(l => l.assigned_to).filter(Boolean) || []
    let assignedUsers: Record<string, any> = {}
    
    if (leadIds.length > 0) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', [...new Set(leadIds)])
      
      if (users) {
        assignedUsers = users.reduce((acc, u) => {
          acc[u.id] = u
          return acc
        }, {} as Record<string, any>)
      }
    }

    // Attach assigned user data to leads
    const leadsWithUsers = leads?.map(lead => ({
      ...lead,
      assigned_user: lead.assigned_to ? assignedUsers[lead.assigned_to] || null : null,
    })) || []

    return NextResponse.json({ leads: leadsWithUsers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
