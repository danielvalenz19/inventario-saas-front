import "server-only"

export function getBackendBaseUrl(): string {
  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalizedPath}`
}

export async function backendFetch(
  path: string,
  init: RequestInit & { token?: string | null } = {}
): Promise<Response> {
  const { token, headers, ...rest } = init

  const mergedHeaders = new Headers(headers)
  if (token) mergedHeaders.set("Authorization", `Bearer ${token}`)

  return fetch(joinUrl(getBackendBaseUrl(), path), {
    ...rest,
    headers: mergedHeaders,
  })
}

