"use client"

import { useMemo, useState } from "react"
import { Download, FileSpreadsheet, FileText, Search } from "lucide-react"
import type { GlobalFilters as GlobalFiltersType } from "@/types/reporting"
import { AdminLayout } from "@/components/layout/admin-layout"
import { GlobalFilters } from "@/components/filters/GlobalFilters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { creditRecords, dailyMetrics, inventoryItems, purchaseTransactions, salesTransactions } from "@/lib/mock/data"
import { createDefaultFilters, filterByDateRange, filterBySucursal, toCsv } from "@/lib/mock/helpers"
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts"

const currencyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
})

const integerFormatter = new Intl.NumberFormat("es-GT")

const formatKpiValue = (value: string | number) => (typeof value === "number" ? integerFormatter.format(value) : value)

type ReportTab = "ventas" | "compras" | "inventario" | "creditos"
type SortDirection = "asc" | "desc"

const formatDateLabel = (isoDate: string) => {
  const [, month, day] = isoDate.split("-")
  return `${month}/${day}`
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pagado: "secondary",
  Pendiente: "default",
  Vencido: "destructive",
  "Al día": "secondary",
  Parcial: "default",
}

export default function ReportesPage() {
  const [filters, setFilters] = useState<GlobalFiltersType>(() => createDefaultFilters())
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportTab>("ventas")
  const [search, setSearch] = useState<Record<ReportTab, string>>({ ventas: "", compras: "", inventario: "", creditos: "" })
  const [sort, setSort] = useState<Record<ReportTab, SortDirection>>({ ventas: "desc", compras: "desc", inventario: "asc", creditos: "desc" })
  const { toast } = useToast()

  const filteredDaily = useMemo(() => {
    const byBranch = filterBySucursal(dailyMetrics, filters.sucursalId)
    return filterByDateRange(byBranch, filters.fechaDesde, filters.fechaHasta)
  }, [filters])

  const filteredSales = useMemo(() => {
    const byBranch = filterBySucursal(salesTransactions, filters.sucursalId)
    return filterByDateRange(byBranch, filters.fechaDesde, filters.fechaHasta)
  }, [filters])

  const filteredPurchases = useMemo(() => {
    const byBranch = filterBySucursal(purchaseTransactions, filters.sucursalId)
    return filterByDateRange(byBranch, filters.fechaDesde, filters.fechaHasta)
  }, [filters])

  const filteredInventory = useMemo(() => filterBySucursal(inventoryItems, filters.sucursalId), [filters])
  const filteredCredits = useMemo(() => {
    const byBranch = filterBySucursal(creditRecords, filters.sucursalId)
    return filterByDateRange(byBranch, filters.fechaDesde, filters.fechaHasta)
  }, [filters])

  const ventasRows = useMemo(() => {
    const term = search.ventas.toLowerCase()
    return [...filteredSales]
      .filter((row) =>
        [row.entidad.toLowerCase(), row.referencia.toLowerCase(), row.canal.toLowerCase()].some((value) =>
          value.includes(term),
        ),
      )
      .sort((a, b) => (sort.ventas === "desc" ? b.monto - a.monto : a.monto - b.monto))
  }, [filteredSales, search.ventas, sort.ventas])

  const comprasRows = useMemo(() => {
    const term = search.compras.toLowerCase()
    return [...filteredPurchases]
      .filter((row) =>
        [row.entidad.toLowerCase(), row.referencia.toLowerCase(), row.canal.toLowerCase()].some((value) =>
          value.includes(term),
        ),
      )
      .sort((a, b) => (sort.compras === "desc" ? b.monto - a.monto : a.monto - b.monto))
  }, [filteredPurchases, search.compras, sort.compras])

  const inventarioRows = useMemo(() => {
    const term = search.inventario.toLowerCase()
    return [...filteredInventory]
      .filter((item) =>
        [item.producto.toLowerCase(), item.sku.toLowerCase(), item.categoria.toLowerCase()].some((value) =>
          value.includes(term),
        ),
      )
      .sort((a, b) => (sort.inventario === "asc" ? a.stock - b.stock : b.stock - a.stock))
  }, [filteredInventory, search.inventario, sort.inventario])

  const creditosRows = useMemo(() => {
    const term = search.creditos.toLowerCase()
    return [...filteredCredits]
      .filter((row) => row.entidad.toLowerCase().includes(term))
      .sort((a, b) => (sort.creditos === "desc" ? b.monto - a.monto : a.monto - b.monto))
  }, [filteredCredits, search.creditos, sort.creditos])

  const ventasSummary = {
    total: filteredSales.reduce((acc, item) => acc + item.monto, 0),
    pendientes: filteredSales.filter((row) => row.estado !== "Pagado").reduce((acc, item) => acc + item.monto, 0),
    ordenes: filteredSales.length,
  }

  const comprasSummary = {
    total: filteredPurchases.reduce((acc, item) => acc + item.monto, 0),
    vencidas: filteredPurchases.filter((row) => row.estado === "Vencido").reduce((acc, item) => acc + item.monto, 0),
    ordenes: filteredPurchases.length,
  }

  const inventarioSummary = {
    totalSku: filteredInventory.length,
    criticos: filteredInventory.filter((item) => item.stock <= item.minimo).length,
    rotacionAlta: filteredInventory.filter((item) => item.rotacion === "alta").length,
  }

  const creditosSummary = {
    total: filteredCredits.reduce((acc, item) => acc + item.monto, 0),
    clientes: filteredCredits.filter((row) => row.tipo === "cliente").length,
    proveedores: filteredCredits.filter((row) => row.tipo === "proveedor").length,
  }

  const ventasTrend = filteredDaily.map((metric) => ({ label: formatDateLabel(metric.date), Ventas: metric.ventas }))
  const comprasTrend = filteredDaily.map((metric) => ({ label: formatDateLabel(metric.date), Compras: metric.compras }))

  const ventasPorCanal = Object.values(
    filteredSales.reduce<Record<string, { canal: string; total: number }>>((acc, row) => {
      const key = row.canal
      if (!acc[key]) {
        acc[key] = { canal: key, total: 0 }
      }
      acc[key].total += row.monto
      return acc
    }, {}),
  )

  const comprasPorEstado = Object.values(
    filteredPurchases.reduce<Record<string, { estado: string; total: number }>>((acc, row) => {
      const key = row.estado
      if (!acc[key]) {
        acc[key] = { estado: key, total: 0 }
      }
      acc[key].total += row.monto
      return acc
    }, {}),
  )

  const inventarioChartData = [...filteredInventory].slice(0, 6).map((item) => ({
    sku: item.sku,
    Stock: item.stock,
    Minimo: item.minimo,
  }))

  const rotacionChartData = [
    { tipo: "Alta", cantidad: filteredInventory.filter((item) => item.rotacion === "alta").length },
    { tipo: "Media", cantidad: filteredInventory.filter((item) => item.rotacion === "media").length },
    { tipo: "Baja", cantidad: filteredInventory.filter((item) => item.rotacion === "baja").length },
  ]

  const creditosPorEntidad = [...filteredCredits]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5)
    .map((row) => ({ entidad: row.entidad, Monto: row.monto }))

  const creditosAging = [
    { bucket: "Al día", total: filteredCredits.filter((row) => row.diasVencidos === 0).reduce((acc, item) => acc + item.monto, 0) },
    {
      bucket: "1-15 días",
      total: filteredCredits.filter((row) => row.diasVencidos > 0 && row.diasVencidos <= 15).reduce((acc, item) => acc + item.monto, 0),
    },
    {
      bucket: "16-30 días",
      total: filteredCredits.filter((row) => row.diasVencidos > 15 && row.diasVencidos <= 30).reduce((acc, item) => acc + item.monto, 0),
    },
    { bucket: ">30 días", total: filteredCredits.filter((row) => row.diasVencidos > 30).reduce((acc, item) => acc + item.monto, 0) },
  ]

  const getRowsForExport = (): Record<string, string | number>[] => {
    switch (activeTab) {
      case "ventas":
        return ventasRows.map((row) => ({
          fecha: row.date,
          referencia: row.referencia,
          cliente: row.entidad,
          canal: row.canal,
          estado: row.estado,
          monto: row.monto,
        }))
      case "compras":
        return comprasRows.map((row) => ({
          fecha: row.date,
          referencia: row.referencia,
          proveedor: row.entidad,
          canal: row.canal,
          estado: row.estado,
          monto: row.monto,
        }))
      case "inventario":
        return inventarioRows.map((row) => ({
          sku: row.sku,
          producto: row.producto,
          categoria: row.categoria,
          stock: row.stock,
          minimo: row.minimo,
          rotacion: row.rotacion,
        }))
      case "creditos":
        return creditosRows.map((row) => ({
          fecha: row.date,
          entidad: row.entidad,
          tipo: row.tipo,
          estado: row.estado,
          monto: row.monto,
          dias_vencidos: row.diasVencidos,
        }))
      default:
        return []
    }
  }

  const handleExportCsv = () => {
    const rows = getRowsForExport()
    if (!rows.length) {
      toast({ title: "Sin datos", description: "No hay registros para exportar con estos filtros." })
      return
    }

    const csv = toCsv(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte_${activeTab}_${filters.fechaDesde}_${filters.fechaHasta}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePlaceholder = (format: string) => {
    toast({ title: "Próximamente", description: `${format} estará disponible en la próxima versión.` })
  }

  const renderTableControls = (tab: ReportTab, placeholder: string) => (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search[tab]}
          onChange={(event) => setSearch((prev) => ({ ...prev, [tab]: event.target.value }))}
          className="pl-9"
        />
      </div>
      <Select value={sort[tab]} onValueChange={(value) => setSort((prev) => ({ ...prev, [tab]: value as SortDirection }))}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Mayor a menor</SelectItem>
          <SelectItem value="asc">Menor a mayor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  const renderStatusBadge = (value: string) => (
    <Badge variant={statusVariant[value] ?? "outline"}>{value}</Badge>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Inteligencia de negocio</p>
            <h1 className="text-3xl font-bold">Reportes</h1>
            <p className="text-muted-foreground">Analiza ventas, compras, inventario y créditos en un solo lugar.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem onClick={handleExportCsv} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" /> CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePlaceholder("PDF")} className="gap-2">
                <FileText className="h-4 w-4" /> PDF (próximamente)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePlaceholder("Excel")} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Excel (próximamente)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <GlobalFilters onApply={setFilters} onLoadingChange={setLoading} />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportTab)} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="creditos">Créditos</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas" className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Ventas", value: currencyFormatter.format(ventasSummary.total), helper: `${ventasSummary.ordenes} operaciones` },
                { label: "Pendiente", value: currencyFormatter.format(ventasSummary.pendientes), helper: "CxC periodo" },
                {
                  label: "Ticket promedio",
                  value: ventasSummary.ordenes ? currencyFormatter.format(ventasSummary.total / ventasSummary.ordenes) : currencyFormatter.format(0),
                  helper: "Por factura",
                },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div>
                        <p className="text-2xl font-semibold">{formatKpiValue(kpi.value)}</p>
                        <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de ventas</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : ventasTrend.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>Ajusta los filtros para ver movimientos.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ventasTrend}>
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
                          formatter={(value: number) => [currencyFormatter.format(value), "Ventas"]}
                        />
                        <Line type="monotone" dataKey="Ventas" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventas por canal</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : ventasPorCanal.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>No se registraron ventas en el periodo.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ventasPorCanal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis dataKey="canal" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                          formatter={(value: number) => [currencyFormatter.format(value), "Ventas"]}
                        />
                        <Bar dataKey="total" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader className="space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div>
                  <CardTitle>Detalle de ventas</CardTitle>
                  <p className="text-sm text-muted-foreground">Búsqueda y ordenamiento local</p>
                </div>
                {renderTableControls("ventas", "Buscar cliente o folio")}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : ventasRows.length === 0 ? (
                  <Empty className="border-0">
                    <EmptyTitle>Sin movimientos</EmptyTitle>
                    <EmptyDescription>No hay ventas que coincidan con los filtros.</EmptyDescription>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Referencia</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Canal</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ventasRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="font-medium">{row.referencia}</TableCell>
                          <TableCell>{row.entidad}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.canal}</Badge>
                          </TableCell>
                          <TableCell>{renderStatusBadge(row.estado)}</TableCell>
                          <TableCell className="text-right font-medium">{currencyFormatter.format(row.monto)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compras" className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Compras", value: currencyFormatter.format(comprasSummary.total), helper: `${comprasSummary.ordenes} órdenes` },
                { label: "Vencido", value: currencyFormatter.format(comprasSummary.vencidas), helper: "CxP" },
                {
                  label: "Ticket promedio",
                  value: comprasSummary.ordenes ? currencyFormatter.format(comprasSummary.total / comprasSummary.ordenes) : currencyFormatter.format(0),
                  helper: "Por orden",
                },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div>
                        <p className="text-2xl font-semibold">{formatKpiValue(kpi.value)}</p>
                        <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de compras</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : comprasTrend.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>Ajusta los filtros para visualizar compras.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={comprasTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                          formatter={(value: number) => [currencyFormatter.format(value), "Compras"]}
                        />
                        <defs>
                          <linearGradient id="compras" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="Compras" stroke="var(--chart-4)" fill="url(#compras)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compras por estado</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : comprasPorEstado.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>No hay órdenes registradas.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comprasPorEstado}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis dataKey="estado" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                          formatter={(value: number) => [currencyFormatter.format(value), "Compras"]}
                        />
                        <Bar dataKey="total" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader className="space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div>
                  <CardTitle>Órdenes de compra</CardTitle>
                  <p className="text-sm text-muted-foreground">Filtra proveedores y estados rápidamente</p>
                </div>
                {renderTableControls("compras", "Buscar proveedor o folio")}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : comprasRows.length === 0 ? (
                  <Empty className="border-0">
                    <EmptyTitle>Sin registros</EmptyTitle>
                    <EmptyDescription>No hay compras con los filtros aplicados.</EmptyDescription>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Referencia</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Canal</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comprasRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="font-medium">{row.referencia}</TableCell>
                          <TableCell>{row.entidad}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.canal}</Badge>
                          </TableCell>
                          <TableCell>{renderStatusBadge(row.estado)}</TableCell>
                          <TableCell className="text-right font-medium">{currencyFormatter.format(row.monto)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: "SKU activos", value: inventarioSummary.totalSku, helper: "En sucursal" },
                { label: "Críticos", value: inventarioSummary.criticos, helper: "Bajo mínimo" },
                { label: "Alta rotación", value: inventarioSummary.rotacionAlta, helper: "> 3 giros mes" },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div>
                        <p className="text-2xl font-semibold">{formatKpiValue(kpi.value)}</p>
                        <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stock vs mínimo</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : inventarioChartData.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin inventario</EmptyTitle>
                      <EmptyDescription>No hay productos en esta sucursal.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventarioChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis dataKey="sku" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                        />
                        <Bar dataKey="Stock" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Minimo" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rotación</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : filteredInventory.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>No hay productos registrados.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rotacionChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis dataKey="tipo" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                        />
                        <Bar dataKey="cantidad" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader className="space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div>
                  <CardTitle>Detalle de inventario</CardTitle>
                  <p className="text-sm text-muted-foreground">Búsqueda por SKU, categoría o producto</p>
                </div>
                {renderTableControls("inventario", "Buscar SKU o producto")}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : inventarioRows.length === 0 ? (
                  <Empty className="border-0">
                    <EmptyTitle>Sin registros</EmptyTitle>
                    <EmptyDescription>No hay productos disponibles en esta vista.</EmptyDescription>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Mínimo</TableHead>
                        <TableHead>Rotación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventarioRows.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                          <TableCell>{item.producto}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell className="text-right font-medium">{item.stock}</TableCell>
                          <TableCell className="text-right">{item.minimo}</TableCell>
                          <TableCell>
                            <Badge variant={item.stock <= item.minimo ? "destructive" : "outline"}>{item.rotacion}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creditos" className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Saldo total", value: currencyFormatter.format(creditosSummary.total), helper: "CxC + CxP" },
                { label: "Clientes", value: creditosSummary.clientes, helper: "Con crédito" },
                { label: "Proveedores", value: creditosSummary.proveedores, helper: "Activos" },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div>
                        <p className="text-2xl font-semibold">{formatKpiValue(kpi.value)}</p>
                        <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top créditos</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : creditosPorEntidad.length === 0 ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin datos</EmptyTitle>
                      <EmptyDescription>Sin créditos en este periodo.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creditosPorEntidad} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis type="number" tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} />
                        <YAxis type="category" dataKey="entidad" width={150} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                          formatter={(value: number) => [currencyFormatter.format(value), "Saldo"]}
                        />
                        <Bar dataKey="Monto" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Antigüedad de saldos</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : creditosAging.every((bucket) => bucket.total === 0) ? (
                    <Empty className="h-full border-0">
                      <EmptyTitle>Sin deudas</EmptyTitle>
                      <EmptyDescription>Todos los créditos están al día.</EmptyDescription>
                    </Empty>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creditosAging}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                        <XAxis dataKey="bucket" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis tickFormatter={(value) => `Q${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                            borderRadius: 12,
                            color: "var(--foreground)",
                          }}
                          formatter={(value: number) => [currencyFormatter.format(value), "Saldo"]}
                        />
                        <Bar dataKey="total" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader className="space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div>
                  <CardTitle>Detalle de créditos</CardTitle>
                  <p className="text-sm text-muted-foreground">Controla clientes y proveedores con líneas activas</p>
                </div>
                {renderTableControls("creditos", "Buscar cliente o proveedor")}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : creditosRows.length === 0 ? (
                  <Empty className="border-0">
                    <EmptyTitle>Sin movimientos</EmptyTitle>
                    <EmptyDescription>No hay créditos que coincidan con la búsqueda.</EmptyDescription>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Entidad</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Días vencidos</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditosRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="font-medium">{row.entidad}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.tipo}</Badge>
                          </TableCell>
                          <TableCell>{renderStatusBadge(row.estado)}</TableCell>
                          <TableCell>{row.diasVencidos}</TableCell>
                          <TableCell className="text-right font-medium">{currencyFormatter.format(row.monto)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
