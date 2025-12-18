import type { DailyMetric, DebtRecord, GlobalFilters, InventoryItem, KPISummary } from "@/types/reporting"

const formatDate = (date: Date) => date.toISOString().split("T")[0]

export const branchOptions = [
  { id: 1, label: "Matriz" },
  { id: 2, label: "Sucursal 2" },
  { id: 3, label: "Sucursal 3" },
]

export const createDefaultFilters = (): GlobalFilters => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  return {
    sucursalId: 1,
    fechaDesde: formatDate(startOfMonth),
    fechaHasta: formatDate(today),
  }
}

export const defaultFilters: GlobalFilters = createDefaultFilters()

export function filterBySucursal<T extends { sucursalId: number }>(data: T[], sucursalId: number): T[] {
  return data.filter((item) => item.sucursalId === sucursalId)
}

export function filterByDateRange<T extends { date: string }>(series: T[], desde: string, hasta: string): T[] {
  const start = new Date(desde)
  const end = new Date(hasta)
  return series.filter((item) => {
    const current = new Date(item.date)
    return current >= start && current <= end
  })
}

type ComputeKPIsInput = {
  dailyMetrics: DailyMetric[]
  clientDebts: DebtRecord[]
  supplierDebts: DebtRecord[]
  inventory: InventoryItem[]
}

export function computeKPIs({ dailyMetrics, clientDebts, supplierDebts, inventory }: ComputeKPIsInput): KPISummary {
  const totalVentas = dailyMetrics.reduce((acc, item) => acc + item.ventas, 0)
  const totalCompras = dailyMetrics.reduce((acc, item) => acc + item.compras, 0)
  const utilidad = dailyMetrics.reduce((acc, item) => acc + item.utilidad, 0)
  const cuentasPorCobrar = clientDebts.reduce((acc, item) => acc + item.monto, 0)
  const cuentasPorPagar = supplierDebts.reduce((acc, item) => acc + item.monto, 0)
  const stockCritico = inventory.filter((item) => item.stock <= item.minimo).length

  return {
    totalVentas,
    totalCompras,
    utilidad,
    cuentasPorCobrar,
    cuentasPorPagar,
    stockCritico,
  }
}

export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) {
    return ""
  }

  const headers = Object.keys(rows[0])
  const escape = (value: unknown) => {
    if (value === null || value === undefined) {
      return ""
    }
    const stringValue = String(value)
    if (stringValue.includes(",") || stringValue.includes("\"")) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const body = rows
    .map((row) => headers.map((header) => escape((row as Record<string, unknown>)[header])).join(","))
    .join("\n")

  return `${headers.join(",")}\n${body}`
}
