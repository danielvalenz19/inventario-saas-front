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
import { X, User, Phone, CreditCard, Plus, MessageCircle } from "lucide-react"

interface ClientDetailPanelProps {
  clientId: string
  onClose: () => void
}

const facturas = [
  { fecha: "2024-01-02", documento: "FAC-0125", monto: 5500, saldo: 5500, vencimiento: "2024-01-17" },
  { fecha: "2023-12-28", documento: "FAC-0118", monto: 4200, saldo: 4200, vencimiento: "2024-01-12" },
  { fecha: "2023-12-20", documento: "FAC-0105", monto: 2800, saldo: 2800, vencimiento: "2024-01-05" },
]

const abonos = [
  { fecha: "2024-01-10", monto: 2000, metodo: "Efectivo", comentario: "Abono parcial" },
  { fecha: "2024-01-03", monto: 3500, metodo: "Transferencia", comentario: "Pago factura FAC-0098" },
  { fecha: "2023-12-26", monto: 1500, metodo: "Efectivo", comentario: "Abono parcial" },
]

export function ClientDetailPanel({ clientId, onClose }: ClientDetailPanelProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  return (
    <div className="w-[420px] shrink-0">
      <Card className="sticky top-20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Construcciones López</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">{clientId}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>5555-1234</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Límite: Q 25,000</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-destructive/10 p-3">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
              <p className="text-xl font-bold text-destructive">Q 12,500.00</p>
            </div>
            <Badge variant="destructive">Vencido</Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Abono
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Abono</DialogTitle>
                  <DialogDescription>Registra un pago del cliente Construcciones López</DialogDescription>
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
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
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
                  <Button onClick={() => setShowPaymentDialog(false)}>Guardar Abono</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Invoices */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Facturas Fiadas</h4>
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
                  {facturas.map((factura) => (
                    <TableRow key={factura.documento}>
                      <TableCell className="text-xs font-mono">{factura.documento}</TableCell>
                      <TableCell className="text-xs text-right font-mono">Q {factura.saldo.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        {new Date(factura.vencimiento).toLocaleDateString("es-GT")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Historial de Abonos</h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {abonos.map((abono, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm">
                  <div>
                    <p className="font-medium text-accent">+ Q {abono.monto.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(abono.fecha).toLocaleDateString("es-GT")} • {abono.metodo}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[120px] truncate">{abono.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
