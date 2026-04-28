import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Star, Heart, Package } from "lucide-react";
import { alfajorinaLinks, alfajorinaStats, alfajorinaValues, alfajorinaConfig, alfajorinaTestimonials } from "@/config/alfajorina";
import { alfajorinaFeaturedProducts } from "@/features/alfajorina/data/menu";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

/* ── Icons ── */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

/* ── Decorative dot cluster ── */
function DotCluster({ className }: { className?: string }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className={className} aria-hidden="true">
      {[...Array(36)].map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <circle
            key={i}
            cx={col * 22 + 4}
            cy={row * 22 + 4}
            r="2.5"
            fill="currentColor"
            opacity={0.2 + (i % 3) * 0.12}
          />
        );
      })}
    </svg>
  );
}

/* ── Ticker / Marquee ── */
const TICKER = ["ARTESANAL", "DULCE DE LECHE", "HECHO A MANO", "BARCELONA", "CHOCOLATE BELGA", "SIN CONSERVANTES", "CON AMOR", "DESDE 2020"];

function MarqueeStrip({ reverse = false, dark = false }: { reverse?: boolean; dark?: boolean }) {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="marquee-wrap select-none">
      <div
        className={`marquee-track ${reverse ? "marquee-track-rev" : ""} ${dark ? "marquee-track-slow" : ""}`}
      >
        {items.map((word, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-5 font-display uppercase tracking-widest whitespace-nowrap px-5 text-[clamp(0.9rem,1.8vw,1.4rem)]
              ${dark
                ? "text-alfe-choco/20"
                : "text-alfe-caramel/80"}`}
          >
            {word}
            <span className={`text-[0.6em] ${dark ? "text-alfe-choco/15" : "text-alfe-rosa/60"}`}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AlfajorinaHomePage() {
  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO — Editorial full screen
      ══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=90"
          alt="Alfajores artesanales Alfajorina"
          fill
          className="object-cover object-center scale-[1.03]"
          priority
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-alfe-choco/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/90 via-transparent to-alfe-choco/30" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 sm:px-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.5em] text-white/60 bg-white/8 backdrop-blur-sm border border-white/15 px-5 py-2.5 rounded-full mb-8 animate-fade-in">
            <span className="h-1 w-1 rounded-full bg-alfe-caramel block" />
            Alfajores Artesanales · Barcelona
            <span className="h-1 w-1 rounded-full bg-alfe-caramel block" />
          </span>

          {/* Display title */}
          <h1 className="font-display text-[clamp(5rem,15vw,10rem)] text-alfe-cream leading-none tracking-tight animate-fade-up drop-shadow-2xl">
            Alfajorina
          </h1>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-5 my-6 animate-fade-up-200">
            <span className="h-px w-20 bg-alfe-caramel/60" />
            <Heart className="h-4 w-4 text-alfe-caramel fill-alfe-caramel" aria-hidden="true" />
            <span className="h-px w-20 bg-alfe-caramel/60" />
          </div>

          {/* Slogan */}
          <p className="font-display text-[clamp(1.2rem,3.2vw,2rem)] text-white/90 leading-snug animate-fade-up-200 mb-2 uppercase tracking-widest">
            Dulzura hecha a mano.
          </p>
          <p className="text-sm text-white/45 animate-fade-up-400 tracking-[0.2em] mb-12">
            {alfajorinaConfig.sloganSub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-400">
            <Link href="/alfajorina/pedidos" className="btn-alfe-primary px-9 py-4 text-sm shadow-2xl shadow-alfe-caramel/30">
              <Package className="h-4 w-4" />
              Pedir ahora
            </Link>
            <Link
              href="/alfajorina/menu"
              className="inline-flex items-center gap-2 px-9 py-4 border border-white/35 text-white text-sm font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              Ver la carta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-6 mt-12 animate-fade-up-600">
            <a
              href={alfajorinaLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase"
            >
              <Instagram className="h-4 w-4" />
              @alfajorina
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a
              href={alfajorinaLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a
              href={alfajorinaLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/45 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bob">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/30">Descubre</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="py-5 bg-alfe-cream-dark overflow-hidden border-y border-alfe-border">
        <MarqueeStrip />
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-alfe-choco py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {alfajorinaStats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="font-display text-2xl text-alfe-cream leading-none">{value}</p>
              <p className="text-[9px] font-bold text-alfe-cream/35 uppercase tracking-[0.35em]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-alfe-cream py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-caramel block mb-3">Nuestras estrellas</span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Los Favoritos
            </h2>
            <p className="text-alfe-choco-light mt-4 text-base max-w-lg mx-auto">
              Elaborados a mano cada mañana. Sin conservantes. Con todo el cariño del mundo.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alfajorinaFeaturedProducts.map((product, i) => (
              <ScrollReveal
                key={product.id}
                delay={i === 0 ? "d1" : i === 1 ? "d2" : "d3"}
              >
                <Link
                  href="/alfajorina/menu"
                  className="card-alfe group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 tag-alfe">
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-xl text-alfe-choco leading-none uppercase tracking-wide">
                        {product.name}
                      </h3>
                      <span className="font-display text-xl text-alfe-caramel leading-none whitespace-nowrap">
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                    <p className="text-sm text-alfe-choco-light leading-relaxed">
                      {product.description}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-alfe-caramel group-hover:gap-3 transition-all duration-200">
                      Ver detalle <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/alfajorina/menu" className="btn-alfe-outline px-10 py-4">
              Ver toda la carta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE (reverse, subtle)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-5 bg-alfe-cream-dark overflow-hidden border-y border-alfe-border">
        <MarqueeStrip reverse dark />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION CARDS — Navigation shortcuts
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-alfe-cream-dark py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-choco block mb-3">Alfajorina</span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              ¿A dónde quieres ir?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "La Carta",
                subtitle: "Clásicos · Especiales · Cajas regalo",
                image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=85",
                href: "/alfajorina/menu",
                cta: "Ver la carta",
              },
              {
                title: "Pedidos",
                subtitle: "Online · Recogida · Envío",
                image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=700&q=85",
                href: "/alfajorina/pedidos",
                cta: "Pedir ahora",
                accent: true,
              },
              {
                title: "Nosotros",
                subtitle: "Nuestra historia y nuestros valores",
                image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=700&q=85",
                href: "/alfajorina/nosotros",
                cta: "Conocernos",
              },
              {
                title: "Galería",
                subtitle: "Momentos y creaciones",
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85",
                href: "/alfajorina/galeria",
                cta: "Ver galería",
              },
              {
                title: "Cajas Regalo",
                subtitle: "Para regalar con mucho amor",
                image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=700&q=85",
                href: "/alfajorina/menu",
                cta: "Ver cajas",
              },
              {
                title: "Contacto",
                subtitle: "Encargos · Eventos · Preguntas",
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85",
                href: "/alfajorina/contacto",
                cta: "Escribirnos",
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
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    accent
                      ? "from-alfe-caramel/90 via-alfe-caramel/30"
                      : "from-alfe-choco/80 via-alfe-choco/20"
                  } to-transparent`}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-white leading-none mb-1 uppercase tracking-wide">
                    {title}
                  </h3>
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

      {/* ══════════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-alfe-cream py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-rosa block mb-3">Por qué Alfajorina</span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Hechos con alma
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alfajorinaValues.map(({ title, description }, i) => {
              const icons = [
                <Heart key="heart" className="h-6 w-6 text-alfe-rosa" />,
                <Star key="star" className="h-6 w-6 text-alfe-caramel" />,
                <Package key="package" className="h-6 w-6 text-alfe-verde" />,
              ];
              const borderColors = [
                "border-alfe-rosa/20 bg-alfe-rosa/5",
                "border-alfe-caramel/20 bg-alfe-caramel/5",
                "border-alfe-verde/20 bg-alfe-verde/5",
              ];
              return (
                <ScrollReveal key={title} delay={i === 0 ? "d1" : i === 1 ? "d2" : "d3"}>
                  <div className="surface-alfe p-8">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${borderColors[i]}`}>
                      {icons[i]}
                    </div>
                    <h3 className="font-display text-2xl text-alfe-choco uppercase tracking-wide mb-3">{title}</h3>
                    <p className="text-alfe-choco-light leading-relaxed text-sm">{description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          QUOTE / PULL
      ══════════════════════════════════════════════════════════ */}
      <section className="relative h-56 sm:h-72 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1563897539633-7374c276c212?w=1800&q=80"
          alt="Dulce de leche artesanal"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-alfe-choco/70" />
        <ScrollReveal className="relative z-10 text-center px-6 max-w-3xl">
          <p className="font-display text-[clamp(1.4rem,4vw,2.8rem)] text-alfe-cream uppercase tracking-wide leading-tight text-caramel-glow">
            &ldquo;El dulce de leche no se improvisa. Se cocina lento, con paciencia y con amor.&rdquo;
          </p>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-alfe-cream-dark py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-caramel block mb-3">Lo que dicen</span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Ellos ya los probaron
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alfajorinaTestimonials.map(({ name, text, stars }, i) => (
              <ScrollReveal key={name} delay={i === 0 ? "d1" : i === 1 ? "d2" : "d3"}>
                <div className="surface-alfe p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(stars)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-alfe-caramel text-alfe-caramel" />
                    ))}
                  </div>
                  <p className="text-alfe-choco-light text-sm leading-relaxed mb-4 italic">&ldquo;{text}&rdquo;</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-alfe-caramel">{name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-alfe-choco" />
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <DotCluster className="absolute top-8 left-8 text-alfe-cream" />
          <DotCluster className="absolute bottom-8 right-8 text-alfe-caramel" />
          <DotCluster className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-alfe-dulce" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <ScrollReveal>
            <span className="alfe-label-caramel block mb-5">¿A qué esperas?</span>
            <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-alfe-cream uppercase tracking-wide leading-none mb-6">
              Pruébalos hoy
            </h2>
            <p className="text-alfe-cream/50 text-lg mb-10 font-light max-w-xl mx-auto">
              La mejor manera de entender Alfajorina es mordiéndolos. Pedido online o visítanos en Barcelona.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/alfajorina/pedidos" className="btn-alfe-primary px-10 py-4 text-base shadow-2xl shadow-alfe-caramel/20">
                <Package className="h-5 w-5" />
                Pedir ahora
              </Link>
              <Link
                href="/alfajorina/contacto"
                className="inline-flex items-center gap-2 px-10 py-4 border border-alfe-cream/30 text-alfe-cream text-sm font-semibold rounded-full hover:bg-alfe-cream/10 transition-all duration-200"
              >
                Encargo especial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
