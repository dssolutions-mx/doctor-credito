import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { lead_id, type, outcome, notes, duration_seconds } = body

    // Get current user (will need proper auth later)
    const { data: { user } } = await supabase.auth.getUser()

    // Log the interaction
    const { data: interaction, error } = await supabase
      .from('interactions')
      .insert({
        lead_id,
        user_id: user?.id || null,
        type: type || 'call_outbound',
        content: notes,
        outcome,
        duration_seconds,
      })
      .select()
      .single()

    if (error) {
      console.error('Error logging interaction:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update lead's last_contact_at
    await supabase
      .from('leads')
      .update({
        last_contact_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id)

    // If call was successful and lead is 'nuevo', mark as 'contactado'
    if (outcome === 'answered') {
      await supabase
        .from('leads')
        .update({ status: 'contactado' })
        .eq('id', lead_id)
        .eq('status', 'nuevo')
    }

    return NextResponse.json({ interaction })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
