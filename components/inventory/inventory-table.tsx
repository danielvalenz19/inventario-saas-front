"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface InventoryTableProps {
  onSelectProduct: (id: string) => void
  selectedProduct: string | null
}

const products = [
  {
    id: "CEM-001",
    codigo: "7501234567890",
    nombre: "Cemento UGC 42.5kg",
    categoria: "Construcción",
    stock: 15,
    stockMinimo: 50,
    costo: 72.0,
    precio: 85.0,
    margen: 18.1,
    estado: "activo",
  },
  {
    id: "VAR-038",
    codigo: "7501234567891",
    nombre: 'Varilla 3/8" x 6m',
    categoria: "Construcción",
    stock: 28,
    stockMinimo: 100,
    costo: 45.5,
    precio: 58.0,
    margen: 27.5,
    estado: "activo",
  },
  {
    id: "BLO-152",
    codigo: "7501234567892",
    nombre: "Block 15x20x40",
    categoria: "Construcción",
    stock: 245,
    stockMinimo: 200,
    costo: 4.5,
    precio: 6.0,
    margen: 33.3,
    estado: "activo",
  },
  {
    id: "ARE-001",
    codigo: "7501234567893",
    nombre: "Arena de río (m³)",
    categoria: "Construcción",
    stock: 8,
    stockMinimo: 20,
    costo: 180.0,
    precio: 250.0,
    margen: 38.9,
    estado: "activo",
  },
  {
    id: "PIE-001",
    codigo: "7501234567894",
    nombre: "Piedrín 3/4 (m³)",
    categoria: "Construcción",
    stock: 5,
    stockMinimo: 15,
    costo: 200.0,
    precio: 280.0,
    margen: 40.0,
    estado: "activo",
  },
  {
    id: "TOR-001",
    codigo: "7501234567895",
    nombre: 'Tornillos para madera 2"',
    categoria: "Ferretería",
    stock: 500,
    stockMinimo: 200,
    costo: 0.15,
    precio: 0.25,
    margen: 66.7,
    estado: "activo",
  },
  {
    id: "CLA-001",
    codigo: "7501234567896",
    nombre: 'Clavos 2.5" (lb)',
    categoria: "Ferretería",
    stock: 45,
    stockMinimo: 50,
    costo: 8.0,
    precio: 12.0,
    margen: 50.0,
    estado: "activo",
  },
  {
    id: "PIN-001",
    codigo: "7501234567897",
    nombre: "Pintura Látex Blanca (galón)",
    categoria: "Pinturas",
    stock: 32,
    stockMinimo: 20,
    costo: 95.0,
    precio: 135.0,
    margen: 42.1,
    estado: "activo",
  },
  {
    id: "TUB-001",
    codigo: "7501234567898",
    nombre: 'Tubo PVC 4" x 6m',
    categoria: "Plomería",
    stock: 18,
    stockMinimo: 25,
    costo: 85.0,
    precio: 115.0,
    margen: 35.3,
    estado: "activo",
  },
  {
    id: "CAB-001",
    codigo: "7501234567899",
    nombre: "Cable THHN #12 (m)",
    categoria: "Electricidad",
    stock: 850,
    stockMinimo: 500,
    costo: 4.5,
    precio: 7.0,
    margen: 55.6,
    estado: "activo",
  },
]

export function InventoryTable({ onSelectProduct, selectedProduct }: InventoryTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Mínimo</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Margen</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.stock <= product.stockMinimo
              const isCritical = product.stock <= product.stockMinimo * 0.3
              return (
                <TableRow
                  key={product.id}
                  className={cn("cursor-pointer", selectedProduct === product.id && "bg-muted")}
                  onClick={() => onSelectProduct(product.id)}
                >
                  <TableCell className="font-mono text-xs">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{product.categoria}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn("font-medium", isCritical ? "text-destructive" : isLowStock ? "text-warning" : "")}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{product.stockMinimo}</TableCell>
                  <TableCell className="text-right font-mono text-sm">Q {product.costo.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">Q {product.precio.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn("font-medium", product.margen < 20 ? "text-destructive" : "text-accent")}>
                      {product.margen.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.estado === "activo" ? "default" : "secondary"}>
                      {product.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
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
