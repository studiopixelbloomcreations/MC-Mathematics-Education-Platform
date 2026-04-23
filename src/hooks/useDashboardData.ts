import { useEffect, useState } from 'react'
import { fallbackDashboardData } from '../data/fallback'
import { fetchDashboardData } from '../lib/supabaseApi'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { DashboardData } from '../types/models'

export function useDashboardData(userId: string | null | undefined) {
  const [data, setData] = useState<DashboardData>(fallbackDashboardData)
  const [loading, setLoading] = useState(() => Boolean(userId))

  useEffect(() => {
    if (!userId) return

    let isMounted = true

    fetchDashboardData(userId)
      .then((payload) => {
        if (isMounted) setData(payload)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    if (!hasSupabaseConfig || !supabase) {
      return () => {
        isMounted = false
      }
    }

    const client = supabase
    const channel = client
      .channel(`dashboard-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marks', filter: `user_id=eq.${userId}` }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `user_id=eq.${userId}` }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'papers' }, async () => {
        if (isMounted) setData(await fetchDashboardData(userId))
      })
      .subscribe()

    return () => {
      isMounted = false
      client.removeChannel(channel)
    }
  }, [userId])

  return { data, loading, setData }
}
