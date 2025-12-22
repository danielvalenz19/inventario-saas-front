import { NextResponse } from "next/server"
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token.constants"
import { backendFetch } from "@/lib/api/backend.server"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string }
    const email = body?.email?.trim()
    const password = body?.password

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Email y password requeridos" }, { status: 400 })
    }

    const upstreamRes = await backendFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    })

    const upstreamJson = (await upstreamRes.json().catch(() => null)) as any
    if (!upstreamRes.ok) {
      return NextResponse.json(
        { ok: false, message: upstreamJson?.message ?? "Login fallo" },
        { status: upstreamRes.status }
      )
    }

    const accessToken: string | undefined = upstreamJson?.access_token
    if (!accessToken) {
      return NextResponse.json({ ok: false, message: "Login invalido" }, { status: 502 })
    }

    const res = NextResponse.json(
      { ok: true, usuario: upstreamJson?.usuario ?? null, user: upstreamJson?.user ?? null },
      { status: 200 }
    )

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
  } catch {
    return NextResponse.json({ ok: false, message: "Request invalido" }, { status: 400 })
  }
}
