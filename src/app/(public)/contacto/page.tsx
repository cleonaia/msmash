"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, Send, Shield, MessageSquare, Flame } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { contactInfo, hours, siteConfig } from "@/config/site";

const faqs = [
  {
    question: "¿Cuánto tardáis en responder?",
    answer: "Normalmente respondemos en menos de 24 horas. Si es urgente, llámanos directamente.",
  },
  {
    question: "¿Hacéis reservas?",
    answer: "Somos un local de paso sin reservas formales. Ven cuando quieras en horario de apertura.",
  },
  {
    question: "¿Tenéis opciones sin gluten?",
    answer: "Sí, podemos adaptarnos. Escríbenos antes de venir para preparar tu pedido con garantías.",
  },
];

type FormState = { name: string; email: string; phone: string; subject: string; message: string };
const emptyForm: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-smash-border bg-smash-smoke px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-smash-fire/15 border border-smash-fire/30">
          <CheckCircle className="h-8 w-8 text-smash-fire" />
        </div>
        <div>
          <h3 className="font-display text-4xl text-smash-cream uppercase tracking-wide">Mensaje enviado</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-smash-cream/50">
            Gracias por escribirnos. Te contestaremos lo antes posible.
          </p>
        </div>
        <button onClick={() => { setForm(emptyForm); setSubmitted(false); }}
          className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-smash-fire underline underline-offset-4">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-smash-border bg-smash-smoke px-4 py-3.5 text-sm text-smash-cream placeholder:text-smash-cream/25 focus:outline-none focus:border-smash-fire focus:ring-2 focus:ring-smash-fire/15 transition-all duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Nombre *</label>
          <input name="name" required value={form.name} onChange={handleChange} placeholder="Tu nombre" className={inputCls} />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Teléfono</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+34 690 000 000" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Email *</label>
        <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="tu@correo.com" className={inputCls} />
      </div>
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Asunto</label>
        <select name="subject" value={form.subject} onChange={handleChange} className={inputCls}>
          <option value="">Elige un tema</option>
          <option value="pedido">Pedido especial</option>
          <option value="alergenos">Alérgenos / dietas</option>
          <option value="eventos">Eventos / grupos</option>
          <option value="otros">Otros</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Mensaje *</label>
        <textarea name="message" required rows={5} value={form.message} onChange={handleChange}
          placeholder="Cuéntanos qué necesitas..."
          className={inputCls + " resize-none"} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-smash-cream/30 leading-relaxed">
          Para urgencias, llámanos al {contactInfo.phonePretty}.
        </p>
        <button type="submit" disabled={loading}
          className="btn-smash flex items-center justify-center gap-2 disabled:opacity-60 sm:min-w-[200px]">
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : <Send className="h-4 w-4" />}
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}

export default function ContactoPage() {
  return (
    <div className="bg-smash-black min-h-screen">
      <PageHeader
        title="Contacto"
        subtitle="Escríbenos · Llámanos · Ven a vernos"
        backgroundImage="/images/products/the-m-smash.jpeg"
        accent="sky"
      />

      {/* ── Support cards ── */}
      <section className="bg-smash-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="label-sky block mb-4">Atención directa</span>
            <h2 className="font-display display-md text-smash-cream uppercase tracking-wide">¿En qué te ayudamos?</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { icon: MessageSquare, title: "Pedidos especiales", desc: "Grupos, eventos o peticiones concretas. Lo preparamos con antelación.", accent: "fire" as const },
              { icon: Shield, title: "Alérgenos y dietas", desc: "Escríbenos antes de venir. Adaptamos tu burger con todas las garantías.", accent: "sky" as const },
              { icon: Flame, title: "Colaboraciones", desc: "Para marcas, TikTok content o cualquier propuesta. Hablamos.", accent: "gold" as const },
            ].map(({ icon: Icon, title, desc, accent }) => {
              const iconBg = { fire: "bg-smash-fire/10 text-smash-fire border-smash-fire/20", sky: "bg-smash-sky/10 text-smash-sky border-smash-sky/20", gold: "bg-smash-gold/10 text-smash-gold border-smash-gold/20" };
              return (
                <article key={title} className="surface-smoke p-7">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${iconBg[accent]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl text-smash-cream uppercase tracking-wide mb-2">{title}</h3>
                  <p className="text-sm text-smash-cream/45 leading-relaxed">{desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="bg-smash-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* Form */}
            <div className="rounded-2xl border border-smash-border bg-smash-dark p-8 sm:p-10">
              <span className="label-fire block mb-4">Formulario directo</span>
              <h2 className="font-display display-md text-smash-cream uppercase tracking-wide mb-4">
                Envíanos un mensaje
              </h2>
              <p className="text-smash-cream/40 mb-8 leading-relaxed text-sm">
                Pedidos especiales, preguntas sobre alérgenos, grupos o lo que sea. Respondemos rápido.
              </p>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">

              {/* Horarios */}
              <div className="surface-smoke p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-smash-turquoise" />
                  <h3 className="font-display text-xl text-smash-cream uppercase tracking-wide">Horarios</h3>
                </div>
                <ul className="space-y-2.5">
                  {hours.map((entry) => (
                    <li key={entry.days} className="flex items-start justify-between gap-4 text-sm">
                      <span className={`font-semibold ${entry.closed ? "text-smash-cream/25" : "text-smash-cream/70"}`}>{entry.days}</span>
                      <span className={`text-right ${entry.closed ? "text-smash-cream/20" : "text-smash-turquoise font-bold"}`}>{entry.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Teléfono / Email */}
              <div className="surface-smoke p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-smash-turquoise" />
                  <h3 className="font-display text-xl text-smash-cream uppercase tracking-wide">Llámanos</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <a href={contactInfo.phoneHref}
                    className="flex items-center justify-between rounded-xl bg-smash-smoke-mid px-4 py-3 hover:border-smash-turquoise/40 border border-smash-border transition-colors">
                    <span className="text-smash-cream/40">Teléfono</span>
                    <span className="font-bold text-smash-cream">{contactInfo.phonePretty}</span>
                  </a>
                  <a href={`mailto:${contactInfo.email}`}
                    className="flex items-center justify-between rounded-xl bg-smash-smoke-mid px-4 py-3 hover:border-smash-turquoise/40 border border-smash-border transition-colors">
                    <span className="flex items-center gap-2 text-smash-cream/40">
                      <Mail className="h-4 w-4 text-smash-turquoise" /> Email
                    </span>
                    <span className="font-bold text-smash-cream text-xs">{contactInfo.email}</span>
                  </a>
                </div>
              </div>

              {/* Dónde estamos */}
              <div className="surface-smoke p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-smash-turquoise" />
                  <h3 className="font-display text-xl text-smash-cream uppercase tracking-wide">Dónde estamos</h3>
                </div>
                <p className="text-sm text-smash-turquoise/80 leading-relaxed mb-4">{siteConfig.address}</p>
                <Link href={siteConfig.googleMapsUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-smash-turquoise hover:gap-2 transition-all duration-150">
                  Abrir Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* CTA Card */}
              <div className="rounded-2xl p-6 sky-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-smash-black/70" />
                <div className="relative z-10">
                  <span className="label-sky block mb-3">¿Cuándo venís?</span>
                  <h3 className="font-display text-2xl text-smash-cream uppercase tracking-wide mb-3 leading-tight">
                    Carrer de Colegi, 5
                  </h3>
                  <p className="text-sm text-smash-cream/50 mb-5 leading-relaxed">
                    Sin reservas. Sin esperas largas. Solo ven, pide y disfruta.
                  </p>
                  <Link href={siteConfig.googleMapsUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-smash-fire px-5 py-3 text-sm font-bold text-white hover:bg-smash-ember transition-colors">
                    Ver en el mapa <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-smash-dark px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="label-gold block mb-4">Antes de escribir</span>
            <h2 className="font-display display-md text-smash-cream uppercase tracking-wide">Preguntas frecuentes</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="surface-smoke p-7">
                <h3 className="font-display text-xl text-smash-cream uppercase tracking-wide mb-3">{faq.question}</h3>
                <p className="text-sm text-smash-cream/45 leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mapa ── */}
      <section>
        <iframe
          src={siteConfig.googleMapsEmbed}
          width="100%"
          height="400"
          style={{ border: 0, display: "block", filter: "grayscale(100%) invert(90%) contrast(90%)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localización M SMASH Terrassa"
        />
      </section>
    </div>
  );
}
