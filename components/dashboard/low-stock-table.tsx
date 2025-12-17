import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const lowStockProducts = [
  { codigo: "CEM-001", producto: "Cemento UGC 42.5kg", stockActual: 15, stockMinimo: 50, diasRestantes: 3 },
  { codigo: "VAR-038", producto: 'Varilla 3/8" x 6m', stockActual: 28, stockMinimo: 100, diasRestantes: 5 },
  { codigo: "BLO-152", producto: "Block 15x20x40", stockActual: 45, stockMinimo: 200, diasRestantes: 4 },
  { codigo: "ARE-001", producto: "Arena de río (m³)", stockActual: 8, stockMinimo: 20, diasRestantes: 2 },
  { codigo: "PIE-001", producto: "Piedrín 3/4 (m³)", stockActual: 5, stockMinimo: 15, diasRestantes: 2 },
]

export function LowStockTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Productos por Agotarse</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Mínimo</TableHead>
              <TableHead className="text-right">Días</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.map((product) => (
              <TableRow key={product.codigo}>
                <TableCell className="font-mono text-xs">{product.codigo}</TableCell>
                <TableCell className="font-medium">{product.producto}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={product.stockActual < product.stockMinimo * 0.3 ? "destructive" : "secondary"}>
                    {product.stockActual}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{product.stockMinimo}</TableCell>
                <TableCell className="text-right">
                  <span className={product.diasRestantes <= 2 ? "text-destructive font-medium" : ""}>
                    {product.diasRestantes} días
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
