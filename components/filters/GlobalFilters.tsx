"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import type { GlobalFilters as GlobalFiltersType } from "@/types/reporting"
import { branchOptions, createDefaultFilters } from "@/lib/mock/helpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "global-filters"

const presetConfig = [
  {
    id: "today",
    label: "Hoy",
    getRange: () => {
      const today = new Date()
      const formatted = today.toISOString().split("T")[0]
      return { fechaDesde: formatted, fechaHasta: formatted }
    },
  },
  {
    id: "7d",
    label: "Últimos 7 días",
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 6)
      return { fechaDesde: start.toISOString().split("T")[0], fechaHasta: end.toISOString().split("T")[0] }
    },
  },
  {
    id: "30d",
    label: "Últimos 30 días",
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      return { fechaDesde: start.toISOString().split("T")[0], fechaHasta: end.toISOString().split("T")[0] }
    },
  },
  {
    id: "current-month",
    label: "Mes actual",
    getRange: () => {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return { fechaDesde: start.toISOString().split("T")[0], fechaHasta: end.toISOString().split("T")[0] }
    },
  },
  {
    id: "previous-month",
    label: "Mes anterior",
    getRange: () => {
      const today = new Date()
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      return { fechaDesde: start.toISOString().split("T")[0], fechaHasta: end.toISOString().split("T")[0] }
    },
  },
]

type GlobalFiltersProps = {
  defaultValue?: GlobalFiltersType
  onApply?: (filters: GlobalFiltersType) => void
  onReset?: (filters: GlobalFiltersType) => void
  onLoadingChange?: (loading: boolean) => void
  className?: string
}

export function GlobalFilters({ className, defaultValue, onApply, onReset, onLoadingChange }: GlobalFiltersProps) {
  const [filters, setFilters] = useState<GlobalFiltersType>(defaultValue ?? createDefaultFilters())
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<number>()

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GlobalFiltersType
        setFilters(parsed)
        onApply?.(parsed)
        return
      } catch (error) {
        console.error("No se pudo leer global filters", error)
      }
    }

    const fallback = defaultValue ?? createDefaultFilters()
    setFilters(fallback)
    onApply?.(fallback)
  }, [defaultValue, onApply])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleDateChange = (key: keyof GlobalFiltersType, value: string) => {
    setSelectedPreset(null)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    setLoading(true)
    onLoadingChange?.(true)
    const delay = 400 + Math.floor(Math.random() * 300)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      onLoadingChange?.(false)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
      onApply?.(filters)
    }, delay)
  }

  const handleReset = () => {
    const resetFilters = defaultValue ?? createDefaultFilters()
    setFilters(resetFilters)
    setSelectedPreset(null)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resetFilters))
    onReset?.(resetFilters)
    onApply?.(resetFilters)
  }

  const appliedPreset = useMemo(() => {
    return presetConfig.find((preset) => preset.id === selectedPreset)
  }, [selectedPreset])

  const presetButtons = presetConfig.map((preset) => (
    <Button
      key={preset.id}
      type="button"
      size="sm"
      variant={selectedPreset === preset.id ? "default" : "outline"}
      onClick={() => {
        const range = preset.getRange()
        setSelectedPreset(preset.id)
        setFilters((prev) => ({ ...prev, ...range }))
      }}
    >
      {preset.label}
    </Button>
  ))

  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Sucursal</Label>
            <Select
              value={String(filters.sucursalId)}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, sucursalId: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fecha desde</Label>
            <Input
              type="date"
              value={filters.fechaDesde}
              max={filters.fechaHasta}
              onChange={(event) => handleDateChange("fechaDesde", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha hasta</Label>
            <Input
              type="date"
              value={filters.fechaHasta}
              min={filters.fechaDesde}
              onChange={(event) => handleDateChange("fechaHasta", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Preset activo</Label>
            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              {appliedPreset ? appliedPreset.label : "Manual"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Presets rápidos</Label>
          <div className="flex flex-wrap gap-2">{presetButtons}</div>
        </div>

        <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="ghost" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button type="button" onClick={handleApply} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Aplicar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
