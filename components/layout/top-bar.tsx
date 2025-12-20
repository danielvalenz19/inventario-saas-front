"use client"

import { useRouter } from "next/navigation"
import { Bell, Search, ChevronDown, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearAuthCookie } from "@/lib/auth"

export function TopBar() {
  const router = useRouter()

  const handleLogout = () => {
    clearAuthCookie()
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xl">
      {/* Search - Enhanced styling */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos, clientes, proveedores..."
            className="border-border/50 bg-muted/50 pl-10 placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-muted"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Store indicator - Premium badge */}
        <div className="hidden items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 md:flex">
          <Store className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Ferretería El Martillo</span>
            <span className="text-[10px] text-muted-foreground">Sucursal Central</span>
          </div>
        </div>

        <ThemeToggle />

        {/* Notifications - Premium styling */}
        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30">
            5
          </span>
        </Button>

        {/* User menu - Premium avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
              <Avatar className="h-8 w-8 border-2 border-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-sm font-bold text-primary-foreground">
                  JG
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-semibold">Juan García</span>
                <span className="text-[10px] text-muted-foreground">Administrador</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-border/50 bg-card">
            <DropdownMenuLabel className="text-muted-foreground">Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="focus:bg-muted">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-muted">Preferencias</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleLogout}
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
