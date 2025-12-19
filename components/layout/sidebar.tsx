"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
  MessageCircle,
  UserCog,
  Settings,
  Sparkles,
  Store,
  Zap,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: Store },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Créditos Clientes", href: "/creditos-clientes", icon: Users },
  { name: "Créditos Proveedores", href: "/creditos-proveedores", icon: Building2 },
  { name: "Alertas", href: "/alertas", icon: AlertTriangle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { name: "Usuarios y Roles", href: "/usuarios", icon: UserCog },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">InventaGT</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-sidebar-primary">Pro Edition</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menú Principal
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon
                  className={cn("h-5 w-5 transition-transform duration-200", !isActive && "group-hover:scale-110")}
                />
                {item.name}
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground" />}
              </Link>
            )
          })}
        </nav>

        {/* AI Coming Soon */}
        <div className="mx-3 mb-4 overflow-hidden rounded-xl border border-sidebar-primary/20 bg-gradient-to-br from-sidebar-primary/10 via-transparent to-accent/5 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/20">
              <Sparkles className="h-4 w-4 text-sidebar-primary" />
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">Próximamente</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            IA para pedidos automáticos, detección de anomalías y optimización de precios.
          </p>
          <div className="mt-3 flex gap-1">
            <div className="h-1 w-8 rounded-full bg-sidebar-primary/40" />
            <div className="h-1 w-4 rounded-full bg-sidebar-primary/20" />
            <div className="h-1 w-2 rounded-full bg-sidebar-primary/10" />
          </div>
        </div>
      </div>
    </aside>
  )
}
