import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find conversations with phone numbers that don't have leads yet
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_context(*),
        leads!leads_conversation_id_fkey(id)
      `)
      .not('phone_number', 'is', null)
      .in('status', ['active', 'closed'])
      .is('leads.id', null) // No existing lead

    if (convError) {
      console.error('Error fetching conversations:', convError)
      return NextResponse.json({ error: convError.message }, { status: 500 })
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ 
        message: 'No conversations to process',
        created: 0 
      })
    }

    const createdLeads = []
    const errors = []

    // Process each conversation
    for (const conversation of conversations) {
      try {
        // Extract conversation context (handle both array and single object)
        const context = Array.isArray(conversation.conversation_context) 
          ? conversation.conversation_context[0] 
          : conversation.conversation_context

        const name = conversation.phone_number || 'Lead sin nombre'

        // Create lead with all context data
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
            assigned_to: null, // Can be assigned later
            notes: context?.notes || null,
          })
          .select()
          .single()

        if (leadError) {
          errors.push({ conversation_id: conversation.id, error: leadError.message })
          continue
        }

        // Create urgent task
        await supabase.from('tasks').insert({
          lead_id: lead.id,
          assigned_to: null,
          title: 'Llamar a nuevo lead',
          description: `Lead caliente de ${conversation.platform || 'Facebook Messenger'} - contactar inmediatamente`,
          task_type: 'llamar',
          priority: 'urgente',
          due_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
          status: 'pendiente',
          auto_generated: true,
        })

        createdLeads.push(lead.id)
      } catch (error) {
        errors.push({ 
          conversation_id: conversation.id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return NextResponse.json({
      message: `Processed ${conversations.length} conversations`,
      created: createdLeads.length,
      lead_ids: createdLeads,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

