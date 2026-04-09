"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, CheckCircle, Clock, User, MessageSquare, Flame, Mail, Loader } from "lucide-react";
import { menuItems, categories } from "@/features/menu/data/menu";
import { contactInfo } from "@/config/site";
import { createOrder } from "@/actions/orders";
import StripeCheckout from "@/components/stripe/StripeCheckout";

/* ─── Types ─── */
type CartItem = { id: string; qty: number };

/* ─── Helpers ─── */
function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function getItemPreviewPosition(itemId: string) {
  if (itemId === "the-crispy") return "center 34%";
  if (itemId === "the-m-smash") return "center 40%";
  if (itemId === "tequenos") return "center 32%";
  if (itemId === "super-crispy-chicken") return "center 42%";
  if (itemId === "crispy-chicken") return "center 44%";
  return "center center";
}

function getItemMobilePreviewPosition(itemId: string) {
  if (itemId === "the-crispy") return "center 28%";
  if (itemId === "the-m-smash") return "center 34%";
  if (itemId === "tequenos") return "center 24%";
  if (itemId === "super-crispy-chicken") return "center 36%";
  if (itemId === "crispy-chicken") return "center 38%";
  return getItemPreviewPosition(itemId);
}

function isDrinkItem(itemId: string) {
  return (
    itemId.startsWith("cerveza-") ||
    itemId === "tinto-de-verano" ||
    itemId === "pepsi-clasica" ||
    itemId === "lipton" ||
    itemId === "pepsi-zero" ||
    itemId === "sprite" ||
    itemId === "schweppes-naranja" ||
    itemId === "schweppes-limon" ||
    itemId === "agua-solan" ||
    itemId === "agua-gas"
  );
}

/* ─── Pickup time slots ─── */
const TIME_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30",
];

/* ─── Main page component ─── */
export default function PedidosPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime]   = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent]   = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  /* Cart helpers */
  const getQty = useCallback((id: string) => cart.find((c) => c.id === id)?.qty ?? 0, [cart]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((c) => c.id !== id);
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => c.id === id ? { ...c, qty } : c);
      return [...prev, { id, qty }];
    });
  }, []);

  const inc = useCallback((id: string) => setQty(id, getQty(id) + 1), [getQty, setQty]);
  const dec = useCallback((id: string) => setQty(id, getQty(id) - 1), [getQty, setQty]);

  /* Cart derived state */
  const cartItems = useMemo(() =>
    cart.map(({ id, qty }) => {
      const item = menuItems.find((m) => m.id === id)!;
      return { ...item, qty, subtotal: item.price * qty };
    }),
  [cart]);

  const total     = useMemo(() => cartItems.reduce((s, i) => s + i.subtotal, 0), [cartItems]);
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const canSend   = cartItems.length > 0 && name.trim().length > 0 && phone.trim().length > 0 && email.trim().length > 0 && time.length > 0;

  /* Filtered items */
  const filtered = useMemo(() =>
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((m) => m.category === activeCategory),
  [activeCategory]);

  /* Create order and proceed to payment */
  const handleCreateOrder = async () => {
    if (!canSend || isCreatingOrder) return;
    
    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      const order = await createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        notes: notes,
        deliveryMethod: "Retiro en local",
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.qty,
          unitPrice: item.price // Price is already in EUR
        })),
        totalAmount: total
      });

      setOrderId(order.id);
      setSent(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear la orden";
      setOrderError(message);
      console.error("Error creating order:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const badge: Record<string, string> = {
    "El Original": "tag-fire", "El Más Potente": "tag-gold", "El Especial": "tag-sky",
    "Premium": "tag-gold", "Nuevo": "tag-sky", "Picante": "tag-fire",
    "De aquí": "tag-sky", "Ed. Limitada": "tag-gold", "Must Have": "tag-fire",
    "Imprescindible": "tag-fire",
  };

  return (
    <div className="bg-smash-black min-h-screen">

      {/* ── Page header ── */}
      <div className="relative mt-20 h-52 sm:h-64 flex items-end overflow-hidden sky-bg">
        <Image src="/images/products/the-crispy.jpeg"
          alt="Pedidos M SMASH" fill className="object-cover opacity-20" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-smash-black/90 via-smash-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <span className="label-fire block mb-3">Haz tu pedido</span>
          <h1 className="font-display display-md text-white uppercase tracking-wide leading-none">La Carta</h1>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-smash-sky/80 mt-2">
            Elige · Personaliza · Recoge en local
          </p>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-smash-dark border-b border-smash-border">
        <div className="fire-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-smash-cream/40 font-medium">
            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-smash-fire" /> Tiempo mín. preparación: 15 min</span>
            <span className="flex items-center gap-2"><WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" /> Confirmación por WhatsApp</span>
            <span className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-smash-sky" /> Recogida en local incluida</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-12">

          {/* ── LEFT: Menu items ── */}
          <div>
            {/* Category tabs */}
            <div className="sticky top-20 z-20 bg-smash-black/95 backdrop-blur-md pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-2 border-b border-smash-border mb-8">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveCategory("all")}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full transition-all duration-200
                    ${activeCategory === "all" ? "bg-smash-fire text-white shadow-fire-sm" : "bg-smash-smoke border border-smash-border text-smash-cream/45 hover:border-smash-fire/50"}`}>
                  Todo
                </button>
                {categories.map(({ id, label }) => (
                  <button key={id} onClick={() => setActiveCategory(id)}
                    className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full transition-all duration-200
                      ${activeCategory === id ? "bg-smash-fire text-white shadow-fire-sm" : "bg-smash-smoke border border-smash-border text-smash-cream/45 hover:border-smash-fire/50"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              {filtered.map((item) => {
                const qty = getQty(item.id);
                const mobilePosition = getItemMobilePreviewPosition(item.id);
                const desktopPosition = getItemPreviewPosition(item.id);
                return (
                  <div key={item.id}
                    className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all duration-200
                      ${qty > 0 ? "border-smash-fire/40 bg-smash-fire/5" : "border-smash-border bg-smash-smoke hover:border-smash-fire/25"}`}>

                    {/* Image */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden shrink-0 self-start">
                      <Image src={item.image} alt={item.name} fill
                        className={isDrinkItem(item.id) ? "object-contain p-1" : "object-cover object-[var(--mobile-pos)] sm:object-[var(--desktop-pos)]"}
                        style={{ '--mobile-pos': mobilePosition, '--desktop-pos': desktopPosition } as Record<string, string>}
                        sizes="96px" />
                      {item.badge && (
                        <div className="absolute top-1 left-1">
                          <span className={`${badge[item.badge] ?? "tag-fire"} text-[8px] px-1.5 py-0.5`}>{item.badge}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                        <h3 className="font-display text-lg sm:text-xl text-smash-cream leading-tight sm:leading-none uppercase tracking-wide">
                          {item.name}
                        </h3>
                        <span className="font-display text-lg sm:text-xl text-smash-turquoise leading-none shrink-0">
                          {fmt(item.price)}
                        </span>
                      </div>
                      <p className="text-xs text-smash-cream/40 leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      {/* Qty controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        {qty === 0 ? (
                          <button onClick={() => inc(item.id)}
                            className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-smash-fire border border-smash-fire/50 px-3 sm:px-4 py-2 rounded-full hover:bg-smash-fire hover:text-white transition-all duration-200">
                            <Plus className="h-3 w-3" /> Añadir
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <button onClick={() => dec(item.id)}
                              className="w-8 h-8 rounded-full bg-smash-smoke-mid border border-smash-border flex items-center justify-center text-smash-cream hover:bg-smash-fire hover:text-white hover:border-smash-fire transition-all">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-display text-2xl text-smash-cream w-6 text-center leading-none">{qty}</span>
                            <button onClick={() => inc(item.id)}
                              className="w-8 h-8 rounded-full bg-smash-fire border border-smash-fire flex items-center justify-center text-white hover:bg-smash-ember transition-all">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[10px] sm:text-[11px] font-black text-smash-fire ml-1">
                              {fmt(item.price * qty)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Cart & form ── */}
          <div id="cart-panel" className="lg:sticky lg:top-28 lg:self-start scroll-mt-24">
            <div className="rounded-2xl border border-smash-border bg-smash-dark overflow-hidden">
              {/* Cart header */}
              <div className="px-4 sm:px-6 py-5 border-b border-smash-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-smash-fire/15 border border-smash-fire/25 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-smash-fire" />
                    </div>
                    <div>
                      <p className="font-display text-xl text-smash-cream uppercase tracking-wide">Mi pedido</p>
                      <p className="text-[9px] text-smash-cream/30 uppercase tracking-[0.3em] font-black">
                        {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""}` : "Vacío"}
                      </p>
                    </div>
                  </div>
                  {cartItems.length > 0 && (
                    <button onClick={() => setCart([])}
                      className="p-2 text-smash-cream/25 hover:text-smash-fire transition-colors"
                      aria-label="Vaciar carrito">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cart items */}
              {cartItems.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-smash-smoke border border-smash-border flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-6 w-6 text-smash-cream/20" />
                  </div>
                  <p className="text-sm text-smash-cream/30 font-medium mb-1">Tu pedido está vacío</p>
                  <p className="text-xs text-smash-cream/20 leading-relaxed">Añade items desde la carta de la izquierda</p>
                </div>
              ) : (
                <div className="divide-y divide-smash-border max-h-72 sm:max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {(() => {
                          const mobilePosition = getItemMobilePreviewPosition(item.id);
                          const desktopPosition = getItemPreviewPosition(item.id);
                          return (
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={isDrinkItem(item.id) ? "object-contain p-0.5" : "object-cover object-[var(--mobile-pos)] sm:object-[var(--desktop-pos)]"}
                            style={{ '--mobile-pos': mobilePosition, '--desktop-pos': desktopPosition } as Record<string, string>}
                            sizes="40px"
                          />
                        </div>
                          );
                        })()}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-smash-cream leading-none uppercase tracking-wide truncate">{item.name}</p>
                          <p className="text-xs text-smash-cream/40 mt-0.5">{item.qty}x {fmt(item.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <button onClick={() => dec(item.id)} className="w-6 h-6 rounded-full bg-smash-smoke-mid flex items-center justify-center text-smash-cream/50 hover:text-smash-fire transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-display text-lg text-smash-cream w-4 text-center leading-none">{item.qty}</span>
                        <button onClick={() => inc(item.id)} className="w-6 h-6 rounded-full bg-smash-fire flex items-center justify-center text-white hover:bg-smash-ember transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-smash-turquoise w-14 text-right shrink-0">{fmt(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {cartItems.length > 0 && (
                <div className="px-5 py-4 border-t border-smash-border bg-smash-smoke/50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-smash-cream/40">Total</span>
                  <span className="font-display text-3xl text-smash-turquoise leading-none">{fmt(total)}</span>
                </div>
              )}

              {/* Form */}
              <div className="px-6 py-5 border-t border-smash-border space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-smash-cream/30 mb-4">
                  Datos de recogida
                </p>

                {/* Name */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                    Tu nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smash-cream/20" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="input-dark pl-9"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smash-cream/20" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+34 600 123 456"
                      className="input-dark pl-9"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smash-cream/20" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="input-dark pl-9"
                    />
                  </div>
                </div>

                {/* Pickup time */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                    Hora de recogida *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smash-cream/20" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="input-dark pl-9 appearance-none"
                    >
                      <option value="">Selecciona hora</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                    Notas / Alérgenos
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-smash-cream/20" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Sin pepinillos, alérgenos, peticiones especiales..."
                      className="input-dark pl-9 resize-none"
                    />
                  </div>
                </div>

                {/* Form display logic */}
                {sent && orderId ? (
                  <StripeCheckout
                    orderId={orderId}
                    onSuccess={() => {
                      setCart([]);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setTime("");
                      setNotes("");
                      setSent(false);
                      setOrderId(null);
                    }}
                    onCancel={() => {
                      setSent(false);
                      setOrderId(null);
                    }}
                  />
                ) : (
                  <>
                    {/* Email field - only show before checkout */}
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 block mb-1.5">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smash-cream/20" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="input-dark pl-9"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {orderError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{orderError}</p>
                      </div>
                    )}

                    {/* Confirm button */}
                    <button
                      onClick={handleCreateOrder}
                      disabled={!canSend || isCreatingOrder}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-200
                        ${canSend && !isCreatingOrder
                          ? "bg-green-600 text-white hover:bg-green-700 shadow-[0_4px_24px_rgba(37,211,102,0.35)]"
                          : "bg-smash-smoke border border-smash-border text-smash-cream/25 cursor-not-allowed"}`}
                    >
                      {isCreatingOrder ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Creando pedido...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Continuar al Pago
                        </>
                      )}
                    </button>

                    {!canSend && cartItems.length > 0 && (
                      <p className="text-[10px] text-smash-cream/25 text-center leading-relaxed">
                        {!name.trim() && "• Añade tu nombre  "}
                        {!phone.trim() && "• Añade tu teléfono  "}
                        {!email.trim() && "• Añade tu email  "}
                        {!time && "• Elige hora de recogida"}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Footer tip */}
              <div className="px-6 py-4 border-t border-smash-border bg-smash-smoke/30">
                <p className="text-[10px] text-smash-cream/20 leading-relaxed text-center">
                  Al pulsar confirmar, tu pedido se enviará para que lo preparemos. Un humano te confirmará por WhatsApp.
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link href="/menu"
                className="flex items-center justify-center gap-2 rounded-2xl border border-smash-border bg-smash-smoke py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-smash-cream/40 hover:border-smash-fire/40 hover:text-smash-fire transition-all">
                <Flame className="h-4 w-4" /> Ver carta
              </Link>
              <Link href="/contacto"
                className="flex items-center justify-center gap-2 rounded-2xl border border-smash-border bg-smash-smoke py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-smash-cream/40 hover:border-smash-sky/40 hover:text-smash-sky transition-all">
                <ArrowRight className="h-4 w-4" /> Horarios
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky cart bar ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <div className="fire-divider" />
          <div className="bg-smash-dark/98 backdrop-blur-md px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-smash-cream/40 uppercase tracking-[0.3em] font-black">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
              <p className="font-display text-2xl text-smash-turquoise leading-none">{fmt(total)}</p>
            </div>
            <button
              onClick={() => document.getElementById("cart-panel")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-smash flex-1 max-w-xs py-3.5 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Ver pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
