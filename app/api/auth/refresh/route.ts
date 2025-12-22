import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token.constants"
import { backendFetch } from "@/lib/api/backend.server"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null

  if (!token) return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 })

  const upstreamRes = await backendFetch("/auth/refresh", { method: "POST", token, cache: "no-store" })
  const upstreamJson = (await upstreamRes.json().catch(() => null)) as any

  if (!upstreamRes.ok) {
    return NextResponse.json(upstreamJson ?? { ok: false }, { status: upstreamRes.status })
  }

  const accessToken: string | undefined = upstreamJson?.access_token
  if (!accessToken) {
    return NextResponse.json({ ok: false, message: "Refresh invalido" }, { status: 502 })
  }

  const res = NextResponse.json(upstreamJson, { status: 200 })
  res.cookies.set({
    name: AUTH_TOKEN_COOKIE,
    value: accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
  return res
}
