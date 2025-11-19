'use client'

import { useState, useEffect } from 'react'

export function useLeads(status?: string) {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const url = status
          ? `/api/leads?status=${status}`
          : '/api/leads'

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch leads')

        const data = await response.json()
        setLeads(data.leads || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [status])

  return { leads, loading, error, refetch: () => {} }
}

export function useLead(id: string) {
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/leads/${id}`)
        if (!response.ok) throw new Error('Failed to fetch lead')

        const data = await response.json()
        setLead(data.lead)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLead()
    }
  }, [id])

  return { lead, loading, error }
}

export function useTasks(status?: string, leadId?: string) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (leadId) params.append('lead_id', leadId)

        const url = `/api/tasks${params.toString() ? `?${params}` : ''}`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch tasks')

        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [status, leadId])

  return { tasks, loading, error }
}

export function useAppointments(status?: string, leadId?: string) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (leadId) params.append('lead_id', leadId)

        const url = `/api/appointments${params.toString() ? `?${params}` : ''}`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch appointments')

        const data = await response.json()
        setAppointments(data.appointments || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [status, leadId])

  return { appointments, loading, error }
}

export function useConversations(withPhone?: boolean, status?: string) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (withPhone !== undefined) params.append('with_phone', withPhone.toString())
        if (status) params.append('status', status)

        const url = `/api/conversations${params.toString() ? `?${params}` : ''}`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch conversations')

        const data = await response.json()
        setConversations(data.conversations || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [withPhone, status])

  return { conversations, loading, error }
}
