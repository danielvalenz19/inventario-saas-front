import { AdminLayout } from "@/components/layout/admin-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { ProductRotationChart } from "@/components/dashboard/product-rotation-chart"
import { LowStockTable } from "@/components/dashboard/low-stock-table"
import { TopDebtorsTable } from "@/components/dashboard/top-debtors-table"
import { SupplierPaymentsTable } from "@/components/dashboard/supplier-payments-table"

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Dashboard</span>
            </h1>
            <p className="mt-1 text-muted-foreground">Resumen general de tu negocio</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Actualizado hace 2 min</span>
          </div>
        </div>

        {/* KPIs */}
        <KPICards />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <SalesChart />
          <ProductRotationChart />
        </div>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-3">
          <LowStockTable />
          <TopDebtorsTable />
          <SupplierPaymentsTable />
        </div>
      </div>
    </AdminLayout>
  )
}
