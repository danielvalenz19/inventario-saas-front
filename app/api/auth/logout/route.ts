import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token.constants"
import { backendFetch } from "@/lib/api/backend.server"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null

  try {
    await backendFetch("/auth/logout", { method: "POST", token, cache: "no-store" })
  } catch {
    // ignore upstream errors; still clear session cookie
  }

  const res = NextResponse.json({ ok: true }, { status: 200 })
  res.cookies.set({
    name: AUTH_TOKEN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return res
}
