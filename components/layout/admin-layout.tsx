"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { hasAuthCookie } from "@/lib/auth"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (hasAuthCookie()) {
      setAuthorized(true)
      setChecked(true)
      return
    }

    setAuthorized(false)
    setChecked(true)
    router.replace("/login")
  }, [router])

  if (!checked) {
    return <div className="min-h-screen bg-background" />
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
