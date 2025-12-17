"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { ProductDetailPanel } from "@/components/inventory/product-detail-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ClipboardList, PackageSearch, Barcode } from "lucide-react"

export default function InventarioPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [barcodeInput, setBarcodeInput] = useState("")

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcodeInput) {
      setSelectedProduct(barcodeInput)
      setBarcodeInput("")
    }
  }

  return (
    <AdminLayout>
      <div className="flex gap-6">
        <div className={`flex-1 space-y-6 ${selectedProduct ? "max-w-[calc(100%-400px)]" : ""}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Inventario</h1>
              <p className="text-muted-foreground">Gestión de productos y stock</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                Inventario Físico
              </Button>
              <Button variant="outline">
                <PackageSearch className="mr-2 h-4 w-4" />
                Ajuste de Inventario
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          {/* Barcode Scanner Input */}
          <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Escanear código de barras aquí..."
                className="pl-10 font-mono"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </form>

          {/* Filters */}
          <InventoryFilters />

          {/* Table */}
          <InventoryTable onSelectProduct={setSelectedProduct} selectedProduct={selectedProduct} />
        </div>

        {/* Product Detail Panel */}
        {selectedProduct && <ProductDetailPanel productId={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </AdminLayout>
  )
}
