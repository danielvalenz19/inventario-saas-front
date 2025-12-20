import { redirect } from "next/navigation"
import { getAccessTokenServer } from "@/lib/auth/token.server"

export default function Home() {
  const token = getAccessTokenServer()
  redirect(token ? "/dashboard" : "/login")
}
