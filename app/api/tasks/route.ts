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

    let query = supabase
      .from('tasks')
      .select(`
        *,
        lead:leads(
          id,
          name,
          phone,
          vehicle_interest
        )
      `)
      .order('due_at', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data: tasks, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch assigned user profiles separately to avoid RLS recursion
    const assignedUserIds = tasks?.map(t => t.assigned_to).filter(Boolean) || []
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

    // Attach assigned user data to tasks
    const tasksWithUsers = tasks?.map(task => ({
      ...task,
      assigned_user: task.assigned_to ? assignedUsers[task.assigned_to] || null : null,
    })) || []

    return NextResponse.json({ tasks: tasksWithUsers })
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

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...body,
        auto_generated: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
