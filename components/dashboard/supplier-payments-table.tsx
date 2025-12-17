import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const supplierPayments = [
  { proveedor: "Cementos Progreso", monto: 15800, vencimiento: "2024-01-15", estado: "proximo" },
  { proveedor: "Aceros de Guatemala", monto: 8500, vencimiento: "2024-01-12", estado: "urgente" },
  { proveedor: "Distribuidora El Sol", monto: 4200, vencimiento: "2024-01-18", estado: "proximo" },
  { proveedor: "Ferretería Mayorista", monto: 2150, vencimiento: "2024-01-20", estado: "aldia" },
  { proveedor: "Pinturas Corona", monto: 1500, vencimiento: "2024-01-25", estado: "aldia" },
]

const estadoConfig = {
  urgente: { label: "Urgente", variant: "destructive" as const },
  proximo: { label: "Próximo", variant: "secondary" as const },
  aldia: { label: "Al día", variant: "outline" as const },
}

export function SupplierPaymentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Próximos Pagos a Proveedores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Vencimiento</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplierPayments.map((payment) => (
              <TableRow key={payment.proveedor}>
                <TableCell className="font-medium">{payment.proveedor}</TableCell>
                <TableCell className="text-right font-mono">Q {payment.monto.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(payment.vencimiento).toLocaleDateString("es-GT")}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={estadoConfig[payment.estado as keyof typeof estadoConfig].variant}>
                    {estadoConfig[payment.estado as keyof typeof estadoConfig].label}
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
