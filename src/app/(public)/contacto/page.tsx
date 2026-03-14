"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { contactInfo, hours, siteConfig } from "@/config/site";

const contactReasons = [
  {
    icon: CalendarDays,
    title: "Reserves i grups",
    description: "Gestionem taules, grups petits i consultes per celebracions amb resposta clara i ràpida.",
  },
  {
    icon: MessageSquare,
    title: "Encàrrecs especials",
    description: "Si necessites una proposta concreta, producte per emportar o vols adaptar una comanda, t'ho preparem.",
  },
  {
    icon: Shield,
    title: "Al·lèrgies i dubtes",
    description: "Ens pots escriure per ingredients, intoleràncies o qualsevol detall abans de venir al local.",
  },
];

const faqs = [
  {
    question: "Quant trigueu a respondre?",
    answer: "Normalment responem en menys de 24 hores. Si és una reserva urgent, et recomanem trucar-nos directament.",
  },
  {
    question: "Puc escriure per un encàrrec especial?",
    answer: "Sí. Pots utilitzar aquest formulari per encàrrecs, grups, esdeveniments petits o necessitats concretes de carta.",
  },
  {
    question: "També puc gestionar una reserva des d'aquí?",
    answer: "Sí, però si ja saps dia i hora et recomanem anar directament a la pàgina de reserves per fer-ho més ràpid.",
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-virutes-border bg-virutes-cream/40 px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-virutes-olive/15">
          <CheckCircle className="h-8 w-8 text-virutes-olive" />
        </div>
        <div>
          <h3 className="font-display text-4xl text-virutes-brown">Missatge enviat</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-virutes-brown/65">
            Gràcies per escriure'ns. Et contestarem tan aviat com puguem per correu o telèfon.
          </p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setSubmitted(false);
          }}
          className="mt-2 text-xs font-bold uppercase tracking-[0.28em] text-virutes-red underline underline-offset-4"
        >
          Enviar un altre missatge
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-virutes-border bg-white px-4 py-3.5 text-sm text-virutes-brown placeholder:text-virutes-brown/35 focus:outline-none focus:border-virutes-red focus:ring-2 focus:ring-virutes-red/15 transition-all duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-virutes-brown/55">
            Nom *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="El teu nom"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-virutes-brown/55">
            Telèfon
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+34 690 000 000"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-virutes-brown/55">
          Correu electrònic *
        </label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="tu@exemple.com"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-virutes-brown/55">
          Tema
        </label>
        <select name="subject" value={form.subject} onChange={handleChange} className={inputCls}>
          <option value="">Tria un tema</option>
          <option value="reserves">Reserves</option>
          <option value="grups">Grups i celebracions</option>
          <option value="encarrecs">Encàrrecs especials</option>
          <option value="allergens">Al·lèrgies i dietes</option>
          <option value="altres">Altres</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-virutes-brown/55">
          Missatge *
        </label>
        <textarea
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Explica'ns què necessites i et respondrem amb una proposta clara."
          className={inputCls + " resize-none"}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-virutes-brown/45">
          Si la consulta és urgent, millor trucar-nos directament al {contactInfo.phonePretty}.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 sm:min-w-[220px]"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {loading ? "Enviant..." : "Enviar missatge"}
        </button>
      </div>
    </form>
  );
}

export default function ContactoPage() {
  return (
    <div>
      <PageHeader
        title="Contacte"
        subtitle="Escriu-nos, truca'ns o vine a veure'ns al centre de Sabadell"
        backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80"
      />

      <section className="surface-light px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-center">Atenció personal</p>
          <h2 className="section-title mt-2 text-center">Com et podem ajudar?</h2>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {contactReasons.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[28px] border border-virutes-border bg-white p-7 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-virutes-red/10 text-virutes-red">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-virutes-brown">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-virutes-brown/65">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-virutes-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[32px] border border-virutes-border bg-white p-8 shadow-sm sm:p-10">
              <p className="section-label">Formulari directe</p>
              <h2 className="mt-2 font-display text-5xl leading-none text-virutes-brown sm:text-6xl">
                Envia'ns un missatge
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-virutes-brown/60">
                Per reserves, encàrrecs especials, grups o qualsevol dubte. T'ho posem fàcil i clar.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[28px] border border-virutes-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-virutes-red" />
                  <h3 className="text-lg font-semibold text-virutes-brown">Horaris</h3>
                </div>
                <ul className="space-y-2.5">
                  {hours.map((entry) => (
                    <li key={entry.days} className="flex items-start justify-between gap-4 text-sm">
                      <span className={`font-medium ${entry.closed ? "text-virutes-brown/45" : "text-virutes-brown/70"}`}>
                        {entry.days}
                      </span>
                      <span className={`text-right ${entry.closed ? "text-virutes-red/70" : "font-semibold text-virutes-brown"}`}>
                        {entry.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[28px] border border-virutes-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-virutes-red" />
                  <h3 className="text-lg font-semibold text-virutes-brown">Truca o escriu-nos</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <a href={contactInfo.phoneHref} className="flex items-center justify-between rounded-2xl bg-virutes-cream px-4 py-3 transition-colors hover:bg-virutes-cream-light">
                    <span className="text-virutes-brown/55">Telèfon</span>
                    <span className="font-semibold text-virutes-brown">{contactInfo.phonePretty}</span>
                  </a>
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center justify-between rounded-2xl bg-virutes-cream px-4 py-3 transition-colors hover:bg-virutes-cream-light">
                    <span className="flex items-center gap-2 text-virutes-brown/55">
                      <Mail className="h-4 w-4 text-virutes-red" /> Correu
                    </span>
                    <span className="font-semibold text-virutes-brown">{contactInfo.email}</span>
                  </a>
                </div>
              </div>

              <div className="rounded-[28px] border border-virutes-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-virutes-red" />
                  <h3 className="text-lg font-semibold text-virutes-brown">On som</h3>
                </div>
                <p className="text-sm leading-relaxed text-virutes-brown/65">{siteConfig.address}</p>
                <Link
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em] text-virutes-red hover:gap-2 transition-all duration-150"
                >
                  Obrir Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-[28px] bg-virutes-brown p-6 text-white shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/45">Reserva directa</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">Ja tens clar quan vols venir?</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Si el que necessites és reservar taula o gestionar una recollida, és millor anar directament al formulari de reserves.
                </p>
                <Link href="/reservas" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-virutes-brown transition-colors hover:bg-virutes-cream">
                  Anar a reserves <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="surface-light px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="section-label">Abans d'escriure</p>
            <h2 className="section-title mt-2">Preguntes freqüents</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[28px] border border-virutes-border bg-white p-7 shadow-sm">
                <h3 className="text-lg font-semibold text-virutes-brown">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-virutes-brown/65">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <iframe
          src={siteConfig.googleMapsEmbed}
          width="100%"
          height="420"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localització Virutes Sabadell"
        />
      </section>
    </div>
  );
}
