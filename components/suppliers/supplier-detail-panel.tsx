"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X, Building2, Phone, Plus } from "lucide-react"

interface SupplierDetailPanelProps {
  supplierId: string
  onClose: () => void
}

const compras = [
  { fecha: "2024-01-05", documento: "OC-0045", monto: 8500, saldo: 8500, vencimiento: "2024-01-20" },
  { fecha: "2023-12-28", documento: "OC-0042", monto: 4800, saldo: 4800, vencimiento: "2024-01-12" },
  { fecha: "2023-12-15", documento: "OC-0038", monto: 2500, saldo: 2500, vencimiento: "2024-01-15" },
]

const pagos = [
  { fecha: "2024-01-08", monto: 5000, metodo: "Transferencia", comentario: "Pago parcial OC-0040" },
  { fecha: "2023-12-30", monto: 8500, metodo: "Cheque", comentario: "Pago completo OC-0035" },
  { fecha: "2023-12-20", monto: 3200, metodo: "Transferencia", comentario: "Abono" },
]

export function SupplierDetailPanel({ supplierId, onClose }: SupplierDetailPanelProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  return (
    <div className="w-[420px] shrink-0">
      <Card className="sticky top-20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-3/10 p-2">
              <Building2 className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-base">Cementos Progreso</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">{supplierId}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Supplier Info */}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>2222-1234</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-warning/10 p-3">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
              <p className="text-xl font-bold text-warning">Q 15,800.00</p>
            </div>
            <Badge variant="secondary">Próximo</Badge>
          </div>

          {/* Actions */}
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Pago</DialogTitle>
                <DialogDescription>Registra un pago al proveedor Cementos Progreso</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input id="monto" placeholder="Q 0.00" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodo">Método de Pago</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentario">Comentario</Label>
                  <Textarea id="comentario" placeholder="Notas adicionales..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowPaymentDialog(false)}>Guardar Pago</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Purchases */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Compras a Crédito</h4>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Documento</TableHead>
                    <TableHead className="text-xs text-right">Saldo</TableHead>
                    <TableHead className="text-xs text-right">Vence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compras.map((compra) => (
                    <TableRow key={compra.documento}>
                      <TableCell className="text-xs font-mono">{compra.documento}</TableCell>
                      <TableCell className="text-xs text-right font-mono">Q {compra.saldo.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        {new Date(compra.vencimiento).toLocaleDateString("es-GT")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Historial de Pagos</h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {pagos.map((pago, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm">
                  <div>
                    <p className="font-medium text-primary">- Q {pago.monto.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pago.fecha).toLocaleDateString("es-GT")} • {pago.metodo}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[120px] truncate">{pago.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
