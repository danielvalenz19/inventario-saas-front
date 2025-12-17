"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Package,
  Users,
  Building2,
  TrendingDown,
  PackageX,
  MoreHorizontal,
  Check,
  Eye,
  ExternalLink,
} from "lucide-react"

interface AlertsTableProps {
  selectedFilter: string | null
}

const alerts = [
  {
    id: "ALT-001",
    tipo: "Stock Crítico",
    mensaje: "Cemento UGC 42.5kg tiene stock crítico (15 unidades, mínimo 50)",
    entidad: "CEM-001",
    entidadNombre: "Cemento UGC 42.5kg",
    fecha: "2024-01-10T08:30:00",
    estado: "nueva",
  },
  {
    id: "ALT-002",
    tipo: "Créditos Vencidos",
    mensaje: "Construcciones López tiene crédito vencido por Q 12,500.00 desde hace 5 días",
    entidad: "CLI-001",
    entidadNombre: "Construcciones López",
    fecha: "2024-01-10T07:15:00",
    estado: "revision",
  },
  {
    id: "ALT-003",
    tipo: "Stock Crítico",
    mensaje: 'Varilla 3/8" x 6m tiene stock crítico (28 unidades, mínimo 100)',
    entidad: "VAR-038",
    entidadNombre: 'Varilla 3/8" x 6m',
    fecha: "2024-01-10T06:45:00",
    estado: "nueva",
  },
  {
    id: "ALT-004",
    tipo: "Deudas Proveedores",
    mensaje: "Aceros de Guatemala tiene pago vencido por Q 8,500.00 desde hace 2 días",
    entidad: "PROV-002",
    entidadNombre: "Aceros de Guatemala",
    fecha: "2024-01-10T06:00:00",
    estado: "nueva",
  },
  {
    id: "ALT-005",
    tipo: "Créditos Vencidos",
    mensaje: "Juan Rodríguez tiene crédito vencido por Q 4,800.00 desde hace 13 días",
    entidad: "CLI-004",
    entidadNombre: "Juan Rodríguez",
    fecha: "2024-01-09T18:30:00",
    estado: "nueva",
  },
  {
    id: "ALT-006",
    tipo: "Margen Bajo",
    mensaje: "Cemento UGC 42.5kg tiene margen bajo (18.1%), considera ajustar precio",
    entidad: "CEM-001",
    entidadNombre: "Cemento UGC 42.5kg",
    fecha: "2024-01-09T12:00:00",
    estado: "revision",
  },
  {
    id: "ALT-007",
    tipo: "Stock Crítico",
    mensaje: "Arena de río (m³) tiene stock crítico (8 unidades, mínimo 20)",
    entidad: "ARE-001",
    entidadNombre: "Arena de río (m³)",
    fecha: "2024-01-09T10:15:00",
    estado: "nueva",
  },
  {
    id: "ALT-008",
    tipo: "Sin Rotación",
    mensaje: "Pintura Especial Premium no ha tenido movimiento en 45 días",
    entidad: "PIN-002",
    entidadNombre: "Pintura Especial Premium",
    fecha: "2024-01-08T14:00:00",
    estado: "nueva",
  },
  {
    id: "ALT-009",
    tipo: "Créditos Vencidos",
    mensaje: "Ana García tiene crédito vencido por Q 1,950.00 desde hace 2 días",
    entidad: "CLI-008",
    entidadNombre: "Ana García",
    fecha: "2024-01-08T09:30:00",
    estado: "resuelta",
  },
  {
    id: "ALT-010",
    tipo: "Deudas Proveedores",
    mensaje: "Cementos Progreso tiene pago próximo por Q 15,800.00 en 5 días",
    entidad: "PROV-001",
    entidadNombre: "Cementos Progreso",
    fecha: "2024-01-08T08:00:00",
    estado: "revision",
  },
]

const tipoConfig = {
  "Stock Crítico": { icon: Package, color: "text-destructive", bg: "bg-destructive/10" },
  "Créditos Vencidos": { icon: Users, color: "text-warning", bg: "bg-warning/10" },
  "Deudas Proveedores": { icon: Building2, color: "text-chart-3", bg: "bg-chart-3/10" },
  "Margen Bajo": { icon: TrendingDown, color: "text-chart-4", bg: "bg-chart-4/10" },
  "Sin Rotación": { icon: PackageX, color: "text-muted-foreground", bg: "bg-muted" },
}

const estadoConfig = {
  nueva: { label: "Nueva", variant: "default" as const },
  revision: { label: "En revisión", variant: "secondary" as const },
  resuelta: { label: "Resuelta", variant: "outline" as const },
}

export function AlertsTable({ selectedFilter }: AlertsTableProps) {
  const filteredAlerts = selectedFilter ? alerts.filter((alert) => alert.tipo === selectedFilter) : alerts

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Tipo</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.map((alert) => {
              const config = tipoConfig[alert.tipo as keyof typeof tipoConfig]
              const Icon = config.icon
              return (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg p-1.5 ${config.bg}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <span className="text-sm font-medium">{alert.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm truncate">{alert.mensaje}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{alert.entidadNombre}</p>
                      <p className="text-xs text-muted-foreground font-mono">{alert.entidad}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(alert.fecha).toLocaleString("es-GT", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={estadoConfig[alert.estado as keyof typeof estadoConfig].variant}>
                      {estadoConfig[alert.estado as keyof typeof estadoConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ir a entidad
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className="mr-2 h-4 w-4" />
                          Marcar como resuelta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
