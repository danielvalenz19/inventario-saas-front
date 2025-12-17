"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlertsFiltersProps {
  selectedFilter: string | null
  onFilterChange: (filter: string | null) => void
}

export function AlertsFilters({ selectedFilter, onFilterChange }: AlertsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Quick Filters */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        <Button
          variant={selectedFilter === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(null)}
        >
          Todas
        </Button>
        <Button
          variant={selectedFilter === "Stock Crítico" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("Stock Crítico")}
        >
          Stock Crítico
        </Button>
        <Button
          variant={selectedFilter === "Créditos Vencidos" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("Créditos Vencidos")}
        >
          Créditos Vencidos
        </Button>
        <Button
          variant={selectedFilter === "Deudas Proveedores" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("Deudas Proveedores")}
        >
          Deudas Proveedores
        </Button>
        <Button
          variant={selectedFilter === "Margen Bajo" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("Margen Bajo")}
        >
          Margen Bajo
        </Button>
        <Button
          variant={selectedFilter === "Sin Rotación" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("Sin Rotación")}
        >
          Sin Rotación
        </Button>
      </div>

      {/* Status Filter */}
      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="nueva">Nueva</SelectItem>
          <SelectItem value="revision">En revisión</SelectItem>
          <SelectItem value="resuelta">Resuelta</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
