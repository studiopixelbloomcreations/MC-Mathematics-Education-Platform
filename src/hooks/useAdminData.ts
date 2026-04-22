import { useEffect, useState } from 'react'
import { fallbackAdminData } from '../data/fallback'
import { fetchAdminData } from '../lib/supabaseApi'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { AdminData } from '../types/models'

export function useAdminData() {
  const [data, setData] = useState<AdminData>(fallbackAdminData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchAdminData()
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
      .channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
        if (isMounted) setData(await fetchAdminData())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, async () => {
        if (isMounted) setData(await fetchAdminData())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, async () => {
        if (isMounted) setData(await fetchAdminData())
      })
      .subscribe()

    return () => {
      isMounted = false
      client.removeChannel(channel)
    }
  }, [])

  return { data, loading }
}
