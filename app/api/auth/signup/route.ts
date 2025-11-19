import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email, password, fullName, phone, role } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Check if user is authenticated (for admin-created users)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    // If role is dealer or admin, require authentication and admin role
    if (role === 'dealer' || role === 'admin') {
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Only admins can create dealer or admin accounts' },
          { status: 403 }
        )
      }

      // Check if current user is admin
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (currentProfile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only admins can create dealer or admin accounts' },
          { status: 403 }
        )
      }
    }

    // Default role for public signup is 'agent'
    const finalRole = role && (role === 'dealer' || role === 'admin') && currentUser ? role : 'agent'

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Profile is created automatically by database trigger
    // But we can update it if role is provided (for admin-created users)
    if (finalRole && finalRole !== 'agent') {
      // Wait a bit for trigger to complete, then update role
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: finalRole })
        .eq('id', data.user.id)

      if (updateError) {
        console.error('Error updating profile role:', updateError)
      }
    }

    // Fetch created profile (wait a bit for trigger to complete)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileFetchError) {
      console.error('Error fetching profile:', profileFetchError)
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      profile: profile || null,
    })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

