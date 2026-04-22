import { useEffect, useState } from 'react'
import { fetchLandingPageData } from '../lib/supabaseApi'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { LandingPageData } from '../types/models'
import { fallbackLandingData } from '../data/fallback'

export function useLandingData() {
  const [data, setData] = useState<LandingPageData>(fallbackLandingData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchLandingPageData()
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
      .channel('landing-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, async () => {
        if (isMounted) setData(await fetchLandingPageData())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, async () => {
        if (isMounted) setData(await fetchLandingPageData())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, async () => {
        if (isMounted) setData(await fetchLandingPageData())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, async () => {
        if (isMounted) setData(await fetchLandingPageData())
      })
      .subscribe()

    return () => {
      isMounted = false
      client.removeChannel(channel)
    }
  }, [])

  return { data, loading }
}
