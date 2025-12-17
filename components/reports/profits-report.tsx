"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const marginByCategory = [
  { categoria: "Ferretería", margen: 52.3 },
  { categoria: "Electricidad", margen: 48.5 },
  { categoria: "Plomería", margen: 42.1 },
  { categoria: "Pinturas", margen: 38.7 },
  { categoria: "Construcción", margen: 28.4 },
]

const topProfitableProducts = [
  { producto: 'Tornillos para madera 2"', categoria: "Ferretería", ventas: 125, ganancia: 1250, margen: 66.7 },
  { producto: "Cable THHN #12 (m)", categoria: "Electricidad", ventas: 2125, ganancia: 5312, margen: 55.6 },
  { producto: 'Clavos 2.5" (lb)', categoria: "Ferretería", ventas: 180, ganancia: 720, margen: 50.0 },
  { producto: "Pintura Látex Blanca (galón)", categoria: "Pinturas", ventas: 2700, ganancia: 1080, margen: 42.1 },
  { producto: "Piedrín 3/4 (m³)", categoria: "Construcción", ventas: 5600, ganancia: 1600, margen: 40.0 },
]

const getMarginColor = (margen: number) => {
  if (margen >= 50) return "#22c55e"
  if (margen >= 40) return "#84cc16"
  if (margen >= 35) return "#eab308"
  return "#f97316"
}

export function ProfitsReport() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Margin by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Margen por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 60]}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="categoria"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Margen"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="margen" radius={[0, 4, 4, 0]}>
                    {marginByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMarginColor(entry.margen)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Profitable Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Productos Más Rentables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProfitableProducts.map((item) => (
                  <TableRow key={item.producto}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.producto}</p>
                        <p className="text-xs text-muted-foreground">{item.categoria}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      Q {item.ganancia.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.margen}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
