import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { conversation_id, assigned_to } = body

    // 1. Get conversation data with context
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_context(*)
      `)
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // 2. Extract name from phone (placeholder - will be updated later)
    const name = conversation.phone_number || 'Lead sin nombre'

    // 3. Create lead with data from conversation
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        conversation_id: conversation.id,
        name: name,
        phone: conversation.phone_number,
        source: conversation.platform || 'facebook',
        vehicle_interest: conversation.conversation_context?.[0]?.vehicle_interest,
        budget_range: conversation.conversation_context?.[0]?.budget_range,
        credit_score_range: conversation.conversation_context?.[0]?.credit_situation,
        urgency_level: conversation.urgency,
        status: 'nuevo',
        assigned_to: assigned_to || null,
      })
      .select()
      .single()

    if (leadError) {
      console.error('Error creating lead:', leadError)
      return NextResponse.json({ error: leadError.message }, { status: 500 })
    }

    // 4. Create first task (call within 5 minutes)
    const { error: taskError } = await supabase.from('tasks').insert({
      lead_id: lead.id,
      assigned_to: assigned_to || null,
      title: 'Llamar a nuevo lead',
      description: 'Lead caliente de Facebook Messenger - contactar inmediatamente',
      task_type: 'llamar',
      priority: 'urgente',
      due_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
      status: 'pendiente',
      auto_generated: true,
    })

    if (taskError) {
      console.error('Error creating task:', taskError)
      // Don't fail the request if task creation fails
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
