"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReport } from "@/components/reports/sales-report"
import { ProfitsReport } from "@/components/reports/profits-report"
import { RotationReport } from "@/components/reports/rotation-report"
import { CreditsReport } from "@/components/reports/credits-report"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReportesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reportes</h1>
            <p className="text-muted-foreground">Análisis y métricas del negocio</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ventas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="ganancias">Ganancias</TabsTrigger>
            <TabsTrigger value="rotacion">Rotación de Productos</TabsTrigger>
            <TabsTrigger value="creditos">Créditos</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas">
            <SalesReport />
          </TabsContent>
          <TabsContent value="ganancias">
            <ProfitsReport />
          </TabsContent>
          <TabsContent value="rotacion">
            <RotationReport />
          </TabsContent>
          <TabsContent value="creditos">
            <CreditsReport />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
