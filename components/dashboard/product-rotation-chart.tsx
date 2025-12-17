"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const topProducts = [
  { name: "Cemento UGC", ventas: 245 },
  { name: "Varilla 3/8", ventas: 189 },
  { name: "Block 15x20x40", ventas: 156 },
  { name: "Arena (m³)", ventas: 134 },
  { name: "Piedrín (m³)", ventas: 98 },
]

const lowRotation = [
  { name: "Pintura Especial", ventas: 2 },
  { name: 'Tornillos 4"', ventas: 5 },
  { name: "Alambre #18", ventas: 8 },
  { name: 'Clavos 2.5"', ventas: 12 },
  { name: "Lija #100", ventas: 15 },
]

const topColors = ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"]
const lowColors = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"]

export function ProductRotationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Rotación de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Top 5 más vendidos</p>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} unidades`, "Ventas"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="ventas" radius={[0, 4, 4, 0]}>
                    {topProducts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={topColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">5 sin rotación</p>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lowRotation} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} unidades`, "Ventas"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="ventas" radius={[0, 4, 4, 0]}>
                    {lowRotation.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={lowColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
