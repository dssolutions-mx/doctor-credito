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
    const search = searchParams.get('search')

    // Get user profile to check role for filtering
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('leads')
      .select(`
        *,
        conversation:conversations(
          phone_number,
          last_intent,
          urgency,
          platform
        ),
        conversation_context:conversations(
          conversation_context(
            vehicle_interest,
            budget_range,
            credit_situation,
            urgency_indicators
          )
        ),
        vehicle:vehicles(
          id,
          year,
          make,
          model,
          trim,
          price,
          mileage,
          stock_number,
          primary_image_url,
          exterior_color,
          status
        )
      `)
      .order('created_at', { ascending: false })

    // Filter leads based on role
    // Dealers can only see leads assigned to them or their dealership
    // Agents can see all leads
    // Admins can see all leads
    if (userProfile?.role === 'dealer') {
      // Dealers see leads assigned to them or unassigned leads
      query = query.or(`assigned_to.eq.${user.id},assigned_to.is.null`)
    }
    // Agents and admins see all leads (no filter)

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch assigned user profiles separately to avoid RLS recursion
    const leadIds = leads?.map(l => l.assigned_to).filter(Boolean) || []
    let assignedUsers: Record<string, any> = {}
    
    if (leadIds.length > 0) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', [...new Set(leadIds)])
      
      if (users) {
        assignedUsers = users.reduce((acc, u) => {
          acc[u.id] = u
          return acc
        }, {} as Record<string, any>)
      }
    }

    // Attach assigned user data to leads
    const leadsWithUsers = leads?.map(lead => ({
      ...lead,
      assigned_user: lead.assigned_to ? assignedUsers[lead.assigned_to] || null : null,
    })) || []

    return NextResponse.json({ leads: leadsWithUsers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user, profile, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const supabase = await createClient()

    // 1. Duplicate Check
    if (body.phone) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, assigned_to')
        .eq('phone', body.phone)
        .single()
      
      if (existingLead) {
        return NextResponse.json(
          { 
            error: 'Lead with this phone number already exists', 
            lead_id: existingLead.id,
            assigned_to: existingLead.assigned_to
          }, 
          { status: 409 }
        )
      }
    }

    // 2. Prepare Data
    const statusVal = body.status || 'nuevo'
    const leadData: Record<string, unknown> = {
      conversation_id: body.conversation_id || null,
      name: body.name,
      phone: body.phone,
      source: body.source,
      vehicle_interest: body.vehicle_interest,
      budget_range: body.budget_range,
      status: statusVal === 'new' ? 'nuevo' : statusVal,
      urgency_level: body.urgency_level || 'media',
      notes: body.notes,
      assigned_to: body.assigned_to || user.id,
      occupation: body.occupation || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      credit_type: body.credit_type || null,
      down_payment_amount: body.down_payment_amount ?? null,
      has_cosigner: body.has_cosigner ?? false,
      has_other_employment: body.has_other_employment ?? null,
      has_company: body.has_company ?? null,
      company_name: body.company_name || null,
      has_driver_license: body.has_driver_license ?? null,
      has_id: body.has_id ?? null,
      has_passport: body.has_passport ?? null,
      has_ssn: body.has_ssn ?? null,
      has_tax_id: body.has_tax_id ?? null,
      vehicle_id: body.vehicle_id || null,
      metadata: {
        vehicle_id: body.vehicle_id,
        trade_in: body.trade_in,
        financing_type: body.financing_type,
        email: body.metadata?.email,
        ...body.metadata
      }
    }

    // 3. Insert Lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 4. Log Interaction (Manual Creation)
    await supabase.from('interactions').insert({
      lead_id: lead.id,
      user_id: user.id,
      type: 'creation',
      content: 'Lead created manually',
      metadata: { source: 'manual_entry' }
    })
    
    // 5. Create Initial Task
    await supabase.from('tasks').insert({
        lead_id: lead.id,
        assigned_to: lead.assigned_to,
        title: 'Contact New Lead',
        description: 'Lead created manually - please make initial contact.',
        task_type: 'call',
        priority: lead.urgency_level === 'urgent' ? 'urgent' : 'high',
        due_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins
        status: 'pendiente',
        auto_generated: true
    })

    // 6. Send new lead email alert via Edge Function (fire-and-forget)
    if (lead.assigned_to) {
      import('@/lib/invoke-edge-function').then(({ invokeEdgeFunction }) => {
        invokeEdgeFunction('send-new-lead-alert', {
          agent_user_id: lead.assigned_to,
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

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating lead:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
