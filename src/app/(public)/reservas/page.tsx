"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, Users, Instagram, ShoppingBag, CheckCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { hours, siteConfig, socialLinks, contactInfo } from "@/config/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

type Mode = "taula" | "collect";

export default function ReservasPage() {
  const [mode, setMode] = useState<Mode>("taula");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        title="Reserves"
        subtitle="Reserva la teva taula o fes la teva comanda per emportar"
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
      />

      <section className="surface-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
          {/* ── Main form panel ── */}
          <div>
            {/* Mode switcher */}
            <div className="flex rounded-2xl bg-virutes-cream border border-virutes-border p-1.5 mb-8 w-fit gap-1">
              <button
                onClick={() => setMode("taula")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "taula"
                    ? "bg-virutes-red text-white shadow"
                    : "text-virutes-brown hover:text-virutes-red"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Reservar taula
              </button>
              <button
                onClick={() => setMode("collect")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "collect"
                    ? "bg-virutes-red text-white shadow"
                    : "text-virutes-brown hover:text-virutes-red"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Click &amp; Collect
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <CheckCircle className="h-16 w-16 text-virutes-olive" />
                <h3 className="font-display text-4xl text-virutes-red">Rebut!</h3>
                <p className="text-virutes-brown/70 max-w-sm">
                  {mode === "taula"
                    ? "Confirmarem la teva reserva en menys de 30 minuts per WhatsApp o email."
                    : "Confirmarem la teva comanda i l'hora de recollida per WhatsApp."}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary mt-4"
                >
                  Fer una altra {mode === "taula" ? "reserva" : "comanda"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "taula" ? (
                  <>
                    <h2 className="font-serif text-2xl text-virutes-brown">Dades de la reserva</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          Nom i cognoms *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Maria García"
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          Telèfon *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+34 600 000 000"
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-virutes-red" /> Data *</span>
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-virutes-red" /> Hora *</span>
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        >
                          <option value="">Selecciona hora</option>
                          {["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-virutes-red" /> Persones *</span>
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        >
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "persona" : "persones"}</option>
                          ))}
                          <option value="9+">Més de 8 (grups)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="maria@email.com"
                          className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                        Al·lèrgies o comentaris
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Menciona al·lèrgies, preferències o qualsevol cosa que hagem de saber..."
                        className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl text-virutes-brown">Comanda per emportar</h2>
                    <div className="bg-virutes-cream rounded-2xl p-5 text-sm text-virutes-brown/70 leading-relaxed">
                      <p className="font-semibold text-virutes-brown mb-1">Com funciona el Click & Collect?</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Omple el formulari amb els productes que vols</li>
                        <li>Selecciona l&apos;hora de recollida (mínim 30 min antelació)</li>
                        <li>Et confirmem per WhatsApp</li>
                        <li>Vine, recull i gaudeix!</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">Nom *</label>
                        <input type="text" required placeholder="Maria García" className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">Telèfon *</label>
                        <input type="tel" required placeholder="+34 600 000 000" className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">Hora de recollida *</label>
                        <select required className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown">
                          <option value="">Selecciona hora</option>
                          {["12:30","13:00","13:30","14:00","14:30","15:00","20:00","20:30","21:00","21:30"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">Data *</label>
                        <input type="date" required className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-virutes-brown/60 mb-2">
                        Productes que vols (descriu la teva comanda) *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Ex: 2x Focaccia Margherita, 1x Pinsa Burrata, 1x Tiramisú... Menciona al·lèrgies."
                        className="w-full px-4 py-3 bg-white border border-virutes-border rounded-xl focus:outline-none focus:border-virutes-red text-virutes-brown resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit" className="btn-primary px-10 py-4 text-base">
                    {mode === "taula" ? "Confirmar reserva" : "Enviar comanda"}
                  </button>
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#20b858] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    O contactar per WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* ── Sidebar info ── */}
          <div className="space-y-6">
            <div className="bg-virutes-cream rounded-2xl p-6 border border-virutes-border">
              <h3 className="font-semibold text-virutes-brown mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-virutes-red" /> Horaris
              </h3>
              <ul className="space-y-2">
                {hours.map(({ days, time, closed }) => (
                  <li key={days} className="text-sm flex justify-between gap-2">
                    <span className={`font-medium ${closed ? "text-virutes-red" : "text-virutes-brown"}`}>{days}</span>
                    <span className={closed ? "text-virutes-red/70" : "text-virutes-brown/60"}>{time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-virutes-border shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Forn artesanal de Virutes"
                width={600}
                height={360}
                className="w-full rounded-xl object-cover mb-4"
              />
              <p className="text-sm text-virutes-brown/65 leading-relaxed">
                {siteConfig.address}
              </p>
            </div>

            <div className="bg-virutes-red/10 rounded-2xl p-5 border border-virutes-red/20">
              <p className="text-sm text-virutes-brown font-semibold mb-1 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Reserva telefònica</p>
              <p className="text-xs text-virutes-brown/65 mb-3">
                Preferixes trucar? Estarem encantats d&apos;atendre&apos;t.
              </p>
              <a href={contactInfo.phoneHref} className="btn-primary text-xs px-4 py-2">
                {contactInfo.phonePretty}
              </a>
            </div>

            {/* Redes socials */}
            <div className="rounded-2xl border border-virutes-border bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-virutes-brown/50 mb-4">Segueix-nos</p>
              <div className="flex gap-3">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3 text-white text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)" }}
                >
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                  Instagram
                </a>
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3 bg-[#010101] text-white text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
                >
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
