"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DEMO_CREDENTIALS,
  hasAuthCookie,
  isValidCredentials,
  setAuthCookie,
} from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (hasAuthCookie()) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    if (isValidCredentials(email, password)) {
      setAuthCookie()
      router.replace("/dashboard")
      return
    }

    setSubmitting(false)
    setError("Correo o contraseña incorrectos.")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-sidebar/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sidebar">
              Portal Administrativo
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                Control total de inventario y créditos en un solo tablero.
              </h1>
              <p className="text-base text-muted-foreground">
                Ingresa con tu cuenta autorizada para acceder a reportes, alertas y el POS en tiempo real.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Indicadores en vivo</p>
                <p className="text-xs text-muted-foreground">Ventas, rotación y saldos en minutos.</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Alertas proactivas</p>
                <p className="text-xs text-muted-foreground">Stock crítico y clientes prioritarios.</p>
              </div>
            </div>
          </div>

          <Card className="border-border/60 bg-card shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Iniciar sesión</CardTitle>
              <CardDescription>Usa el correo autorizado para acceder al panel.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Validando..." : "Entrar al panel"}
                </Button>
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                  Credenciales demo: {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
