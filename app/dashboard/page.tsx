"use client"

import { useMemo, useState } from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { AlertTriangle } from "lucide-react"
import type { GlobalFilters as GlobalFiltersType } from "@/types/reporting"
import { AdminLayout } from "@/components/layout/admin-layout"
import { GlobalFilters } from "@/components/filters/GlobalFilters"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { LowStockTable } from "@/components/dashboard/low-stock-table"
import { ProductRotationChart } from "@/components/dashboard/product-rotation-chart"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { SupplierPaymentsTable } from "@/components/dashboard/supplier-payments-table"
import { TopDebtorsTable } from "@/components/dashboard/top-debtors-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clientDebts, dailyMetrics, inventoryItems, productPerformance, supplierDebts } from "@/lib/mock/data"
import { computeKPIs, createDefaultFilters, filterByDateRange, filterBySucursal } from "@/lib/mock/helpers"

const currencyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("es-GT")

const formatDateLabel = (isoDate: string) => {
  const [, month, day] = isoDate.split("-")
  return `${month}/${day}`
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<GlobalFiltersType>(() => createDefaultFilters())
  const [loading, setLoading] = useState(false)

  const filteredDaily = useMemo(() => {
    const byBranch = filterBySucursal(dailyMetrics, filters.sucursalId)
    return filterByDateRange(byBranch, filters.fechaDesde, filters.fechaHasta)
  }, [filters])

  const filteredProducts = useMemo(() => filterBySucursal(productPerformance, filters.sucursalId), [filters])
  const filteredInventory = useMemo(() => filterBySucursal(inventoryItems, filters.sucursalId), [filters])
  const filteredClientDebts = useMemo(() => filterBySucursal(clientDebts, filters.sucursalId), [filters])
  const filteredSupplierDebts = useMemo(() => filterBySucursal(supplierDebts, filters.sucursalId), [filters])

  const kpis = useMemo(() => {
    return computeKPIs({
      dailyMetrics: filteredDaily,
      clientDebts: filteredClientDebts,
      supplierDebts: filteredSupplierDebts,
      inventory: filteredInventory,
    })
  }, [filteredClientDebts, filteredDaily, filteredInventory, filteredSupplierDebts])

  const ventasComprasSeries = filteredDaily.map((metric) => ({
    label: formatDateLabel(metric.date),
    Ventas: metric.ventas,
    Compras: metric.compras,
  }))

  const utilidadSeries = filteredDaily.map((metric) => ({
    label: formatDateLabel(metric.date),
    Utilidad: metric.utilidad,
  }))

  const topProducts = [...filteredProducts]
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 5)
    .map((product) => ({
      producto: product.nombre,
      Ventas: product.ventas,
      Unidades: product.unidadesVendidas,
    }))

  const criticalStock = filteredInventory.filter((item) => item.stock <= item.minimo)
  const topClientDebtors = [...filteredClientDebts].sort((a, b) => b.monto - a.monto).slice(0, 5)
  const topSupplierDebtors = [...filteredSupplierDebts].sort((a, b) => b.monto - a.monto).slice(0, 5)

  const kpiCards = [
    { key: "ventas", label: "Ventas", value: currencyFormatter.format(kpis.totalVentas), helper: "Total periodo" },
    { key: "compras", label: "Compras", value: currencyFormatter.format(kpis.totalCompras), helper: "Reposiciones" },
    { key: "utilidad", label: "Utilidad", value: currencyFormatter.format(kpis.utilidad), helper: "Operativa" },
    { key: "cxc", label: "CxC", value: currencyFormatter.format(kpis.cuentasPorCobrar), helper: "Clientes" },
    { key: "cxp", label: "CxP", value: currencyFormatter.format(kpis.cuentasPorPagar), helper: "Proveedores" },
    { key: "stock", label: "Stock crítico", value: `${kpis.stockCritico} SKU`, helper: "Bajo mínimo" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Resumen Ejecutivo</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Controla ventas, compras y saldos en segundos</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Rango activo: {filters.fechaDesde} → {filters.fechaHasta}
          </div>
        </div>

        <section className="space-y-4 rounded-3xl border border-dashed bg-card/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Vista clásica</h2>
              <p className="text-sm text-muted-foreground">
                Conservamos la versión anterior del dashboard para tener una referencia rápida y familiar.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-semibold uppercase">
              Static mock
            </Badge>
          </div>
          <div className="space-y-6">
            <KPICards />
            <div className="grid gap-6 lg:grid-cols-3">
              <SalesChart />
              <ProductRotationChart />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <LowStockTable />
              <TopDebtorsTable />
              <SupplierPaymentsTable />
            </div>
          </div>
        </section>

        <GlobalFilters onApply={setFilters} onLoadingChange={setLoading} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((kpi) => (
            <Card key={kpi.key} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-9 w-32" />
                ) : (
                  <div>
                    <p className="text-2xl font-semibold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Ventas vs Compras</CardTitle>
              <Badge variant="outline">Diario</Badge>
            </CardHeader>
            <CardContent className="h-[320px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : ventasComprasSeries.length === 0 ? (
                <Empty className="h-full border-0">
                  <EmptyTitle>No hay datos</EmptyTitle>
                  <EmptyDescription>Prueba ampliar el rango de fechas.</EmptyDescription>
                </Empty>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ventasComprasSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                        borderRadius: 12,
                        color: "var(--foreground)",
                      }}
                      formatter={(value: number, key) => [currencyFormatter.format(value), key]}
                    />
                    <Line type="monotone" dataKey="Ventas" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Compras" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Utilidad</CardTitle>
              <Badge variant="secondary">Periodo</Badge>
            </CardHeader>
            <CardContent className="h-[320px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : utilidadSeries.length === 0 ? (
                <Empty className="h-full border-0">
                  <EmptyTitle>Sin registros</EmptyTitle>
                  <EmptyDescription>Los filtros no devolvieron utilidades.</EmptyDescription>
                </Empty>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={utilidadSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="utilidad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                        borderRadius: 12,
                        color: "var(--foreground)",
                      }}
                      formatter={(value: number) => [currencyFormatter.format(value), "Utilidad"]}
                    />
                    <Area type="monotone" dataKey="Utilidad" stroke="var(--chart-3)" fill="url(#utilidad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Top productos</CardTitle>
              <Badge variant="secondary">Por ventas</Badge>
            </CardHeader>
            <CardContent className="h-[320px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : topProducts.length === 0 ? (
                <Empty className="h-full border-0">
                  <EmptyTitle>Sin productos</EmptyTitle>
                  <EmptyDescription>No hay movimientos en este periodo.</EmptyDescription>
                </Empty>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.3} />
                    <XAxis type="number" tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} hide />
                    <YAxis dataKey="producto" type="category" width={140} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                        borderRadius: 12,
                        color: "var(--foreground)",
                      }}
                      formatter={(value: number, key) => [key === "Ventas" ? currencyFormatter.format(value) : `${value} unidades`, key]}
                    />
                    <Bar dataKey="Ventas" fill="var(--chart-4)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Top deudores clientes</CardTitle>
              <Badge variant="outline">CxC</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[260px] w-full" />
              ) : topClientDebtors.length === 0 ? (
                <Empty className="border-0">
                  <EmptyTitle>Todo al día</EmptyTitle>
                  <EmptyDescription>Sin pendientes para este rango.</EmptyDescription>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topClientDebtors.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>
                          <div className="font-medium">{debt.nombre}</div>
                          <p className="text-xs text-muted-foreground">{debt.diasVencidos} días vencidos</p>
                        </TableCell>
                        <TableCell className="text-right font-medium">{currencyFormatter.format(debt.monto)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Stock crítico</CardTitle>
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {numberFormatter.format(criticalStock.length)}
              </Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[260px] w-full" />
              ) : criticalStock.length === 0 ? (
                <Empty className="border-0">
                  <EmptyTitle>Inventario saludable</EmptyTitle>
                  <EmptyDescription>No hay productos bajo el mínimo.</EmptyDescription>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.producto}</div>
                          <p className="text-xs text-muted-foreground">Mínimo {item.minimo} • {item.categoria}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{item.stock}/{item.minimo}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">Top deudores proveedores</CardTitle>
              <Badge variant="outline">CxP</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[260px] w-full" />
              ) : topSupplierDebtors.length === 0 ? (
                <Empty className="border-0">
                  <EmptyTitle>Pagos al día</EmptyTitle>
                  <EmptyDescription>No hay cuentas por pagar.</EmptyDescription>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSupplierDebtors.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>
                          <div className="font-medium">{debt.nombre}</div>
                          <p className="text-xs text-muted-foreground">{debt.diasVencidos} días</p>
                        </TableCell>
                        <TableCell className="text-right font-medium">{currencyFormatter.format(debt.monto)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  )
}
