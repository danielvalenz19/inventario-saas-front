import { Card, CardContent } from "@/components/ui/card"
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    title: "Ventas de Hoy",
    value: "Q 8,450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20 text-primary",
  },
  {
    title: "Ventas del Mes",
    value: "Q 187,320",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/20 text-accent",
  },
  {
    title: "Valor Inventario",
    value: "Q 524,890",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    gradient: "from-chart-3/20 to-chart-3/5",
    iconBg: "bg-chart-3/20 text-chart-3",
  },
  {
    title: "Por Cobrar",
    value: "Q 45,670",
    change: "+5.3%",
    trend: "up",
    icon: Users,
    gradient: "from-chart-5/20 to-chart-5/5",
    iconBg: "bg-chart-5/20 text-chart-5",
  },
  {
    title: "Por Pagar",
    value: "Q 32,150",
    change: "-15.8%",
    trend: "down",
    icon: Building2,
    gradient: "from-chart-4/20 to-chart-4/5",
    iconBg: "bg-chart-4/20 text-chart-4",
  },
  {
    title: "Alertas",
    value: "12",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
    gradient: "from-destructive/20 to-destructive/5",
    iconBg: "bg-destructive/20 text-destructive",
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <Card
          key={kpi.title}
          className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          {/* Gradient background */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", kpi.gradient)} />

          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  kpi.iconBg,
                )}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  kpi.trend === "up" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive",
                )}
              >
                {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{kpi.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
