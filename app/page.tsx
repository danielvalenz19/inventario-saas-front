import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AUTH_COOKIE_NAME } from "@/lib/auth"

export default function Home() {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get(AUTH_COOKIE_NAME)?.value === "ok"
  redirect(isAuthenticated ? "/dashboard" : "/login")
}
