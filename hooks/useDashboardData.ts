import { useEffect, useState } from "react"
import type { DailyMetric, InventoryItem } from "@/types/reporting"

interface DashboardResponse {
  metrics: {
    ventas: number
    compras: number
    utilidad: number
  }
  chartData: DailyMetric[]
  lowStock: InventoryItem[]
}

type ApiOkResponse = { ok: true; data: DashboardResponse }
type ApiErrorResponse = { ok: false; message?: string }
type ApiResponse = ApiOkResponse | ApiErrorResponse

export const useDashboardData = (sucursalId: number, fechaDesde: string, fechaHasta: string) => {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sucursalId || !fechaDesde || !fechaHasta) return

    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const query = new URLSearchParams({
          sucursalId: String(sucursalId),
          fechaDesde,
          fechaHasta,
        })

        const res = await fetch(`/api/dashboard/metrics?${query.toString()}`, {
          signal: controller.signal,
        })

        if (!res.ok) throw new Error("Fallo al cargar datos")

        const json = (await res.json()) as ApiResponse
        if (json.ok) {
          setData(json.data)
          return
        }

        setData(null)
        setError(json.message ?? "Fallo al cargar datos")
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setData(null)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
    return () => controller.abort()
  }, [sucursalId, fechaDesde, fechaHasta])

  return { data, loading, error }
}
