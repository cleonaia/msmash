import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Instagram,
} from "lucide-react";
import { siteConfig, socialLinks, contactInfo, hours } from "@/config/site";

// ─── TikTok brand icon ────────────────────────────────────────────────────────
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-screen centrat, estil editorial
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1920&q=90"
          alt="Focaccia artesanal de Virutes"
          fill
          className="object-cover object-center scale-[1.03]"
          priority
          sizes="100vw"
        />

        {/* Layered overlays: dark film + cream gradient from bottom */}
        <div className="absolute inset-0 bg-virutes-brown/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-virutes-brown/20 to-transparent" />

        {/* Center content */}
        <div className="relative z-10 text-center px-6 sm:px-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.5em] text-white/60 bg-white/8 backdrop-blur-sm border border-white/15 px-5 py-2.5 rounded-full mb-8 animate-fade-in">
            <span className="h-1 w-1 rounded-full bg-virutes-red block" />
            Focacceria Artesanal · Sabadell
            <span className="h-1 w-1 rounded-full bg-virutes-red block" />
          </span>

          {/* Display title */}
          <h1 className="font-display text-[clamp(5.5rem,16vw,10rem)] text-white leading-none tracking-tight animate-fade-up drop-shadow-2xl">
            Virutes
          </h1>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-5 my-6 animate-fade-up-200">
            <span className="h-px w-20 bg-virutes-red/60" />
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-virutes-red fill-virutes-red" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="h-px w-20 bg-virutes-red/60" />
          </div>

          {/* Slogan */}
          <p className="font-serif italic text-[clamp(1.3rem,3.5vw,2rem)] text-white/90 leading-snug animate-fade-up-200 mb-2">
            Massa, temps i ànima.
          </p>
          <p className="text-sm text-white/45 animate-fade-up-400 tracking-[0.2em] mb-12">
            La focacceria artesanal de Sabadell
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-400">
            <Link href="/reservas" className="btn-primary px-9 py-4 text-sm shadow-2xl shadow-virutes-red/40">
              <Calendar className="h-4 w-4" />
              Reserva ara
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-9 py-4 border border-white/35 text-white text-sm font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-200 shadow-lg"
            >
              Veure la carta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Social quick links */}
          <div className="flex items-center gap-6 mt-12 animate-fade-up-600">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors duration-200 text-xs font-medium tracking-widest uppercase">
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a href={socialLinks.tiktok} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors duration-200 text-xs font-medium tracking-widest uppercase">
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a href={`https://wa.me/${contactInfo.whatsappNumber}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors duration-200 text-xs font-medium tracking-widest uppercase">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bob">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/30">Descobreix</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-virutes-brown py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "48h", label: "Fermentació" },
            { value: "100%", label: "Massa mare" },
            { value: "Km 0", label: "Ingredients locals" },
            { value: "Des de 2022", label: "A Sabadell" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="font-display text-2xl text-virutes-cream leading-none">{value}</p>
              <p className="text-[9px] font-bold text-virutes-cream/35 uppercase tracking-[0.35em]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ENTRY CARDS — accés directe a cada secció
      ══════════════════════════════════════════════════════════════ */}
      <section className="surface-cream py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Virutes</span>
            <h2 className="section-title mt-3">On vols anar?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "La Carta",
                subtitle: "Focaccies · Pinses · Plats del dia",
                image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=700&q=85",
                href: "/menu",
                cta: "Veure la carta",
              },
              {
                title: "Qui Som",
                subtitle: "La nostra història i el nostre equip",
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=85",
                href: "/qui-som",
                cta: "Conèixer-nos",
              },
              {
                title: "Galeria",
                subtitle: "Moments i creacions de Virutes",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85",
                href: "/galeria",
                cta: "Veure galeria",
              },
              {
                title: "Reserves",
                subtitle: "Taula · Click & Collect",
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85",
                href: "/reservas",
                cta: "Reservar ara",
                accent: true,
              },
              {
                title: "Novetats",
                subtitle: "Articles, receptes i noticies",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85",
                href: "/blog",
                cta: "Llegir novetats",
              },
              {
                title: "Contacte",
                subtitle: "Escriu-nos · Vine a veure'ns",
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85",
                href: "/contacto",
                cta: "Contactar",
              },
            ].map(({ title, subtitle, image, href, cta, accent }) => (
              <Link
                key={title}
                href={href}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {/* Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${accent ? "from-virutes-red/90 via-virutes-red/30" : "from-virutes-brown/80 via-virutes-brown/20"} to-transparent`} />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-white leading-none mb-1">{title}</h3>
                  <p className="text-xs text-white/60 mb-4">{subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-white group-hover:gap-3 transition-all duration-200">
                    {cta} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
