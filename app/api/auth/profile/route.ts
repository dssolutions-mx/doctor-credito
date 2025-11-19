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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      // Return null profile instead of error - profile might not exist yet
      return NextResponse.json({
        profile: null,
        error: profileError.code === 'PGRST116' ? null : profileError.message, // PGRST116 = no rows returned
      })
    }

    return NextResponse.json({ profile: profile || null })
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', profile: null },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const body = await request.json()

    // Users can only update their own profile
    // Role changes should be restricted (only admins can change roles)
    const updateData: any = {}
    
    if (body.full_name !== undefined) updateData.full_name = body.full_name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url
    
    // Only allow role update if user is admin (check current profile)
    if (body.role !== undefined) {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (currentProfile?.role === 'admin') {
        // Admins can update roles, but this should be done via user management
        // For now, we'll allow it but log it
        console.warn('Admin updating role via profile endpoint')
      } else {
        // Non-admins cannot update role
        return NextResponse.json(
          { error: 'Only admins can update user roles' },
          { status: 403 }
        )
      }
    }

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

