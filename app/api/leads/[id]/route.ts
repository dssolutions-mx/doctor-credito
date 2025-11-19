import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const { id } = await params

    // Get lead with full context (without profile joins to avoid RLS recursion)
    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        conversation:conversations(
          *,
          messages(
            id,
            role,
            content,
            created_at
          ),
          conversation_context(*)
        ),
        interactions(
          id,
          type,
          content,
          outcome,
          duration_seconds,
          created_at,
          user_id
        ),
        tasks(
          id,
          title,
          description,
          task_type,
          priority,
          due_at,
          status,
          completed_at,
          assigned_to
        ),
        appointments(
          id,
          scheduled_at,
          duration_minutes,
          status,
          vehicle_interest,
          appointment_type,
          notes
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching lead:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Fetch all user profiles separately to avoid RLS recursion
    const userIds = new Set<string>()
    if (lead.assigned_to) userIds.add(lead.assigned_to)
    if (lead.interactions) {
      lead.interactions.forEach((i: any) => {
        if (i.user_id) userIds.add(i.user_id)
      })
    }
    if (lead.tasks) {
      lead.tasks.forEach((t: any) => {
        if (t.assigned_to) userIds.add(t.assigned_to)
      })
    }

    let userProfiles: Record<string, any> = {}
    if (userIds.size > 0) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', Array.from(userIds))
      
      if (users) {
        userProfiles = users.reduce((acc, u) => {
          acc[u.id] = u
          return acc
        }, {} as Record<string, any>)
      }
    }

    // Attach user data to lead
    const leadWithUsers = {
      ...lead,
      assigned_user: lead.assigned_to ? userProfiles[lead.assigned_to] || null : null,
      interactions: lead.interactions?.map((i: any) => ({
        ...i,
        user: i.user_id ? userProfiles[i.user_id] || null : null,
      })) || [],
      tasks: lead.tasks?.map((t: any) => ({
        ...t,
        assigned_user: t.assigned_to ? userProfiles[t.assigned_to] || null : null,
      })) || [],
    }

    return NextResponse.json({ lead: leadWithUsers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
