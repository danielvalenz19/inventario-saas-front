"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

const roles = [
  { nombre: "Dueño", descripcion: "Acceso total al sistema" },
  { nombre: "Encargado", descripcion: "Gestión de inventario y créditos" },
  { nombre: "Cajero", descripcion: "Ventas y cobros" },
  { nombre: "Bodeguero", descripcion: "Control de inventario" },
]

const permisos = [
  {
    modulo: "Inventario",
    ver: [true, true, false, true],
    crear: [true, true, false, true],
    editar: [true, true, false, false],
    eliminar: [true, false, false, false],
  },
  {
    modulo: "Créditos Clientes",
    ver: [true, true, true, false],
    crear: [true, true, true, false],
    editar: [true, true, false, false],
    eliminar: [true, false, false, false],
  },
  {
    modulo: "Créditos Proveedores",
    ver: [true, true, false, false],
    crear: [true, true, false, false],
    editar: [true, true, false, false],
    eliminar: [true, false, false, false],
  },
  {
    modulo: "Reportes",
    ver: [true, true, false, false],
    crear: [true, false, false, false],
    editar: [false, false, false, false],
    eliminar: [false, false, false, false],
  },
  {
    modulo: "Configuración",
    ver: [true, false, false, false],
    crear: [true, false, false, false],
    editar: [true, false, false, false],
    eliminar: [true, false, false, false],
  },
]

export function RolesTable() {
  return (
    <div className="space-y-6">
      {/* Roles List */}
      <div className="grid gap-4 md:grid-cols-4">
        {roles.map((rol) => (
          <Card key={rol.nombre}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{rol.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{rol.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Matriz de Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Módulo</TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Dueño
                  </TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Encargado
                  </TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Cajero
                  </TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Bodeguero
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  {[0, 1, 2, 3].map((i) => (
                    <>
                      <TableHead key={`v-${i}`} className="text-center text-xs px-1">
                        Ver
                      </TableHead>
                      <TableHead key={`c-${i}`} className="text-center text-xs px-1">
                        Crear
                      </TableHead>
                      <TableHead key={`e-${i}`} className="text-center text-xs px-1">
                        Editar
                      </TableHead>
                      <TableHead
                        key={`d-${i}`}
                        className="text-center text-xs px-1 border-r border-border last:border-0"
                      >
                        Elim.
                      </TableHead>
                    </>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permisos.map((permiso) => (
                  <TableRow key={permiso.modulo}>
                    <TableCell className="font-medium">{permiso.modulo}</TableCell>
                    {[0, 1, 2, 3].map((roleIdx) => (
                      <>
                        <TableCell key={`v-${roleIdx}`} className="text-center px-1">
                          <Checkbox checked={permiso.ver[roleIdx]} disabled />
                        </TableCell>
                        <TableCell key={`c-${roleIdx}`} className="text-center px-1">
                          <Checkbox checked={permiso.crear[roleIdx]} disabled />
                        </TableCell>
                        <TableCell key={`e-${roleIdx}`} className="text-center px-1">
                          <Checkbox checked={permiso.editar[roleIdx]} disabled />
                        </TableCell>
                        <TableCell
                          key={`d-${roleIdx}`}
                          className="text-center px-1 border-r border-border last:border-0"
                        >
                          <Checkbox checked={permiso.eliminar[roleIdx]} disabled />
                        </TableCell>
                      </>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
