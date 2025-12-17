"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/users/users-table"
import { RolesTable } from "@/components/users/roles-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search } from "lucide-react"

export default function UsuariosPage() {
  const [showNewUser, setShowNewUser] = useState(false)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Usuarios y Roles</h1>
          <p className="text-muted-foreground">Gestión de accesos al sistema</p>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Usuario</DialogTitle>
                  <DialogDescription>Crea una nueva cuenta de usuario</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input placeholder="Nombre del usuario" />
                  </div>
                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    <Input type="email" placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña Temporal</Label>
                    <Input type="password" placeholder="Contraseña inicial" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueno">Dueño</SelectItem>
                        <SelectItem value="encargado">Encargado</SelectItem>
                        <SelectItem value="cajero">Cajero</SelectItem>
                        <SelectItem value="bodeguero">Bodeguero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sucursal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Sucursal Central</SelectItem>
                        <SelectItem value="norte">Sucursal Norte</SelectItem>
                        <SelectItem value="sur">Sucursal Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewUser(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowNewUser(false)}>Crear Usuario</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="usuarios" className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar usuario..." className="pl-10" />
            </div>
            <UsersTable />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
