"use client"

import { useEffect, useState } from "react"
import { apiMe } from "@/lib/api/auth"

export function useMe() {
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const user = await apiMe()
        if (mounted) setMe(user)
      } catch {
        // 401 is handled by the interceptor; no-op here
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return { me, loading }
}
