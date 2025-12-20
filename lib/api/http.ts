import axios from "axios"
import { clearAccessTokenClient, getAccessTokenClient } from "@/lib/auth/token.client"

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 20000,
})

http.interceptors.request.use((config) => {
  const token = getAccessTokenClient()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const reqUrl: string = err?.config?.url ?? ""

    // Avoid redirecting on intended 401 responses from login attempts
    const isLoginAttempt = reqUrl.includes("/auth/login")

    if (status === 401 && !isLoginAttempt) {
      clearAccessTokenClient()
      if (typeof window !== "undefined") window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
