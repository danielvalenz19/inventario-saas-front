"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const creditsComparison = [
  { mes: "Oct", porCobrar: 38500, porPagar: 28200 },
  { mes: "Nov", porCobrar: 42100, porPagar: 31500 },
  { mes: "Dic", porCobrar: 48900, porPagar: 35800 },
  { mes: "Ene", porCobrar: 45670, porPagar: 32150 },
]

const topDebtors = [
  { nombre: "Construcciones López", saldo: 12500, vencidos: 12500, estado: "vencido" },
  { nombre: "María Pérez", saldo: 8750, vencidos: 0, estado: "aldia" },
  { nombre: "Ferretería Central", saldo: 6200, vencidos: 0, estado: "proximo" },
  { nombre: "Juan Rodríguez", saldo: 4800, vencidos: 4800, estado: "vencido" },
  { nombre: "Materiales GT", saldo: 3420, vencidos: 0, estado: "aldia" },
]

const topCreditors = [
  { nombre: "Cementos Progreso", saldo: 15800, vencidos: 0, estado: "proximo" },
  { nombre: "Aceros de Guatemala", saldo: 8500, vencidos: 8500, estado: "vencido" },
  { nombre: "Distribuidora El Sol", saldo: 4200, vencidos: 0, estado: "aldia" },
  { nombre: "Ferretería Mayorista", saldo: 2150, vencidos: 0, estado: "aldia" },
  { nombre: "Pinturas Corona", saldo: 1500, vencidos: 0, estado: "aldia" },
]

export function CreditsReport() {
  return (
    <div className="space-y-6">
      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Cuentas por Cobrar vs Cuentas por Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditsComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="mes"
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
                  formatter={(value: number, name: string) => [
                    `Q ${value.toLocaleString()}`,
                    name === "porCobrar" ? "Por Cobrar" : "Por Pagar",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  formatter={(value) => (value === "porCobrar" ? "Por Cobrar" : "Por Pagar")}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="porCobrar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="porPagar" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Debtors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Deudores (Clientes)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-right">Vencido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDebtors.map((item) => (
                  <TableRow key={item.nombre}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-right font-mono">Q {item.saldo.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-mono ${item.vencidos > 0 ? "text-red-500" : ""}`}>
                      {item.vencidos > 0 ? `Q ${item.vencidos.toLocaleString()}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Creditors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Acreedores (Proveedores)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-right">Vencido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCreditors.map((item) => (
                  <TableRow key={item.nombre}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-right font-mono">Q {item.saldo.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-mono ${item.vencidos > 0 ? "text-red-500" : ""}`}>
                      {item.vencidos > 0 ? `Q ${item.vencidos.toLocaleString()}` : "-"}
                    </TableCell>
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
