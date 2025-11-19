import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Get lead with full context
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
          user:profiles!user_id(
            full_name
          )
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
          assigned_user:profiles!assigned_to(
            full_name
          )
        ),
        appointments(
          id,
          scheduled_at,
          duration_minutes,
          status,
          vehicle_interest,
          appointment_type,
          notes
        ),
        assigned_user:profiles!assigned_to(
          full_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching lead:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ lead })
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
