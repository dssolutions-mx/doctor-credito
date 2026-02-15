import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    
    // Fetch user notification preferences
    // For now, we'll store this in user metadata or a separate table
    // Since we don't have a notifications_preferences table yet, we'll use profile metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const defaults = {
      newLeadNotifications: true,
      appointmentReminders: true,
      followUpReminders: true,
      emailNotifications: false,
      immediateEmailAlerts: true,
      smsNotifications: true,
    }
    const stored = profile?.metadata?.notification_preferences || {}
    const preferences = { ...defaults, ...stored }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching notification preferences:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const { preferences } = await request.json()

    // Get current profile metadata
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = currentProfile?.metadata || {}
    
    // Update notification preferences in metadata
    const updatedMetadata = {
      ...currentMetadata,
      notification_preferences: preferences,
    }

    const { error } = await supabase
      .from('profiles')
      .update({ metadata: updatedMetadata })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating notification preferences:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, preferences })
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

