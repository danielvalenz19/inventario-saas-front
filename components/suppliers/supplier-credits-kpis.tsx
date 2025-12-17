import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Building2, AlertTriangle, Clock } from "lucide-react"

const kpis = [
  {
    title: "Total Cuentas por Pagar",
    value: "Q 32,150.00",
    icon: DollarSign,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Proveedores con Deuda",
    value: "12",
    icon: Building2,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Deudas Vencidas",
    value: "Q 8,500.00",
    subtitle: "3 proveedores",
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "Pagos Próximos (7 días)",
    value: "Q 15,800.00",
    subtitle: "4 proveedores",
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
]

export function SupplierCreditsKPIs() {
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
