export const AUTH_COOKIE_NAME = "inventa_session"

export const DEMO_CREDENTIALS = {
  email: "admin@inventagt.com",
  password: "admin123",
}

export const isValidCredentials = (email: string, password: string) => {
  return email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
}

export const setAuthCookie = () => {
  document.cookie = `${AUTH_COOKIE_NAME}=ok; path=/; max-age=604800; samesite=lax`
}

export const clearAuthCookie = () => {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
}

export const hasAuthCookie = () => {
  if (typeof document === "undefined") {
    return false
  }
  return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=ok`))
}
