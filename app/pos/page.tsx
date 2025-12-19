"use client"

import { useMemo, useState } from "react"
import {
  ArrowRightLeft,
  BadgeCheck,
  CreditCard,
  Minus,
  Package,
  PhoneCall,
  Plus,
  QrCode,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Users2,
} from "lucide-react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { posBundles, posCustomers, posProducts } from "@/lib/mock/pos"
import type { POSProduct } from "@/types/pos"

type CartItem = {
  productId: string
  quantity: number
}

const paymentOptions = ["Efectivo", "Tarjeta", "Transferencia", "Pago mixto"]

export default function POSPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("Todos")
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState(posCustomers[0]?.id ?? "")
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0])
  const [cashReceived, setCashReceived] = useState("0")
  const [splitCash, setSplitCash] = useState("0")
  const [splitCard, setSplitCard] = useState("0")
  const [cardLast4, setCardLast4] = useState("")
  const [cardAuth, setCardAuth] = useState("")
  const [transferRef, setTransferRef] = useState("")
  const [saleNote, setSaleNote] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "completed">("idle")

  const categories = useMemo(() => ["Todos", ...new Set(posProducts.map((product) => product.categoria))], [])

  const filteredProducts = useMemo(() => {
    return posProducts.filter((product) => {
      const matchesSearch =
        product.nombre.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "Todos" || product.categoria === category
      return matchesSearch && matchesCategory
    })
  }, [category, search])

  const selectedCustomer = useMemo(() => posCustomers.find((customer) => customer.id === customerId), [customerId])

  const cartLines = useMemo(() => {
    return cart
      .map((line) => {
        const product = posProducts.find((item) => item.id === line.productId)
        if (!product) return null
        return {
          ...line,
          product,
          lineSubtotal: product.precio * line.quantity,
          lineTax: product.precio * line.quantity * product.ivaRate,
        }
      })
      .filter(Boolean) as Array<CartItem & { product: POSProduct; lineSubtotal: number; lineTax: number }>
  }, [cart])

  const subtotal = cartLines.reduce((acc, line) => acc + line.lineSubtotal, 0)
  const tax = cartLines.reduce((acc, line) => acc + line.lineTax, 0)
  const discount = cartLines.length >= 5 ? subtotal * 0.05 : 0
  const total = subtotal - discount + tax
  const loyalty = Math.floor(total / 25)
  const cashAmount = Number.parseFloat(cashReceived) || 0
  const splitCashAmount = Number.parseFloat(splitCash) || 0
  const splitCardAmount = Number.parseFloat(splitCard) || 0
  const splitTotal = splitCashAmount + splitCardAmount
  const changeDue = Math.max(0, cashAmount - total)
  const splitDifference = Math.max(0, total - splitTotal)

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === productId)
      if (existing) {
        return prev.map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line))
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const removeLine = (productId: string) => {
    setCart((prev) => prev.filter((line) => line.productId !== productId))
  }

  const addBundle = (skus: string[]) => {
    skus.forEach((sku) => {
      const product = posProducts.find((item) => item.sku === sku)
      if (product) {
        addToCart(product.id)
      }
    })
  }

  const creditUsage = selectedCustomer
    ? Math.min(100, Math.round((selectedCustomer.saldo / selectedCustomer.limiteCredito) * 100))
    : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Turno matutino · Caja #3</p>
            <h1 className="text-3xl font-bold">Punto de Venta</h1>
            <p className="text-muted-foreground">Procesa ventas y combos mayoristas con un solo clic.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="secondary" className="rounded-full border border-dashed">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              Modo seguro
            </Badge>
            <Badge className="rounded-full bg-chart-1/10 text-chart-1">
              <Sparkles className="mr-1.5 h-4 w-4" />
              IA sugiere: Reponer bebidas
            </Badge>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Caja disponible", value: "Q 12,500", helper: "Efectivo contado", icon: ShoppingCart },
                { label: "Cliente frecuente", value: selectedCustomer?.nombre ?? "Sin cliente", helper: "Saldo actual", icon: Users2 },
                { label: "Meta del turno", value: "Q 35,000", helper: "73% completado", icon: BadgeCheck },
              ].map((indicator) => (
                <Card key={indicator.label} className="border-none bg-muted/30 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{indicator.label}</CardTitle>
                    <indicator.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{indicator.value}</p>
                    <p className="text-xs text-muted-foreground">{indicator.helper}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
                <SearchField value={search} onChange={setSearch} />
                <Button variant="ghost" size="icon" className="rounded-xl border border-dashed">
                  <ScanLine className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl border border-dashed">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="min-w-[180px] rounded-2xl border-dashed">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-3xl border border-dashed bg-gradient-to-r from-primary/5 via-transparent to-accent/10 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Combos sugeridos</p>
                  <h2 className="text-lg font-semibold">Optimiza tu ticket</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/30 text-xs text-primary">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Venta mayorista
                </Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {posBundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="group rounded-2xl border border-transparent bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold">
                      {bundle.nombre}
                      <Badge variant="secondary" className="rounded-full">
                        -{bundle.ahorro}%
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{bundle.descripcion}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold">Q {bundle.precio.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{bundle.productos.join(" · ")}</p>
                      </div>
                      <Button size="sm" onClick={() => addBundle(bundle.productos)} className="rounded-full px-4">
                        Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="rounded-3xl border border-muted/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Catálogo rápido</CardTitle>
                <Badge variant="outline" className="rounded-full border-dashed text-xs uppercase">
                  {filteredProducts.length} resultados
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[520px]">
                  <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onAdd={() => addToCart(product.id)} />
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full">
                        <Empty className="border-0 bg-muted/40">
                          <EmptyTitle>Sin resultados</EmptyTitle>
                          <EmptyDescription>Prueba otra búsqueda o limpia los filtros.</EmptyDescription>
                        </Empty>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="rounded-3xl border border-primary/10 shadow-lg shadow-primary/5">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Cliente asignado</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selectedCustomer?.nombre ?? "Venta rápida"}</h3>
                      {selectedCustomer && (
                        <Badge variant="outline" className="rounded-full">
                          {selectedCustomer.tipo}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger size="sm" className="rounded-full border-dashed">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {posCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCustomer && (
                  <div className="rounded-2xl border border-dashed p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Saldo</span>
                      <strong>Q {selectedCustomer.saldo.toFixed(2)}</strong>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={creditUsage} className="h-2 flex-1 rounded-full" />
                      <span className="text-muted-foreground">{creditUsage}%</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Límite: Q {selectedCustomer.limiteCredito.toFixed(0)} · Frecuencia {selectedCustomer.frecuencia}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Productos añadidos
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => setCart([])}>
                    Limpiar
                  </Button>
                </div>
                <ScrollArea className="h-[260px] pr-2">
                  <div className="space-y-3">
                    {cartLines.length === 0 && (
                      <Empty className="border border-dashed bg-muted/20">
                        <EmptyTitle>Aún no hay productos</EmptyTitle>
                        <EmptyDescription>Selecciona artículos del catálogo para iniciar la venta.</EmptyDescription>
                      </Empty>
                    )}
                    {cartLines.map((line) => (
                      <div key={line.productId} className="rounded-2xl border bg-muted/30 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{line.product.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {line.product.sku} · {line.product.categoria}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => removeLine(line.productId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(line.productId, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-semibold">{line.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(line.productId, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">Q {line.lineSubtotal.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">IVA Q {line.lineTax.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-muted/80 bg-card/90 shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  Resumen y pago
                  <Badge variant="outline" className="rounded-full text-xs">
                    {loyalty} pts
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>Q {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>IVA</span>
                    <span>Q {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Descuento</span>
                    <span className="text-red-500">- Q {discount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>Q {total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Método de pago</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {paymentOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={paymentMethod === option ? "default" : "outline"}
                        className={cn("justify-start rounded-2xl border-dashed", paymentMethod === option && "shadow-lg")}
                        onClick={() => setPaymentMethod(option)}
                      >
                        {option === "Tarjeta" && <CreditCard className="mr-2 h-4 w-4" />}
                        {option === "Efectivo" && <ReceiptText className="mr-2 h-4 w-4" />}
                        {option === "Transferencia" && <ArrowRightLeft className="mr-2 h-4 w-4" />}
                        {option === "Pago mixto" && <Tag className="mr-2 h-4 w-4" />}
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed bg-muted/20 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Estado de cobro</span>
                    <Badge variant={paymentStatus === "completed" ? "default" : "outline"} className="rounded-full text-xs">
                      {paymentStatus === "completed" ? "Pagado" : paymentStatus === "processing" ? "Procesando" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {paymentStatus === "completed"
                      ? "Venta cerrada. Puedes generar factura o iniciar una nueva venta."
                      : "Completa los datos del cobro para finalizar la venta."}
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border bg-background p-3">
                  {paymentMethod === "Efectivo" && (
                    <>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Recibido en efectivo</span>
                        <span>Cambio: Q {changeDue.toFixed(2)}</span>
                      </div>
                      <Input
                        inputMode="decimal"
                        value={cashReceived}
                        onChange={(event) => setCashReceived(event.target.value)}
                        placeholder="Monto recibido"
                        className="rounded-xl"
                      />
                    </>
                  )}

                  {paymentMethod === "Tarjeta" && (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          value={cardLast4}
                          onChange={(event) => setCardLast4(event.target.value)}
                          placeholder="Últimos 4 dígitos"
                          className="rounded-xl"
                        />
                        <Input
                          value={cardAuth}
                          onChange={(event) => setCardAuth(event.target.value)}
                          placeholder="Autorización"
                          className="rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Se enviará voucher por correo cuando el pago sea aprobado.</p>
                    </>
                  )}

                  {paymentMethod === "Transferencia" && (
                    <>
                      <Input
                        value={transferRef}
                        onChange={(event) => setTransferRef(event.target.value)}
                        placeholder="Referencia de transferencia"
                        className="rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">Verifica el comprobante antes de liberar la mercancía.</p>
                    </>
                  )}

                  {paymentMethod === "Pago mixto" && (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          inputMode="decimal"
                          value={splitCash}
                          onChange={(event) => setSplitCash(event.target.value)}
                          placeholder="Efectivo"
                          className="rounded-xl"
                        />
                        <Input
                          inputMode="decimal"
                          value={splitCard}
                          onChange={(event) => setSplitCard(event.target.value)}
                          placeholder="Tarjeta"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Total cubierto: Q {splitTotal.toFixed(2)}</span>
                        <span>Restante: Q {splitDifference.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Notas de la venta</p>
                  <Input
                    value={saleNote}
                    onChange={(event) => setSaleNote(event.target.value)}
                    placeholder="Ej. Entrega en puerta 3, requiere factura CF"
                    className="rounded-2xl"
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    size="lg"
                    className="rounded-2xl text-base"
                    onClick={() => setPaymentStatus("completed")}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Finalizar venta · Q {total.toFixed(2)}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-2xl"
                    onClick={() => setPaymentStatus("processing")}
                  >
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Guardar en espera
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: ReceiptText, title: "Factura", helper: "Generar factura" },
                    { icon: CreditCard, title: "Voucher", helper: "Enviar al correo" },
                    { icon: ShieldCheck, title: "Garantía", helper: "Registrar entrega" },
                  ].map((action) => (
                    <button
                      key={action.title}
                      type="button"
                      className="flex flex-col items-start gap-1 rounded-2xl border border-dashed p-3 text-left text-sm transition hover:border-primary/40"
                    >
                      <action.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{action.title}</span>
                      <span className="text-xs text-muted-foreground">{action.helper}</span>
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-muted/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Referencia de venta</span>
                    <span className="font-semibold text-foreground">#POS-2024-0983</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Cajero</span>
                    <span>María Ocampo</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Entrega estimada</span>
                    <span>15 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}

function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex-1 rounded-2xl border border-dashed bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar SKU, producto o categoría"
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("text-muted-foreground", className)}>
      <path
        d="m21 21-4.35-4.35M10.5 18.5a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProductCard({ product, onAdd }: { product: POSProduct; onAdd: () => void }) {
  return (
    <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:border-primary/30 hover:shadow-lg">
      {product.etiqueta && (
        <Badge className="absolute right-4 top-4 rounded-full bg-chart-1/10 text-xs text-chart-1">{product.etiqueta}</Badge>
      )}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.categoria}</p>
        <h3 className="text-lg font-semibold leading-tight">{product.nombre}</h3>
        <p className="text-sm text-muted-foreground">{product.sku}</p>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">Q {product.precio.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Stock: {product.stock} u.</p>
        </div>
        <Button className="rounded-full px-4" size="sm" onClick={onAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar
        </Button>
      </div>
    </div>
  )
}
