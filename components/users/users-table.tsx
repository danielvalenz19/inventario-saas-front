"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Lock, Trash2 } from "lucide-react"

const users = [
  {
    id: 1,
    nombre: "Juan García",
    email: "juan@ferreteria.com",
    rol: "Dueño",
    sucursal: "Todas",
    estado: "activo",
    ultimoAcceso: "2024-01-10T14:30:00",
    iniciales: "JG",
  },
  {
    id: 2,
    nombre: "María López",
    email: "maria@ferreteria.com",
    rol: "Encargado",
    sucursal: "Central",
    estado: "activo",
    ultimoAcceso: "2024-01-10T12:15:00",
    iniciales: "ML",
  },
  {
    id: 3,
    nombre: "Carlos Pérez",
    email: "carlos@ferreteria.com",
    rol: "Cajero",
    sucursal: "Central",
    estado: "activo",
    ultimoAcceso: "2024-01-10T09:45:00",
    iniciales: "CP",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    email: "ana@ferreteria.com",
    rol: "Bodeguero",
    sucursal: "Norte",
    estado: "activo",
    ultimoAcceso: "2024-01-09T18:20:00",
    iniciales: "AR",
  },
  {
    id: 5,
    nombre: "Pedro Hernández",
    email: "pedro@ferreteria.com",
    rol: "Cajero",
    sucursal: "Sur",
    estado: "inactivo",
    ultimoAcceso: "2023-12-15T10:00:00",
    iniciales: "PH",
  },
]

const rolColors = {
  Dueño: "bg-primary text-primary-foreground",
  Encargado: "bg-chart-3 text-primary-foreground",
  Cajero: "bg-chart-4 text-primary-foreground",
  Bodeguero: "bg-warning text-warning-foreground",
}

export function UsersTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último Acceso</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={rolColors[user.rol as keyof typeof rolColors]}>
                        {user.iniciales}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.nombre}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.rol}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.sucursal}</TableCell>
                <TableCell>
                  <Badge variant={user.estado === "activo" ? "default" : "secondary"}>
                    {user.estado === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.ultimoAcceso).toLocaleString("es-GT", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="mr-2 h-4 w-4" />
                        Cambiar contraseña
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desactivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
