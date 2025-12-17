"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function InventoryFilters() {
  const [quickFilter, setQuickFilter] = useState("todos")

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o código..." className="pl-10" />
      </div>

      {/* Category */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          <SelectItem value="construccion">Construcción</SelectItem>
          <SelectItem value="ferreteria">Ferretería</SelectItem>
          <SelectItem value="electricidad">Electricidad</SelectItem>
          <SelectItem value="plomeria">Plomería</SelectItem>
          <SelectItem value="pinturas">Pinturas</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="activo">Activo</SelectItem>
          <SelectItem value="inactivo">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      {/* Quick Filters */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        <Button
          variant={quickFilter === "todos" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setQuickFilter("todos")}
        >
          Todos
        </Button>
        <Button
          variant={quickFilter === "agotarse" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setQuickFilter("agotarse")}
          className="text-destructive"
        >
          Por Agotarse
        </Button>
        <Button
          variant={quickFilter === "sinRotacion" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setQuickFilter("sinRotacion")}
        >
          Sin Rotación
        </Button>
      </div>
    </div>
  )
}
