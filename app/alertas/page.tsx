"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AlertsFilters } from "@/components/alerts/alerts-filters"
import { AlertsTable } from "@/components/alerts/alerts-table"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Users, Building2, TrendingDown, PackageX } from "lucide-react"

const alertStats = [
  { type: "Stock Crítico", count: 5, icon: Package, color: "text-destructive" },
  { type: "Créditos Vencidos", count: 3, icon: Users, color: "text-warning" },
  { type: "Deudas Proveedores", count: 2, icon: Building2, color: "text-chart-3" },
  { type: "Margen Bajo", count: 1, icon: TrendingDown, color: "text-chart-4" },
  { type: "Sin Rotación", count: 1, icon: PackageX, color: "text-muted-foreground" },
]

export default function AlertasPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Alertas Inteligentes</h1>
          <p className="text-muted-foreground">Monitoreo y gestión de alertas del sistema</p>
        </div>

        {/* Alert Stats Summary */}
        <div className="grid gap-4 md:grid-cols-5">
          {alertStats.map((stat) => (
            <Card
              key={stat.type}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedFilter === stat.type ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedFilter(selectedFilter === stat.type ? null : stat.type)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <AlertsFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

        {/* Alerts Table */}
        <AlertsTable selectedFilter={selectedFilter} />
      </div>
    </AdminLayout>
  )
}
