"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Edit, Plus } from "lucide-react"
import { useState } from "react"

const plantillas = [
  {
    id: 1,
    nombre: "Recordatorio de Deuda Cliente",
    canal: "Cliente",
    mensaje:
      "Hola {{cliente}}, le recordamos que tiene un saldo pendiente de Q{{monto}} con vencimiento el {{fecha_vencimiento}}. Por favor, acérquese a realizar su pago. Gracias.",
    activa: true,
  },
  {
    id: 2,
    nombre: "Alerta de Stock Crítico",
    canal: "Dueño",
    mensaje:
      "ALERTA: El producto {{producto}} tiene stock crítico ({{stock_actual}} unidades). Stock mínimo: {{stock_minimo}}. Se recomienda realizar pedido.",
    activa: true,
  },
  {
    id: 3,
    nombre: "Aviso de Pago a Proveedor",
    canal: "Dueño",
    mensaje:
      "RECORDATORIO: Tiene un pago pendiente a {{proveedor}} por Q{{monto}} con vencimiento el {{fecha_vencimiento}}.",
    activa: true,
  },
  {
    id: 4,
    nombre: "Confirmación de Abono",
    canal: "Cliente",
    mensaje:
      "Hola {{cliente}}, confirmamos su abono de Q{{monto}} recibido el {{fecha}}. Su nuevo saldo es Q{{saldo_pendiente}}. Gracias por su pago.",
    activa: false,
  },
]

export default function WhatsAppPage() {
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <MessageCircle className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Integración WhatsApp</h1>
            <p className="text-muted-foreground">Configuración de notificaciones automáticas</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Configuración General</CardTitle>
              <CardDescription>Activa o desactiva las notificaciones automáticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de deuda a clientes</Label>
                  <p className="text-sm text-muted-foreground">
                    Envía recordatorios automáticos cuando hay deudas vencidas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas críticas al administrador</Label>
                  <p className="text-sm text-muted-foreground">Notifica sobre stock crítico y alertas importantes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de vencimientos</Label>
                  <p className="text-sm text-muted-foreground">Avisa sobre pagos próximos a proveedores</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Estado de Conexión</CardTitle>
              <CardDescription>Información del número conectado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
                  <span className="font-medium">Conectado</span>
                </div>
                <Badge variant="outline">+502 5555-1234</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensajes enviados hoy</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensajes este mes</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última actividad</span>
                  <span className="font-medium">Hace 15 min</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Desconectar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Message Templates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Plantillas de Mensajes</CardTitle>
              <CardDescription>Personaliza los mensajes automáticos</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Plantilla
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nueva Plantilla</DialogTitle>
                  <DialogDescription>Crea una nueva plantilla de mensaje</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input placeholder="Nombre de la plantilla" />
                  </div>
                  <div className="space-y-2">
                    <Label>Canal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar canal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="proveedor">Proveedor</SelectItem>
                        <SelectItem value="dueno">Dueño</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mensaje</Label>
                    <Textarea placeholder="Escribe tu mensaje aquí..." className="min-h-[100px]" />
                    <p className="text-xs text-muted-foreground">
                      Placeholders disponibles: {"{{cliente}}"}, {"{{monto}}"}, {"{{fecha_vencimiento}}"},{" "}
                      {"{{producto}}"}, {"{{proveedor}}"}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="max-w-[300px]">Mensaje</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plantillas.map((plantilla) => (
                  <TableRow key={plantilla.id}>
                    <TableCell className="font-medium">{plantilla.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{plantilla.canal}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground truncate">{plantilla.mensaje}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={plantilla.activa} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(plantilla.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
