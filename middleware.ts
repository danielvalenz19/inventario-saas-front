import { NextResponse, type NextRequest } from "next/server"
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token.constants"

const PUBLIC_PATHS = new Set(["/login"])

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) return NextResponse.next()
  if (pathname.startsWith("/_next")) return NextResponse.next()
  if (pathname === "/favicon.ico") return NextResponse.next()

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  const token = req.cookies.get(AUTH_TOKEN_COOKIE)?.value
  if (token) return NextResponse.next()

  const loginUrl = new URL("/login", req.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/:path*"],
}
