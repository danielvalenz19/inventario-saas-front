"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const salesByDay = [
  { dia: "Lun", ventas: 12500 },
  { dia: "Mar", ventas: 15200 },
  { dia: "Mié", ventas: 11800 },
  { dia: "Jue", ventas: 18900 },
  { dia: "Vie", ventas: 22300 },
  { dia: "Sáb", ventas: 28500 },
  { dia: "Dom", ventas: 8200 },
]

const salesByCategory = [
  { categoria: "Construcción", ventas: 85420, porcentaje: 45.6 },
  { categoria: "Ferretería", ventas: 42150, porcentaje: 22.5 },
  { categoria: "Pinturas", ventas: 28900, porcentaje: 15.4 },
  { categoria: "Plomería", ventas: 18650, porcentaje: 9.9 },
  { categoria: "Electricidad", ventas: 12200, porcentaje: 6.5 },
]

const barColors = ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"]

export function SalesReport() {
  return (
    <div className="space-y-6">
      {/* Date Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Input type="date" defaultValue="2024-01-01" />
            </div>
            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Input type="date" defaultValue="2024-01-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Ventas por Día de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByDay}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    dataKey="dia"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Q${value / 1000}k`}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value: number) => [`Q ${value.toLocaleString()}`, "Ventas"]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="ventas" radius={[4, 4, 0, 0]}>
                    {salesByDay.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByCategory.map((item) => (
                  <TableRow key={item.categoria}>
                    <TableCell className="font-medium">{item.categoria}</TableCell>
                    <TableCell className="text-right font-mono">Q {item.ventas.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.porcentaje}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-mono font-bold">Q 187,320</TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
