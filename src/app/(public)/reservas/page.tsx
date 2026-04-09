"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users, Instagram, ShoppingBag, CheckCircle, Phone, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { hours, siteConfig, socialLinks, contactInfo } from "@/config/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

type Mode = "local" | "takeaway";

const inputCls =
  "w-full px-4 py-3 bg-smash-smoke border border-smash-border rounded-xl focus:outline-none focus:border-smash-fire focus:ring-2 focus:ring-smash-fire/15 text-smash-cream placeholder:text-smash-cream/20 text-sm transition-all duration-150";

export default function ReservasPage() {
  const [mode, setMode] = useState<Mode>("local");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-smash-black min-h-screen">
      <PageHeader
        title="Reservas"
        subtitle="Come en local · Recoge tu pedido"
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
        accent="fire"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

          {/* ── Main form ── */}
          <div>
            {/* Mode switcher */}
            <div className="flex rounded-2xl bg-smash-smoke border border-smash-border p-1.5 mb-10 w-fit gap-1.5">
              <button
                onClick={() => setMode("local")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  mode === "local"
                    ? "bg-smash-fire text-white shadow-fire-sm"
                    : "text-smash-cream/45 hover:text-smash-cream"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Comer en local
              </button>
              <button
                onClick={() => setMode("takeaway")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  mode === "takeaway"
                    ? "bg-smash-fire text-white shadow-fire-sm"
                    : "text-smash-cream/45 hover:text-smash-cream"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Takeaway
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-smash-fire/15 border border-smash-fire/30 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-smash-fire" />
                </div>
                <div>
                  <h3 className="font-display text-5xl text-smash-cream uppercase tracking-wide mb-2">
                    {mode === "local" ? "¡Reservado!" : "¡Pedido!"}
                  </h3>
                  <p className="text-smash-cream/50 max-w-sm">
                    {mode === "local"
                      ? "Te confirmamos la reserva en menos de 30 minutos por WhatsApp o email."
                      : "Te confirmamos el pedido y la hora de recogida por WhatsApp."}
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 btn-fire-border text-sm px-6 py-3"
                >
                  Nueva {mode === "local" ? "reserva" : "comanda"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "local" ? (
                  <>
                    <div className="mb-6">
                      <span className="label-fire block mb-3">Reserva de mesa</span>
                      <h2 className="font-display text-4xl text-smash-cream uppercase tracking-wide">
                        Reserva tu sitio
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">
                          Nombre y apellidos *
                        </label>
                        <input type="text" required placeholder="Tu nombre" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">
                          Teléfono *
                        </label>
                        <input type="tel" required placeholder="+34 600 000 000" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-smash-fire" /> Fecha *
                        </label>
                        <input type="date" required className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2 flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-smash-fire" /> Hora *
                        </label>
                        <select required className={inputCls}>
                          <option value="">Elige hora</option>
                          {["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2 flex items-center gap-1.5">
                          <Users className="h-3 w-3 text-smash-fire" /> Personas *
                        </label>
                        <select required className={inputCls}>
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                          ))}
                          <option value="9+">Más de 8 (grupos)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">
                          Email
                        </label>
                        <input type="email" placeholder="tu@email.com" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">
                        Alergias o comentarios
                      </label>
                      <textarea rows={3} placeholder="Alergias, celebraciones, peticiones especiales..."
                        className={inputCls + " resize-none"} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <span className="label-sky block mb-3">Recoge en local</span>
                      <h2 className="font-display text-4xl text-smash-cream uppercase tracking-wide">
                        Click &amp; Collect
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-smash-smoke border border-smash-border p-5 text-sm text-smash-cream/45 leading-relaxed mb-6">
                      <p className="font-black text-smash-cream/70 mb-3 text-[10px] uppercase tracking-[0.3em]">
                        ¿Cómo funciona?
                      </p>
                      <ol className="list-none space-y-2">
                        {[
                          "Rellena el formulario con los productos que quieres",
                          "Elige hora de recogida (mín. 30 min de antelación)",
                          "Te confirmamos por WhatsApp",
                          "¡Ven, recoge y disfruta!",
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex-none w-5 h-5 rounded-full bg-smash-fire flex items-center justify-center text-white text-[10px] font-black mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">Nombre *</label>
                        <input type="text" required placeholder="Tu nombre" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">Teléfono *</label>
                        <input type="tel" required placeholder="+34 600 000 000" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2 flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-smash-fire" /> Hora de recogida *
                        </label>
                        <select required className={inputCls}>
                          <option value="">Elige hora</option>
                          {["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-smash-fire" /> Fecha *
                        </label>
                        <input type="date" required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/35 mb-2">
                        Tu pedido * <span className="text-smash-cream/20 normal-case">(describe qué quieres)</span>
                      </label>
                      <textarea required rows={4}
                        placeholder="Ej: 2x The Classic, 1x Double Trouble sin cebolla, 2x Patatas Smash. Sin gluten si es posible."
                        className={inputCls + " resize-none"} />
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit" className="btn-smash px-10 py-4 text-base">
                    {mode === "local" ? "Confirmar reserva" : "Enviar pedido"}
                  </button>
                  <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#25D366] text-white text-sm font-bold rounded-full hover:bg-[#20b858] transition-colors">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    O contactar por WhatsApp
                  </a>
                </div>
              </form>
            )}

            {/* Pedidos CTA */}
            <div className="mt-10 rounded-2xl border border-smash-fire/25 bg-smash-fire/5 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-smash-fire/15 border border-smash-fire/25 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-5 w-5 text-smash-fire" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-smash-cream text-sm mb-1">¿Prefieres pedir directamente por WhatsApp?</p>
                  <p className="text-xs text-smash-cream/45 leading-relaxed mb-3">
                    Usa nuestro sistema de pedidos online, elige tus items y te enviamos el mensaje pre-preparado.
                  </p>
                  <Link href="/pedidos" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-smash-fire hover:gap-3 transition-all">
                    Ir a pedidos <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Horarios */}
            <div className="surface-smoke p-6">
              <h3 className="font-display text-xl text-smash-cream uppercase tracking-wide mb-5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-smash-fire" /> Horarios
              </h3>
              <ul className="space-y-2.5">
                {hours.map(({ days, time, closed }) => (
                  <li key={days} className="text-sm flex justify-between gap-2">
                    <span className={`font-semibold ${closed ? "text-smash-cream/25" : "text-smash-cream/65"}`}>{days}</span>
                    <span className={closed ? "text-smash-cream/20" : "text-smash-fire font-bold"}>{time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location photo */}
            <div className="surface-smoke overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80"
                  alt="Plancha M SMASH"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-smash-dark/80 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-sm text-smash-cream/45 leading-relaxed">{siteConfig.address}</p>
              </div>
            </div>

            {/* Phone CTA */}
            <div className="rounded-2xl border border-smash-sky/20 bg-smash-sky/5 p-5">
              <p className="font-black text-smash-cream/70 text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-smash-sky" /> Reserva por teléfono
              </p>
              <p className="text-xs text-smash-cream/40 mb-3">
                Prefieres llamar? Estaremos encantados.
              </p>
              <a href={contactInfo.phoneHref} className="btn-smash text-xs px-4 py-2.5 gap-2">
                {contactInfo.phonePretty}
              </a>
            </div>

            {/* Social */}
            <div className="surface-smoke p-5">
              <p className="label-gold mb-4">Síguenos</p>
              <div className="flex gap-3">
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 rounded-xl py-4 text-white text-xs font-black tracking-wider transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#F58529 0%,#DD2A7B 50%,#8134AF 100%)" }}>
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
                <a href={socialLinks.tiktok} target="_blank" rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 rounded-xl py-4 bg-[#010101] text-white text-xs font-black tracking-wider transition-all duration-200 hover:scale-105 border border-smash-border">
                  <TikTokIcon className="h-5 w-5" />
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
