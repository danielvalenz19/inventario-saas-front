"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit, Package, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react"

interface ProductDetailPanelProps {
  productId: string
  onClose: () => void
}

const stockBySucursal = [
  { sucursal: "Sucursal Central", stock: 10 },
  { sucursal: "Sucursal Norte", stock: 3 },
  { sucursal: "Sucursal Sur", stock: 2 },
]

const movimientos = [
  {
    fecha: "2024-01-10",
    tipo: "Entrada",
    cantidad: 50,
    usuario: "Juan García",
    comentario: "Compra a Cementos Progreso",
  },
  { fecha: "2024-01-09", tipo: "Salida", cantidad: -12, usuario: "María López", comentario: "Venta #1234" },
  { fecha: "2024-01-08", tipo: "Salida", cantidad: -8, usuario: "Carlos Pérez", comentario: "Venta #1233" },
  {
    fecha: "2024-01-07",
    tipo: "Ajuste",
    cantidad: -2,
    usuario: "Juan García",
    comentario: "Ajuste por inventario físico",
  },
  { fecha: "2024-01-05", tipo: "Salida", cantidad: -15, usuario: "María López", comentario: "Venta #1230" },
]

const tipoConfig = {
  Entrada: { icon: ArrowUpRight, color: "text-accent" },
  Salida: { icon: ArrowDownRight, color: "text-destructive" },
  Ajuste: { icon: RefreshCcw, color: "text-warning" },
}

export function ProductDetailPanel({ productId, onClose }: ProductDetailPanelProps) {
  return (
    <div className="w-[400px] shrink-0">
      <Card className="sticky top-20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Cemento UGC 42.5kg</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">{productId}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Categoría</p>
              <p className="font-medium">Construcción</p>
            </div>
            <div>
              <p className="text-muted-foreground">Unidad</p>
              <p className="font-medium">Saco</p>
            </div>
            <div>
              <p className="text-muted-foreground">Costo</p>
              <p className="font-medium font-mono">Q 72.00</p>
            </div>
            <div>
              <p className="text-muted-foreground">Precio</p>
              <p className="font-medium font-mono">Q 85.00</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stock Total</p>
              <Badge variant="destructive">15</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Stock Mínimo</p>
              <p className="font-medium">50</p>
            </div>
          </div>

          <Tabs defaultValue="sucursales" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="sucursales" className="flex-1">
                Sucursales
              </TabsTrigger>
              <TabsTrigger value="movimientos" className="flex-1">
                Movimientos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sucursales" className="mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sucursal</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockBySucursal.map((item) => (
                    <TableRow key={item.sucursal}>
                      <TableCell className="text-sm">{item.sucursal}</TableCell>
                      <TableCell className="text-right font-medium">{item.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="movimientos" className="mt-3">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {movimientos.map((mov, idx) => {
                  const config = tipoConfig[mov.tipo as keyof typeof tipoConfig]
                  const Icon = config.icon
                  return (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{mov.tipo}</span>
                          <span className={`font-mono ${config.color}`}>
                            {mov.cantidad > 0 ? "+" : ""}
                            {mov.cantidad}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs truncate">{mov.comentario}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(mov.fecha).toLocaleDateString("es-GT")} • {mov.usuario}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
