"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Building2, Bell, Database, Shield } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Ajustes generales del sistema</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Información del Negocio</CardTitle>
              </div>
              <CardDescription>Datos de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Negocio</Label>
                <Input defaultValue="Ferretería El Martillo" />
              </div>
              <div className="space-y-2">
                <Label>NIT</Label>
                <Input defaultValue="1234567-8" />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input defaultValue="5a Calle 10-25, Zona 1, Guatemala" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input defaultValue="2222-3333" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Notificaciones</CardTitle>
              </div>
              <CardDescription>Preferencias de alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de stock crítico</Label>
                  <p className="text-sm text-muted-foreground">Notificar cuando el stock baje del mínimo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de créditos vencidos</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre deudas vencidas</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resumen diario por email</Label>
                  <p className="text-sm text-muted-foreground">Recibir resumen de actividad</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Inventory Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Inventario</CardTitle>
              </div>
              <CardDescription>Configuración de inventario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Método de costeo</Label>
                <Select defaultValue="promedio">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promedio">Costo Promedio</SelectItem>
                    <SelectItem value="peps">PEPS (Primero en entrar)</SelectItem>
                    <SelectItem value="ueps">UEPS (Último en entrar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Días para alertar stock bajo</Label>
                <Input type="number" defaultValue="7" />
              </div>
              <div className="space-y-2">
                <Label>Días sin rotación para alertar</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">Seguridad</CardTitle>
              </div>
              <CardDescription>Opciones de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cerrar sesión automáticamente</Label>
                  <p className="text-sm text-muted-foreground">Después de 30 minutos de inactividad</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Registro de actividad</Label>
                  <p className="text-sm text-muted-foreground">Guardar log de acciones de usuarios</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
