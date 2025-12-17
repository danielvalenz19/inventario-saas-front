"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const rotationData = [
  {
    producto: "Cemento UGC 42.5kg",
    categoria: "Construcción",
    diasRotacion: 3,
    ultimoMov: "2024-01-10",
    estado: "alta",
  },
  {
    producto: 'Varilla 3/8" x 6m',
    categoria: "Construcción",
    diasRotacion: 5,
    ultimoMov: "2024-01-09",
    estado: "alta",
  },
  { producto: "Block 15x20x40", categoria: "Construcción", diasRotacion: 4, ultimoMov: "2024-01-10", estado: "alta" },
  {
    producto: "Cable THHN #12 (m)",
    categoria: "Electricidad",
    diasRotacion: 8,
    ultimoMov: "2024-01-08",
    estado: "media",
  },
  {
    producto: "Pintura Látex Blanca",
    categoria: "Pinturas",
    diasRotacion: 12,
    ultimoMov: "2024-01-05",
    estado: "media",
  },
  { producto: 'Tubo PVC 4" x 6m', categoria: "Plomería", diasRotacion: 18, ultimoMov: "2023-12-28", estado: "baja" },
  { producto: "Alambre #18", categoria: "Ferretería", diasRotacion: 25, ultimoMov: "2023-12-20", estado: "baja" },
  { producto: 'Tornillos 4"', categoria: "Ferretería", diasRotacion: 32, ultimoMov: "2023-12-15", estado: "critica" },
  {
    producto: "Pintura Especial Premium",
    categoria: "Pinturas",
    diasRotacion: 45,
    ultimoMov: "2023-11-28",
    estado: "critica",
  },
  { producto: "Lija #100", categoria: "Ferretería", diasRotacion: 38, ultimoMov: "2023-12-08", estado: "critica" },
]

const estadoConfig = {
  alta: { label: "Alta", variant: "default" as const },
  media: { label: "Media", variant: "secondary" as const },
  baja: { label: "Baja", variant: "outline" as const },
  critica: { label: "Crítica", variant: "destructive" as const },
}

export function RotationReport() {
  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>Mostrar productos sin movimiento en los últimos</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="30" className="w-20" />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rotation Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Rotación de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Días de Rotación</TableHead>
                <TableHead className="text-right">Último Movimiento</TableHead>
                <TableHead className="text-center">Rotación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rotationData.map((item) => (
                <TableRow key={item.producto}>
                  <TableCell className="font-medium">{item.producto}</TableCell>
                  <TableCell className="text-muted-foreground">{item.categoria}</TableCell>
                  <TableCell className="text-right font-mono">{item.diasRotacion} días</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(item.ultimoMov).toLocaleDateString("es-GT")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={estadoConfig[item.estado as keyof typeof estadoConfig].variant}>
                      {estadoConfig[item.estado as keyof typeof estadoConfig].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
