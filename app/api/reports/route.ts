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
    
    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Date range filters (optional)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Build date filter
    let dateFilter = {}
    if (startDate || endDate) {
      dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      }
    }

    // Fetch leads data
    let leadsQuery = supabase
      .from('leads')
      .select('id, status, source, created_at, deal_amount, deal_closed_at, commission_amount, assigned_to, dealer_id')

    // Filter by date if provided
    if (startDate || endDate) {
      leadsQuery = leadsQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString())
    }

    // Dealers can only see their own leads
    if (userProfile?.role === 'dealer') {
      // Get dealer_id from user profile or dealer association
      // For now, filter by assigned_to
      leadsQuery = leadsQuery.eq('assigned_to', user.id)
    }

    const { data: leads, error: leadsError } = await leadsQuery

    if (leadsError) {
      console.error('Error fetching leads for reports:', leadsError)
    }

    // Fetch appointments data
    let appointmentsQuery = supabase
      .from('appointments')
      .select('id, status, appointment_type, scheduled_at, completed_at, lead_id, dealer_id')

    if (startDate || endDate) {
      appointmentsQuery = appointmentsQuery
        .gte('scheduled_at', startDate || '1970-01-01')
        .lte('scheduled_at', endDate || new Date().toISOString())
    }

    if (userProfile?.role === 'dealer') {
      appointmentsQuery = appointmentsQuery.eq('dealer_id', user.id)
    }

    const { data: appointments, error: appointmentsError } = await appointmentsQuery

    if (appointmentsError) {
      console.error('Error fetching appointments for reports:', appointmentsError)
    }

    // Calculate statistics
    const totalLeads = leads?.length || 0
    const totalAppointments = appointments?.length || 0
    
    // Lead statistics
    const leadsByStatus = (leads || []).reduce((acc: Record<string, number>, lead) => {
      const status = lead.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const leadsBySource = (leads || []).reduce((acc: Record<string, number>, lead) => {
      const source = lead.source || 'unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    // Revenue calculations (from closed deals)
    const closedLeads = (leads || []).filter(l => l.deal_closed_at && l.deal_amount)
    const totalRevenue = closedLeads.reduce((sum, lead) => sum + (Number(lead.deal_amount) || 0), 0)
    const totalCommission = closedLeads.reduce((sum, lead) => sum + (Number(lead.commission_amount) || 0), 0)

    // Appointment statistics
    const appointmentsByStatus = (appointments || []).reduce((acc: Record<string, number>, apt) => {
      const status = apt.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const appointmentsByType = (appointments || []).reduce((acc: Record<string, number>, apt) => {
      const type = apt.appointment_type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Conversion rate (leads that became appointments)
    const leadsWithAppointments = new Set((appointments || []).map(a => a.lead_id).filter(Boolean))
    const conversionRate = totalLeads > 0 
      ? ((leadsWithAppointments.size / totalLeads) * 100).toFixed(1)
      : '0.0'

    // Monthly performance (group by month)
    const monthlyData = (leads || []).reduce((acc: Record<string, { leads: number; revenue: number }>, lead) => {
      if (!lead.created_at) return acc
      const month = new Date(lead.created_at).toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { leads: 0, revenue: 0 }
      }
      acc[month].leads += 1
      if (lead.deal_amount) {
        acc[month].revenue += Number(lead.deal_amount) || 0
      }
      return acc
    }, {})

    return NextResponse.json({
      summary: {
        totalLeads,
        totalAppointments,
        totalRevenue,
        totalCommission,
        conversionRate: parseFloat(conversionRate),
        closedDeals: closedLeads.length,
      },
      leadsByStatus,
      leadsBySource,
      appointmentsByStatus,
      appointmentsByType,
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
    })
  } catch (error) {
    console.error('Unexpected error generating reports:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

