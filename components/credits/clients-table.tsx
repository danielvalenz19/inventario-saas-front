"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ClientsTableProps {
  onSelectClient: (id: string) => void
  selectedClient: string | null
}

const clients = [
  {
    id: "CLI-001",
    nombre: "Construcciones López",
    telefono: "5555-1234",
    limite: 25000,
    saldo: 12500,
    vencimiento: "2024-01-05",
    estado: "vencido",
  },
  {
    id: "CLI-002",
    nombre: "María Pérez",
    telefono: "5555-5678",
    limite: 10000,
    saldo: 8750,
    vencimiento: "2024-01-18",
    estado: "aldia",
  },
  {
    id: "CLI-003",
    nombre: "Ferretería Central",
    telefono: "5555-9012",
    limite: 15000,
    saldo: 6200,
    vencimiento: "2024-01-12",
    estado: "proximo",
  },
  {
    id: "CLI-004",
    nombre: "Juan Rodríguez",
    telefono: "5555-3456",
    limite: 8000,
    saldo: 4800,
    vencimiento: "2023-12-28",
    estado: "vencido",
  },
  {
    id: "CLI-005",
    nombre: "Materiales GT",
    telefono: "5555-7890",
    limite: 20000,
    saldo: 3420,
    vencimiento: "2024-01-25",
    estado: "aldia",
  },
  {
    id: "CLI-006",
    nombre: "Pedro Hernández",
    telefono: "5555-2345",
    limite: 5000,
    saldo: 2150,
    vencimiento: "2024-01-20",
    estado: "negociacion",
  },
  {
    id: "CLI-007",
    nombre: "Constructora El Águila",
    telefono: "5555-6789",
    limite: 30000,
    saldo: 5800,
    vencimiento: "2024-01-22",
    estado: "aldia",
  },
  {
    id: "CLI-008",
    nombre: "Ana García",
    telefono: "5555-0123",
    limite: 3000,
    saldo: 1950,
    vencimiento: "2024-01-08",
    estado: "vencido",
  },
]

const estadoConfig = {
  aldia: { label: "Al día", variant: "outline" as const },
  vencido: { label: "Vencido", variant: "destructive" as const },
  proximo: { label: "Por vencer", variant: "secondary" as const },
  negociacion: { label: "En negociación", variant: "default" as const },
}

export function ClientsTable({ onSelectClient, selectedClient }: ClientsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Límite de Crédito</TableHead>
              <TableHead className="text-right">Saldo Actual</TableHead>
              <TableHead className="text-right">Próximo Vencimiento</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className={cn("cursor-pointer", selectedClient === client.id && "bg-muted")}
                onClick={() => onSelectClient(client.id)}
              >
                <TableCell className="font-medium">{client.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{client.telefono}</TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  Q {client.limite.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">Q {client.saldo.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(client.vencimiento).toLocaleDateString("es-GT")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={estadoConfig[client.estado as keyof typeof estadoConfig].variant}>
                    {estadoConfig[client.estado as keyof typeof estadoConfig].label}
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
