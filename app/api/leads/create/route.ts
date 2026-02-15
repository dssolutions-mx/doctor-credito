import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function POST(request: Request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const body = await request.json()
    const { conversation_id, assigned_to } = body

    // Use authenticated user as assigned_to if not provided
    const finalAssignedTo = assigned_to || user.id

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

    // 2. Extract conversation context (handle both array and single object)
    const context = Array.isArray(conversation.conversation_context) 
      ? conversation.conversation_context[0] 
      : conversation.conversation_context

    // Log context for debugging
    if (context) {
      console.log('Conversation context extracted:', {
        vehicle_interest: context.vehicle_interest,
        budget_range: context.budget_range,
        credit_situation: context.credit_situation,
        notes: context.notes,
      })
    } else {
      console.warn('No conversation context found for conversation:', conversation.id)
    }

    // Extract name from phone (placeholder - will be updated later)
    const name = conversation.phone_number || 'Lead sin nombre'

    // 3. Create lead with data from conversation and context
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        conversation_id: conversation.id,
        name: name,
        phone: conversation.phone_number,
        source: conversation.platform || 'facebook',
        vehicle_interest: context?.vehicle_interest || null,
        budget_range: context?.budget_range || null,
        credit_score_range: context?.credit_situation || null,
        urgency_level: conversation.urgency || null,
        status: 'nuevo',
        assigned_to: finalAssignedTo,
        notes: context?.notes || null,
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
      assigned_to: finalAssignedTo,
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

    // 5. Send new lead email alert via Edge Function (fire-and-forget)
    if (finalAssignedTo) {
      import('@/lib/invoke-edge-function').then(({ invokeEdgeFunction }) => {
        invokeEdgeFunction('send-new-lead-alert', {
          agent_user_id: finalAssignedTo,
          lead: {
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            vehicle_interest: lead.vehicle_interest,
            source: lead.source,
            urgency_level: lead.urgency_level,
          },
        })
      })
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
