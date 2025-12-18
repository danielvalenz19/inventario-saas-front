"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "1", ventas: 4200 },
  { day: "2", ventas: 3800 },
  { day: "3", ventas: 5100 },
  { day: "4", ventas: 4700 },
  { day: "5", ventas: 5500 },
  { day: "6", ventas: 6200 },
  { day: "7", ventas: 5900 },
  { day: "8", ventas: 4300 },
  { day: "9", ventas: 4800 },
  { day: "10", ventas: 5200 },
  { day: "11", ventas: 5600 },
  { day: "12", ventas: 6100 },
  { day: "13", ventas: 6800 },
  { day: "14", ventas: 7200 },
  { day: "15", ventas: 6500 },
  { day: "16", ventas: 5900 },
  { day: "17", ventas: 6300 },
  { day: "18", ventas: 6700 },
  { day: "19", ventas: 7100 },
  { day: "20", ventas: 7500 },
  { day: "21", ventas: 6900 },
  { day: "22", ventas: 7300 },
  { day: "23", ventas: 7800 },
  { day: "24", ventas: 8100 },
  { day: "25", ventas: 7600 },
  { day: "26", ventas: 8200 },
  { day: "27", ventas: 8500 },
  { day: "28", ventas: 7900 },
  { day: "29", ventas: 8300 },
  { day: "30", ventas: 8450 },
]

export function SalesChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Ventas por Día (Últimos 30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Q${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [`Q ${value.toLocaleString()}`, "Ventas"]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.15)",
                  borderRadius: "var(--radius)",
                  color: "var(--foreground)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#f59e0b" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
