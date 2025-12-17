import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const topDebtors = [
  { cliente: "Construcciones López", telefono: "5555-1234", saldo: 12500, ultimoAbono: "2024-01-05" },
  { cliente: "María Pérez", telefono: "5555-5678", saldo: 8750, ultimoAbono: "2024-01-08" },
  { cliente: "Ferretería Central", telefono: "5555-9012", saldo: 6200, ultimoAbono: "2024-01-02" },
  { cliente: "Juan Rodríguez", telefono: "5555-3456", saldo: 4800, ultimoAbono: "2023-12-28" },
  { cliente: "Materiales GT", telefono: "5555-7890", saldo: 3420, ultimoAbono: "2024-01-10" },
]

export function TopDebtorsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Clientes que Deben Más</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Último Abono</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topDebtors.map((debtor) => (
              <TableRow key={debtor.cliente}>
                <TableCell className="font-medium">{debtor.cliente}</TableCell>
                <TableCell className="text-muted-foreground">{debtor.telefono}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono">
                    Q {debtor.saldo.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(debtor.ultimoAbono).toLocaleDateString("es-GT")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
