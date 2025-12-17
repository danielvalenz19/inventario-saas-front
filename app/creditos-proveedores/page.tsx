"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SupplierCreditsKPIs } from "@/components/suppliers/supplier-credits-kpis"
import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { SupplierDetailPanel } from "@/components/suppliers/supplier-detail-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

export default function CreditosProveedoresPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  return (
    <AdminLayout>
      <div className="flex gap-6">
        <div className={`flex-1 space-y-6 ${selectedSupplier ? "max-w-[calc(100%-420px)]" : ""}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Créditos a Proveedores</h1>
              <p className="text-muted-foreground">Gestión de cuentas por pagar</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </div>

          {/* KPIs */}
          <SupplierCreditsKPIs />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar proveedor..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aldia">Al día</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <SuppliersTable onSelectSupplier={setSelectedSupplier} selectedSupplier={selectedSupplier} />
        </div>

        {/* Supplier Detail Panel */}
        {selectedSupplier && (
          <SupplierDetailPanel supplierId={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
        )}
      </div>
    </AdminLayout>
  )
}
