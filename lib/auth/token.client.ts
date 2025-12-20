"use client"

import { AUTH_TOKEN_COOKIE } from "./token.constants"

export function getAccessTokenClient(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${AUTH_TOKEN_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export function setAccessTokenClient(token: string, days = 1) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Expires=${expires}; Path=/; SameSite=Lax`
}

export function clearAccessTokenClient() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_TOKEN_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
}
