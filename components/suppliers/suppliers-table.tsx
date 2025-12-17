"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SuppliersTableProps {
  onSelectSupplier: (id: string) => void
  selectedSupplier: string | null
}

const suppliers = [
  {
    id: "PROV-001",
    nombre: "Cementos Progreso",
    telefono: "2222-1234",
    saldo: 15800,
    vencimiento: "2024-01-15",
    estado: "proximo",
  },
  {
    id: "PROV-002",
    nombre: "Aceros de Guatemala",
    telefono: "2222-5678",
    saldo: 8500,
    vencimiento: "2024-01-08",
    estado: "vencido",
  },
  {
    id: "PROV-003",
    nombre: "Distribuidora El Sol",
    telefono: "2222-9012",
    saldo: 4200,
    vencimiento: "2024-01-18",
    estado: "aldia",
  },
  {
    id: "PROV-004",
    nombre: "Ferretería Mayorista",
    telefono: "2222-3456",
    saldo: 2150,
    vencimiento: "2024-01-20",
    estado: "aldia",
  },
  {
    id: "PROV-005",
    nombre: "Pinturas Corona",
    telefono: "2222-7890",
    saldo: 1500,
    vencimiento: "2024-01-25",
    estado: "aldia",
  },
]

const estadoConfig = {
  aldia: { label: "Al día", variant: "outline" as const },
  vencido: { label: "Vencido", variant: "destructive" as const },
  proximo: { label: "Próximo", variant: "secondary" as const },
}

export function SuppliersTable({ onSelectSupplier, selectedSupplier }: SuppliersTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Saldo Pendiente</TableHead>
              <TableHead className="text-right">Próximo Vencimiento</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className={cn("cursor-pointer", selectedSupplier === supplier.id && "bg-muted")}
                onClick={() => onSelectSupplier(supplier.id)}
              >
                <TableCell className="font-medium">{supplier.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.telefono}</TableCell>
                <TableCell className="text-right font-mono font-medium">Q {supplier.saldo.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(supplier.vencimiento).toLocaleDateString("es-GT")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={estadoConfig[supplier.estado as keyof typeof estadoConfig].variant}>
                    {estadoConfig[supplier.estado as keyof typeof estadoConfig].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
