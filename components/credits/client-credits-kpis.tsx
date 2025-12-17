import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, AlertTriangle, Clock } from "lucide-react"

const kpis = [
  {
    title: "Total Cuentas por Cobrar",
    value: "Q 45,670.00",
    icon: DollarSign,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Clientes con Deuda",
    value: "28",
    icon: Users,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Créditos Vencidos",
    value: "Q 12,450.00",
    subtitle: "8 clientes",
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "Por Vencer (7 días)",
    value: "Q 8,920.00",
    subtitle: "5 clientes",
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
]

export function ClientCreditsKPIs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
