import { http } from "./http"

export type LoginResponse = {
  ok: boolean
  access_token?: string
  usuario?: { id: number; nombre: string; email: string; roles: string[] }
  user?: any
  message?: string
}

export type MeResponse = {
  ok: boolean
  user?: {
    usuario_id: number
    empresa_id: number
    sucursal_id: number
    email: string
    nombres: string
    apellidos?: string | null
    roles: string[]
    permisos: string[]
  }
  message?: string
}

export async function apiLogin(email: string, password: string) {
  const { data } = await http.post<LoginResponse>("/auth/login", { email, password })

  if (!data?.ok || !data?.access_token) {
    throw new Error(data?.message ?? "Login fallo")
  }

  return { accessToken: data.access_token, usuario: data.usuario ?? null }
}

export async function apiMe() {
  const { data } = await http.get<MeResponse>("/auth/me")
  if (!data?.ok || !data?.user) throw new Error(data?.message ?? "No se pudo obtener /auth/me")
  return data.user
}

export async function apiLogout() {
  const { data } = await http.post("/auth/logout")
  return data
}

export async function apiRefresh() {
  const { data } = await http.post<{ ok: boolean; access_token?: string; message?: string }>("/auth/refresh")
  if (!data?.ok || !data?.access_token) throw new Error(data?.message ?? "No se pudo refrescar token")
  return data.access_token
}
