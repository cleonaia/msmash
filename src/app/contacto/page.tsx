import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";

import { locations, socialLinks } from "@/data/site";

const contactCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp central",
    description: socialLinks.phone,
    action: "Abrir chat",
    href: socialLinks.whatsapp ?? `https://wa.me/${socialLinks.phone.replace(/\s+/g, "")}`,
    external: true,
  },
  {
    icon: Phone,
    title: "Llamanos",
    description: socialLinks.phone,
    action: "Llamar",
    href: `tel:${socialLinks.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: Mail,
    title: "Escribinos",
    description: socialLinks.email,
    action: "Enviar email",
    href: `mailto:${socialLinks.email}`,
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "@quebrachocarnesargentinas",
    action: "Ver perfil",
    href: socialLinks.instagram,
    external: true,
  },
  {
    icon: Facebook,
    title: "Facebook",
    description: "Quebracho Carnes Argentinas",
    action: "Ir a la página",
    href: socialLinks.facebook,
    external: true,
  },
];

export default function ContactoPage() {
  return (
    <div>
      <PageHeader
        title="Contacto"
        subtitle="Consultanos por encargos, envíos a domicilio, menús especiales y disponibilidad en tienda"
        backgroundImage="https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c1536_a/image/upload/v1627589110/business/625bab3a-c2de-4d60-8326-f48ca4bc2720.jpg"
      >
        <Link
          href="https://www.instagram.com/quebrachocarnesargentinas/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-amber-400 hover:text-amber-200"
        >
          <Instagram className="h-4 w-4" />
          Seguinos en Instagram
        </Link>
      </PageHeader>

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(45,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)]" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Estamos para ayudarte</h2>
              <p className="text-sm text-white/70">
                Encargos para tu asado, picadas, catering y opciones especiales. También gestionamos envíos en Barcelona y Baix Llobregat.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {contactCards.map((card) => (
                <div key={card.title} className="surface-card gradient-border rounded-2xl p-6">
                  <card.icon className="h-6 w-6 text-amber-400" />
                  <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{card.description}</p>
                  <Link
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-400"
                  >
                    {card.action}
                    <Send className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Locales Quebracho</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Elegí tu tienda o reservá en el restaurante</h3>
              </div>
              <div className="grid gap-4">
                {locations.map((location) => (
                  <div key={location.id} className="surface-card gradient-border rounded-2xl p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">{location.type}</p>
                        <h4 className="mt-2 text-lg font-semibold text-white">{location.name}</h4>
                      </div>
                      <Link
                        href={location.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-400"
                      >
                        Ver mapa
                        <Send className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-white/70">
                      <p className="flex gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <span>{location.address}</span>
                      </p>
                      <p className="flex gap-2">
                        <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <span>{location.schedule.join(" · ")}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm text-white/70">
                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {location.phones.map((phone) => (
                            <Link key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="transition hover:text-amber-200">
                              {phone}
                            </Link>
                          ))}
                          {location.whatsapp ? (
                            <Link
                              href={`https://wa.me/${location.whatsapp.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="transition hover:text-emerald-200"
                            >
                              WhatsApp {location.whatsapp}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                      <p className="flex gap-2">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <Link href={`mailto:${location.email}`} className="transition hover:text-amber-200">
                          {location.email}
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="surface-card-strong gradient-border rounded-3xl p-8 shadow-[0_25px_120px_-60px_rgba(227,58,32,0.55)]">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
