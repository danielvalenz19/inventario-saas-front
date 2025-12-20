import { cookies } from "next/headers"
import { AUTH_TOKEN_COOKIE } from "./token.constants"

export function getAccessTokenServer(): string | null {
  return cookies().get(AUTH_TOKEN_COOKIE)?.value ?? null
}
