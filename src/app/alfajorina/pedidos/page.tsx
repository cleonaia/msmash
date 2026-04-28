"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  Store,
  Mail,
} from "lucide-react";
import {
  alfajorinaProducts,
  alfajorinaCategories,
  type ProductCategory,
} from "@/features/alfajorina/data/menu";
import { alfajorinaContact, alfajorinaLinks } from "@/config/alfajorina";

/* ─── Types ─── */
type CartItem = { id: string; qty: number };
type OrderMode = "recogida" | "envio";

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

export default function AlfajorinaPedidosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [mode, setMode] = useState<OrderMode>("recogida");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });

  const addItem = useCallback((id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      return existing
        ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i));
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const getQty = (id: string) => cart.find((i) => i.id === id)?.qty ?? 0;

  const filteredProducts =
    activeCategory === "all"
      ? alfajorinaProducts
      : alfajorinaProducts.filter((p) => p.category === activeCategory);

  const cartProducts = cart
    .map(({ id, qty }) => {
      const product = alfajorinaProducts.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter((item): item is { product: (typeof alfajorinaProducts)[0]; qty: number } => item !== null);

  const subtotal = cartProducts.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const shippingCost = mode === "envio" ? 4.99 : 0;
  const total = subtotal + shippingCost;
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const buildWhatsAppMessage = () => {
    const lines = [
      "🍫 *Pedido Alfajorina*",
      "",
      ...cartProducts.map(({ product, qty }) => `• ${product.name} x${qty} — ${fmt(product.price * qty)}`),
      "",
      `*Subtotal:* ${fmt(subtotal)}`,
      mode === "envio" ? `*Envío:* ${fmt(shippingCost)}` : "*Recogida en tienda*",
      `*Total:* ${fmt(total)}`,
      "",
      formData.name ? `Nombre: ${formData.name}` : "",
      formData.notes ? `Notas: ${formData.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${alfajorinaContact.whatsappNumber}?text=${encodeURIComponent(lines)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-alfe-cream flex items-center justify-center px-6 pt-24">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-alfe-caramel/10 border border-alfe-caramel/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-alfe-caramel" />
          </div>
          <h2 className="font-display text-4xl text-alfe-choco uppercase tracking-wide">
            ¡Pedido recibido!
          </h2>
          <p className="text-alfe-choco-light text-base">
            Gracias, {formData.name || "amig@"}. Te confirmaremos tu pedido en breve por email o WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noreferrer"
              className="btn-alfe-primary inline-flex gap-2 items-center justify-center"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Confirmar por WhatsApp
            </a>
            <Link href="/alfajorina" className="btn-alfe-outline inline-flex gap-2 items-center justify-center">
              Volver al inicio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alfe-cream">

      {/* ── Header ── */}
      <div className="relative mt-20 h-48 sm:h-64 flex items-end overflow-hidden bg-alfe-choco">
        <Image
          src="https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=1920&q=80"
          alt="Pedidos Alfajorina"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/95 via-alfe-choco/50 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-8">
          <span className="alfe-label-caramel block mb-2">Alfajorina</span>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] text-alfe-cream uppercase tracking-wide leading-none">
            Tu Pedido
          </h1>
        </div>
      </div>

      {/* ── Mode switcher ── */}
      <div className="bg-alfe-cream-dark border-b border-alfe-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex rounded-2xl bg-white border border-alfe-border p-1.5 w-fit gap-1.5">
            {(["recogida", "envio"] as OrderMode[]).map((m) => {
              const Icon = m === "recogida" ? Store : Truck;
              const label = m === "recogida" ? "Recogida en tienda" : "Envío a domicilio";
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                    mode === m
                      ? "bg-alfe-caramel text-white shadow-md"
                      : "text-alfe-choco-light hover:text-alfe-choco"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
          {mode === "envio" && (
            <p className="text-xs text-alfe-choco-light mt-2 ml-1">
              Envío estándar: {fmt(4.99)} · 1-3 días hábiles
            </p>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">

          {/* ── Left: Product catalog ── */}
          <div>
            <h2 className="font-display text-3xl text-alfe-choco uppercase tracking-wide mb-6">
              Elige tus alfajores
            </h2>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              <button
                onClick={() => setActiveCategory("all")}
                className={`whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${
                  activeCategory === "all"
                    ? "bg-alfe-caramel text-white"
                    : "border border-alfe-border text-alfe-choco-light hover:text-alfe-choco"
                }`}
              >
                Todos
              </button>
              {alfajorinaCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${
                    activeCategory === cat.id
                      ? "bg-alfe-caramel text-white"
                      : "border border-alfe-border text-alfe-choco-light hover:text-alfe-choco"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const qty = getQty(product.id);
                return (
                  <article
                    key={product.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 bg-white ${
                      qty > 0
                        ? "border-alfe-caramel/50 shadow-md"
                        : "border-alfe-border hover:border-alfe-caramel/30"
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-display text-base text-alfe-choco leading-none uppercase tracking-wide truncate">
                          {product.name}
                        </h3>
                        <span className="text-sm font-bold text-alfe-caramel shrink-0">
                          {fmt(product.price)}
                        </span>
                      </div>
                      <p className="text-xs text-alfe-choco-light line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(product.id)}
                              className="w-7 h-7 rounded-full border border-alfe-border flex items-center justify-center text-alfe-choco-mid hover:border-alfe-caramel hover:text-alfe-caramel transition-colors"
                              aria-label="Quitar uno"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-alfe-choco">
                              {qty}
                            </span>
                            <button
                              onClick={() => addItem(product.id)}
                              className="w-7 h-7 rounded-full bg-alfe-caramel text-white flex items-center justify-center hover:bg-alfe-choco-mid transition-colors"
                              aria-label="Añadir uno"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(product.id)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-alfe-caramel hover:text-alfe-choco-mid transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Añadir
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ── Right: Cart & checkout ── */}
          <div className="lg:sticky lg:top-28">
            <div className="surface-alfe p-6">
              <h2 className="font-display text-2xl text-alfe-choco uppercase tracking-wide mb-5 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-alfe-caramel" />
                Tu cesta
                {totalItems > 0 && (
                  <span className="text-xs font-black px-2 py-1 rounded-full bg-alfe-caramel text-white">
                    {totalItems}
                  </span>
                )}
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-alfe-choco-light">
                  <Package className="h-10 w-10 mx-auto mb-3 text-alfe-border" />
                  <p className="text-sm">Tu cesta está vacía.</p>
                  <p className="text-xs mt-1 text-alfe-choco-light/60">
                    Añade alfajores desde el catálogo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {cartProducts.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-alfe-choco truncate">{product.name}</p>
                        <p className="text-xs text-alfe-caramel font-bold">{fmt(product.price * qty)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-6 h-6 rounded-full border border-alfe-border flex items-center justify-center text-alfe-choco-light hover:border-alfe-caramel hover:text-alfe-caramel transition-colors"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-alfe-choco">{qty}</span>
                        <button
                          onClick={() => addItem(product.id)}
                          className="w-6 h-6 rounded-full bg-alfe-caramel text-white flex items-center justify-center hover:bg-alfe-choco-mid transition-colors"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(product.id)}
                          className="ml-1 w-6 h-6 rounded-full border border-alfe-border flex items-center justify-center text-alfe-choco-light hover:border-red-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              {cart.length > 0 && (
                <div className="border-t border-alfe-border pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-alfe-choco-light">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {mode === "envio" && (
                    <div className="flex justify-between text-sm text-alfe-choco-light">
                      <span>Envío estándar</span>
                      <span>{fmt(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-alfe-choco border-t border-alfe-border pt-2">
                    <span>Total</span>
                    <span className="text-alfe-caramel">{fmt(total)}</span>
                  </div>
                </div>
              )}

              {/* Customer info form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="input-alfe"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="input-alfe"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="input-alfe"
                />
                <textarea
                  placeholder="Notas del pedido (sabores, alergias, personalización...)"
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="input-alfe resize-none"
                />

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="btn-alfe-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Confirmar pedido
                </button>

                {/* WhatsApp CTA */}
                {cart.length > 0 && (
                  <a
                    href={buildWhatsAppMessage()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-green-500/50 text-green-700 text-sm font-bold uppercase tracking-[0.15em] hover:bg-green-50 transition-colors"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Pedir por WhatsApp
                  </a>
                )}
              </form>

              {/* Contact info */}
              <div className="mt-5 pt-5 border-t border-alfe-border space-y-2">
                <a
                  href={`tel:${alfajorinaContact.phoneHref}`}
                  className="flex items-center gap-2 text-xs text-alfe-choco-light hover:text-alfe-caramel transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {alfajorinaContact.email}
                </a>
                <Link
                  href="/alfajorina/contacto"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-alfe-caramel hover:text-alfe-choco-mid transition-colors"
                >
                  ¿Encargo especial? Contáctanos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
