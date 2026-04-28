"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Instagram,
  Package,
} from "lucide-react";
import { alfajorinaContact, alfajorinaConfig, alfajorinaLinks, alfajorinaHours } from "@/config/alfajorina";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const faqs = [
  {
    question: "¿Cuánto tardáis en responder?",
    answer: "Normalmente respondemos en menos de 24 horas. Si es urgente, escríbenos por WhatsApp.",
  },
  {
    question: "¿Hacéis envíos fuera de Barcelona?",
    answer: "Sí, enviamos a toda España peninsular. El plazo es de 1-3 días hábiles con embalaje especial para que lleguen perfectos.",
  },
  {
    question: "¿Podéis hacer alfajores sin gluten?",
    answer: "Sí, podemos preparar versiones sin gluten por encargo. Contáctanos con al menos 72h de antelación.",
  },
  {
    question: "¿Preparáis encargos para eventos o empresas?",
    answer: "¡Por supuesto! Hacemos cajas personalizadas, tortas para eventos y packaging corporativo. Cuéntanos qué necesitas.",
  },
  {
    question: "¿Cuánto tiempo duran los alfajores?",
    answer: "Frescos duran 7 días a temperatura ambiente. En nevera, hasta 15 días. Sin conservantes, siempre.",
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-alfe-border bg-white px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-alfe-caramel/10 border border-alfe-caramel/20">
          <CheckCircle className="h-8 w-8 text-alfe-caramel" />
        </div>
        <div>
          <h3 className="font-display text-4xl text-alfe-choco uppercase tracking-wide">Mensaje enviado</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-alfe-choco-light">
            Gracias por escribirnos. Te contestaremos lo antes posible.
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setSubmitted(false); }}
          className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-alfe-caramel underline underline-offset-4 hover:text-alfe-choco-mid transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-[0.25em] text-alfe-choco-light">
            Nombre *
          </label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="input-alfe"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-[0.25em] text-alfe-choco-light">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="input-alfe"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-[0.25em] text-alfe-choco-light">
          Teléfono
        </label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="6XX XXX XXX"
          className="input-alfe"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-[0.25em] text-alfe-choco-light">
          Asunto *
        </label>
        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="input-alfe"
        >
          <option value="">Selecciona un asunto</option>
          <option value="pedido">Pedido online</option>
          <option value="encargo">Encargo especial / personalizado</option>
          <option value="evento">Eventos y empresa</option>
          <option value="alergenos">Alérgenos e intolerancias</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-[0.25em] text-alfe-choco-light">
          Mensaje *
        </label>
        <textarea
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Cuéntanos qué necesitas..."
          className="input-alfe resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-alfe-primary w-full justify-center py-4 disabled:opacity-60"
      >
        {loading ? (
          "Enviando..."
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            Enviar mensaje
          </>
        )}
      </button>

      <a
        href={alfajorinaLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-green-500/50 text-green-700 text-sm font-bold uppercase tracking-[0.15em] hover:bg-green-50 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Escribir por WhatsApp
      </a>
    </form>
  );
}

export default function AlfajorinaContactoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-alfe-cream">

      {/* ── Header ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden bg-alfe-choco">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
          alt="Contacto Alfajorina"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/95 via-alfe-choco/50 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-10">
          <span className="alfe-label-caramel block mb-3">Hablemos</span>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] text-alfe-cream uppercase tracking-wide leading-none animate-fade-up">
            Contacto
          </h1>
          <p className="text-alfe-cream/50 mt-2 text-sm animate-fade-up-200">
            Encargos especiales · Pedidos · Eventos · Preguntas
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14">

          {/* Left: Contact form */}
          <ScrollReveal>
            <h2 className="font-display text-3xl text-alfe-choco uppercase tracking-wide mb-8">
              Escríbenos
            </h2>
            <ContactForm />
          </ScrollReveal>

          {/* Right: Info */}
          <div className="space-y-8">
            {/* Contact data */}
            <ScrollReveal delay="d1">
              <div className="surface-alfe p-7">
                <h3 className="font-display text-xl text-alfe-choco uppercase tracking-wide mb-6">
                  Información de contacto
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-alfe-caramel/10 border border-alfe-caramel/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-alfe-caramel" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-alfe-choco-light mb-1">Dónde estamos</p>
                      <p className="text-sm text-alfe-choco">{alfajorinaConfig.address}</p>
                      <a
                        href={alfajorinaConfig.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-alfe-caramel hover:text-alfe-choco-mid transition-colors mt-1 inline-block"
                      >
                        Abrir en Google Maps →
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-alfe-rosa/10 border border-alfe-rosa/20 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-alfe-rosa" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-alfe-choco-light mb-1">Teléfono</p>
                      <a href={alfajorinaContact.phoneHref} className="text-sm text-alfe-choco hover:text-alfe-caramel transition-colors font-medium">
                        {alfajorinaContact.phonePretty}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-alfe-verde/10 border border-alfe-verde/20 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-alfe-verde" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-alfe-choco-light mb-1">Email</p>
                      <a href={`mailto:${alfajorinaContact.email}`} className="text-sm text-alfe-choco hover:text-alfe-caramel transition-colors font-medium">
                        {alfajorinaContact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-alfe-caramel/10 border border-alfe-caramel/20 flex items-center justify-center shrink-0">
                      <Instagram className="h-5 w-5 text-alfe-caramel" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-alfe-choco-light mb-1">Instagram</p>
                      <a
                        href={alfajorinaLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-alfe-choco hover:text-alfe-caramel transition-colors font-medium"
                      >
                        @alfajorina
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Hours */}
            <ScrollReveal delay="d2">
              <div className="surface-alfe p-7">
                <h3 className="font-display text-xl text-alfe-choco uppercase tracking-wide mb-5 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-alfe-caramel" />
                  Horarios
                </h3>
                <ul className="space-y-3">
                  {alfajorinaHours.map(({ days, time, closed }) => (
                    <li key={days} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${closed ? "text-alfe-choco-light/40" : "text-alfe-choco"}`}>
                        {days}
                      </span>
                      <span className={closed ? "text-alfe-choco-light/30" : "text-alfe-caramel font-bold"}>
                        {time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Quick links */}
            <ScrollReveal delay="d3">
              <div className="surface-alfe p-7">
                <h3 className="font-display text-xl text-alfe-choco uppercase tracking-wide mb-5">
                  Acceso rápido
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: <Package className="h-4 w-4" />, label: "Pedir online", href: "/alfajorina/pedidos" },
                    { icon: <MessageSquare className="h-4 w-4" />, label: "Carta completa", href: "/alfajorina/menu" },
                    { icon: <MapPin className="h-4 w-4" />, label: "Cómo llegar", href: alfajorinaConfig.googleMapsUrl, external: true },
                  ].map(({ icon, label, href, external }) =>
                    external ? (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-alfe-choco-light hover:text-alfe-caramel transition-colors font-medium"
                      >
                        <span className="text-alfe-caramel">{icon}</span>
                        {label}
                        <ArrowRight className="h-3 w-3 ml-auto" />
                      </a>
                    ) : (
                      <Link
                        key={label}
                        href={href}
                        className="flex items-center gap-3 text-sm text-alfe-choco-light hover:text-alfe-caramel transition-colors font-medium"
                      >
                        <span className="text-alfe-caramel">{icon}</span>
                        {label}
                        <ArrowRight className="h-3 w-3 ml-auto" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ── Map section ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden border border-alfe-border h-64 sm:h-80 bg-alfe-cream-dark flex items-center justify-center">
              <iframe
                src={alfajorinaConfig.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localización Alfajorina Barcelona"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-alfe-cream-dark py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="alfe-label-rosa block mb-4">Preguntas frecuentes</span>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-alfe-choco uppercase tracking-wide leading-none">
              FAQ
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal key={faq.question} delay={i % 3 === 0 ? "d1" : i % 3 === 1 ? "d2" : "d3"}>
                <div className="surface-alfe overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-bold text-sm text-alfe-choco">{faq.question}</span>
                    <span className={`text-alfe-caramel font-bold text-lg transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-alfe-choco-light leading-relaxed border-t border-alfe-border pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
