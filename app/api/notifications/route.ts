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
    
    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()

    const notifications: Array<{
      id: string
      type: "lead" | "appointment" | "conversation" | "task"
      title: string
      description: string
      time: string
      read: boolean
      link?: string
    }> = []

    // Get recent conversations (last 24 hours)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    let conversationsQuery = supabase
      .from('conversations')
      .select(`
        id,
        platform,
        phone_number,
        created_at,
        last_message_at,
        status,
        leads!leads_conversation_id_fkey(
          id,
          name,
          vehicle_interest
        )
      `)
      .gte('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: recentConversations } = await conversationsQuery

    // Convert conversations to notifications
    if (recentConversations) {
      recentConversations.forEach((conv: any) => {
        const createdAt = new Date(conv.created_at || conv.last_message_at || Date.now())
        const timeAgo = getTimeAgo(createdAt)
        
        // Handle leads as array (from foreign key relationship)
        const leads = Array.isArray(conv.leads) ? conv.leads : (conv.leads ? [conv.leads] : [])
        const lead = leads[0]
        const leadName = lead?.name || 'Cliente sin nombre'
        const vehicleInterest = lead?.vehicle_interest || 'vehículo'
        const platform = conv.platform === 'facebook' ? 'Facebook' : 'WhatsApp'

        notifications.push({
          id: `conv-${conv.id}`,
          type: "conversation",
          title: `Nueva conversación de ${platform}`,
          description: `${leadName} interesado en ${vehicleInterest}`,
          time: timeAgo,
          read: false,
          link: `/conversations`,
        })
      })
    }

    // Get recent leads (last 24 hours)
    let leadsQuery = supabase
      .from('leads')
      .select('id, name, source, created_at, vehicle_interest, status')
      .gte('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    // Filter by role
    if (userProfile?.role === 'dealer') {
      leadsQuery = leadsQuery.eq('assigned_to', user.id)
    }

    const { data: recentLeads } = await leadsQuery

    // Convert leads to notifications (only if not already from conversations)
    if (recentLeads) {
      const conversationLeadIds = new Set(
        recentConversations?.map(c => c.leads?.[0]?.id).filter(Boolean) || []
      )

      recentLeads.forEach((lead) => {
        // Skip if already notified via conversation
        if (conversationLeadIds.has(lead.id)) return

        const createdAt = new Date(lead.created_at)
        const timeAgo = getTimeAgo(createdAt)
        const source = lead.source === 'facebook' ? 'Facebook' : 
                      lead.source === 'website' ? 'Sitio web' :
                      lead.source === 'phone' ? 'Teléfono' : 'Referido'

        notifications.push({
          id: `lead-${lead.id}`,
          type: "lead",
          title: `Nuevo lead de ${source}`,
          description: `${lead.name || 'Cliente sin nombre'} - ${lead.vehicle_interest || 'Sin interés específico'}`,
          time: timeAgo,
          read: false,
          link: `/leads/${lead.id}`,
        })
      })
    }

    // Get upcoming appointments (next 2 hours)
    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)

    let appointmentsQuery = supabase
      .from('appointments')
      .select(`
        id,
        scheduled_at,
        appointment_type,
        lead:leads(
          id,
          name,
          vehicle_interest
        )
      `)
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', twoHoursFromNow.toISOString())
      .eq('status', 'confirmada')
      .order('scheduled_at', { ascending: true })
      .limit(5)

    // Filter by role
    if (userProfile?.role === 'dealer') {
      appointmentsQuery = appointmentsQuery.eq('dealer_id', user.id)
    }

    const { data: upcomingAppointments } = await appointmentsQuery

    // Convert appointments to notifications
    if (upcomingAppointments) {
      upcomingAppointments.forEach((apt: any) => {
        const scheduledAt = new Date(apt.scheduled_at)
        const timeUntil = getTimeUntil(scheduledAt)
        // Handle lead as object (from join)
        const lead = apt.lead || {}
        const leadName = lead.name || 'Cliente sin nombre'
        const appointmentType = getAppointmentTypeLabel(apt.appointment_type)
        const timeStr = scheduledAt.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

        notifications.push({
          id: `apt-${apt.id}`,
          type: "appointment",
          title: `Cita ${timeUntil}`,
          description: `${leadName} - ${appointmentType} a las ${timeStr}`,
          time: timeUntil,
          read: false,
          link: `/appointments/${apt.id}`,
        })
      })
    }

    // Get recent tasks (due today or overdue, not completed)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let tasksQuery = supabase
      .from('tasks')
      .select('id, title, description, due_at, status, lead:leads(id, name)')
      .lte('due_at', today.toISOString())
      .neq('status', 'completed')
      .order('due_at', { ascending: true })
      .limit(5)

    // Filter by role
    if (userProfile?.role === 'dealer') {
      // Dealers might not have tasks assigned directly, but we can check
      tasksQuery = tasksQuery.eq('assigned_to', user.id)
    }

    const { data: recentTasks } = await tasksQuery

    // Convert tasks to notifications
    if (recentTasks) {
      recentTasks.forEach((task: any) => {
        const dueAt = task.due_at ? new Date(task.due_at) : null
        const timeStr = dueAt ? getTimeAgo(dueAt) : 'Sin fecha'
        // Handle lead as object (from join)
        const lead = task.lead || {}
        const leadName = lead.name || 'Sin lead asignado'

        notifications.push({
          id: `task-${task.id}`,
          type: "task",
          title: task.title || 'Recordatorio de tarea',
          description: `${leadName} - ${task.description || ''}`,
          time: timeStr,
          read: false,
          link: `/tasks`,
        })
      })
    }

    // Sort notifications by time (most recent first)
    notifications.sort((a, b) => {
      // Parse time strings to sort properly
      // For "X min ago" format, extract number
      const getMinutes = (timeStr: string) => {
        const match = timeStr.match(/(\d+)\s*(min|hour|day)/)
        if (!match) return Infinity
        const num = parseInt(match[1])
        const unit = match[2]
        if (unit === 'min') return num
        if (unit === 'hour') return num * 60
        if (unit === 'day') return num * 60 * 24
        return Infinity
      }
      return getMinutes(a.time) - getMinutes(b.time)
    })

    return NextResponse.json({ notifications: notifications.slice(0, 20) })
  } catch (error) {
    console.error('Unexpected error fetching notifications:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function getTimeUntil(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 0) return 'Ya pasó'
  if (diffMins < 60) return `en ${diffMins} min`
  if (diffHours < 2) return `en ${diffHours} hora`
  return `en ${diffHours} horas`
}

function getAppointmentTypeLabel(type: string | null): string {
  const labels: Record<string, string> = {
    test_drive: 'Test Drive',
    credit_approval: 'Aprobación de crédito',
    delivery: 'Entrega',
    trade_in: 'Trade-in',
    consultation: 'Consulta',
    showroom: 'Showroom',
  }
  return labels[type || ''] || 'Cita'
}

