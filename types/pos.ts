export type POSProduct = {
  id: string
  sku: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  ivaRate: number
  destacado?: boolean
  etiqueta?: string
}

export type POSCustomer = {
  id: string
  nombre: string
  nit: string
  tipo: "Mayorista" | "Detalle" | "Restaurante"
  saldo: number
  limiteCredito: number
  frecuencia: "Diario" | "Semanal" | "Mensual"
}

export type POSBundle = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  ahorro: number
  productos: string[]
}
