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
  const [refreshKey, setRefreshKey] = useState(0)

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
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [status, leadId, refreshKey])

  const refetch = () => {
    setRefreshKey(prev => prev + 1)
  }

  return { tasks, loading, error, refetch }
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
    let retryCount = 0
    const maxRetries = 3

    const fetchConversations = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (withPhone !== undefined) params.append('with_phone', withPhone.toString())
        if (status) params.append('status', status)

        const url = `/api/conversations${params.toString() ? `?${params}` : ''}`
        const response = await fetch(url, {
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch conversations: ${response.statusText}`)
        }

        const data = await response.json()

        // Ensure we always have an array
        if (!Array.isArray(data.conversations)) {
          console.warn('Conversations API returned non-array data:', data)
          setConversations([])
        } else {
          setConversations(data.conversations)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)

        // Retry logic for transient errors
        if (retryCount < maxRetries && (errorMessage.includes('fetch') || errorMessage.includes('network'))) {
          retryCount++
          setTimeout(() => {
            fetchConversations()
          }, 1000 * retryCount) // Exponential backoff
        } else {
          console.error('Error fetching conversations:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [withPhone, status])

  return { conversations, loading, error, refetch: () => {
    setLoading(true)
    setError(null)
    // Trigger re-fetch by updating a dependency
    const params = new URLSearchParams()
    if (withPhone !== undefined) params.append('with_phone', withPhone.toString())
    if (status) params.append('status', status)
    fetch(`/api/conversations${params.toString() ? `?${params}` : ''}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setConversations(Array.isArray(data.conversations) ? data.conversations : [])
        setLoading(false)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      })
  } }
}

export function useVehicles(status?: string, make?: string, dealerId?: string) {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (make) params.append('make', make)
      if (dealerId) params.append('dealer_id', dealerId)

      const url = `/api/inventory${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) throw new Error('Failed to fetch vehicles')

      const data = await response.json()
      setVehicles(data.vehicles || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [status, make, dealerId, refreshKey])

  const refetch = () => {
    setRefreshKey(prev => prev + 1)
  }

  return { vehicles, loading, error, refetch }
}

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/inventory/${id}`)
        if (!response.ok) throw new Error('Failed to fetch vehicle')

        const data = await response.json()
        setVehicle(data.vehicle)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVehicle()
    }
  }, [id])

  return { vehicle, loading, error }
}
