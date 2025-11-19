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
    
    // Fetch message templates for the user
    // For now, we'll store templates in user metadata
    // In the future, this could be a separate templates table
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const templates = profile?.metadata?.message_templates || []

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const template = await request.json()

    // Get current profile metadata
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = currentProfile?.metadata || {}
    const templates = currentMetadata.message_templates || []
    
    // Add new template
    const newTemplate = {
      id: Date.now().toString(),
      ...template,
      created_at: new Date().toISOString(),
    }
    templates.push(newTemplate)

    const updatedMetadata = {
      ...currentMetadata,
      message_templates: templates,
    }

    const { error } = await supabase
      .from('profiles')
      .update({ metadata: updatedMetadata })
      .eq('id', user.id)

    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, template: newTemplate })
  } catch (error) {
    console.error('Error creating template:', error)
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
    const { id, ...templateData } = await request.json()

    // Get current profile metadata
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = currentProfile?.metadata || {}
    const templates = currentMetadata.message_templates || []
    
    // Update template
    const updatedTemplates = templates.map((t: any) => 
      t.id === id ? { ...t, ...templateData, updated_at: new Date().toISOString() } : t
    )

    const updatedMetadata = {
      ...currentMetadata,
      message_templates: updatedTemplates,
    }

    const { error } = await supabase
      .from('profiles')
      .update({ metadata: updatedMetadata })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating template:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    // Get current profile metadata
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = currentProfile?.metadata || {}
    const templates = currentMetadata.message_templates || []
    
    // Remove template
    const updatedTemplates = templates.filter((t: any) => t.id !== id)

    const updatedMetadata = {
      ...currentMetadata,
      message_templates: updatedTemplates,
    }

    const { error } = await supabase
      .from('profiles')
      .update({ metadata: updatedMetadata })
      .eq('id', user.id)

    if (error) {
      console.error('Error deleting template:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

