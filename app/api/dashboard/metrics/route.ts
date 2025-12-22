import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token.constants"
import { backendFetch } from "@/lib/api/backend.server"

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null

  if (!token) return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 })

  const url = new URL(req.url)
  const search = url.search ? url.search : ""

  const upstreamRes = await backendFetch(`/dashboard/metrics${search}`, {
    method: "GET",
    token,
    cache: "no-store",
  })

  const upstreamJson = (await upstreamRes.json().catch(() => null)) as any
  return NextResponse.json(upstreamJson ?? { ok: false }, { status: upstreamRes.status })
}
