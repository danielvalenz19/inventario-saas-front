export type GlobalFilters = {
  sucursalId: number
  fechaDesde: string
  fechaHasta: string
}

export type DailyMetric = {
  date: string
  sucursalId: number
  ventas: number
  compras: number
  utilidad: number
}

export type ProductPerformance = {
  id: string
  nombre: string
  categoria: string
  sucursalId: number
  ventas: number
  unidadesVendidas: number
  stockActual: number
  stockMinimo: number
}

export type InventoryItem = {
  id: string
  sku: string
  producto: string
  categoria: string
  sucursalId: number
  stock: number
  minimo: number
  rotacion: "alta" | "media" | "baja"
}

export type DebtRecord = {
  id: string
  nombre: string
  monto: number
  diasVencidos: number
  sucursalId: number
}

export type ReportTransaction = {
  id: string
  date: string
  sucursalId: number
  referencia: string
  entidad: string
  canal: string
  estado: "Pagado" | "Pendiente" | "Vencido"
  monto: number
}

export type CreditRecord = {
  id: string
  date: string
  sucursalId: number
  entidad: string
  tipo: "cliente" | "proveedor"
  monto: number
  estado: "Al día" | "Vencido" | "Parcial"
  diasVencidos: number
}

export type KPISummary = {
  totalVentas: number
  totalCompras: number
  utilidad: number
  cuentasPorCobrar: number
  cuentasPorPagar: number
  stockCritico: number
}
