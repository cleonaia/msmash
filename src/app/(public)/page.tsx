import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Flame, ShoppingBag } from "lucide-react";
import { socialLinks, contactInfo, stats } from "@/config/site";
import { featuredItems, categories } from "@/features/menu/data/menu";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

/* ─── Icons ─── */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

/* ─── Cloud SVGs ─── */
function Cloud({ className, opacity = 0.55, width = 320 }: { className?: string; opacity?: number; width?: number }) {
  return (
    <svg width={width} viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <ellipse cx="160" cy="80" rx="148" ry="36" fill="white" />
      <ellipse cx="100" cy="70" rx="76" ry="46" fill="white" />
      <ellipse cx="200" cy="66" rx="72" ry="42" fill="white" />
      <ellipse cx="148" cy="55" rx="60" ry="48" fill="white" />
      <ellipse cx="228" cy="72" rx="52" ry="36" fill="white" />
    </svg>
  );
}
function CloudSm({ className, opacity = 0.4, width = 180 }: { className?: string; opacity?: number; width?: number }) {
  return (
    <svg width={width} viewBox="0 0 180 68" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <ellipse cx="90" cy="46" rx="82" ry="20" fill="white" />
      <ellipse cx="60" cy="38" rx="44" ry="28" fill="white" />
      <ellipse cx="116" cy="36" rx="42" ry="26" fill="white" />
      <ellipse cx="88" cy="28" rx="36" ry="30" fill="white" />
    </svg>
  );
}

/* ─── Marquee item ─── */
const TICKER = ["SMASH", "APLASTADO", "DORADO", "PERFECTO", "TERRASSA", "180°", "CARNE FRESCA", "SIN CONGELADOS"];
function MarqueeItem({ dark = false }: { dark?: boolean }) {
  const items = [...TICKER, ...TICKER]; // doubled for seamless loop
  return (
    <div className="marquee-wrap select-none">
      <div className={`marquee-track${dark ? " marquee-track-slow" : ""}`}>
        {items.map((word, i) => (
          <span key={i} className={`inline-flex items-center gap-5 font-display uppercase tracking-widest whitespace-nowrap px-5 text-[clamp(1rem,2.2vw,1.6rem)]
            ${dark ? "text-smash-cream/15" : "text-white/90"}`}>
            {word}
            <span className={`text-[0.6em] ${dark ? "text-smash-turquoise/25" : "text-smash-turquoise/85"}`}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO — Sky/Cloud + Giant SMASH
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] lg:min-h-[680px] flex items-center justify-center overflow-hidden sky-bg py-24 sm:py-0">

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-smash-black via-smash-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-smash-black/50 via-transparent to-transparent" />

        {/* Cloud layer */}
        <div className="cloud-layer" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[5%] left-[-4%] animate-cloud-drift-slow"  opacity={0.4} width={380} />
          <Cloud className="absolute top-[10%] right-[-3%] animate-cloud-drift"     opacity={0.35} width={420} />
          <Cloud className="absolute top-[22%] left-[22%] animate-cloud-drift-mid"  opacity={0.3} width={280} />
          <Cloud className="absolute top-[30%] right-[10%] animate-cloud-drift"     opacity={0.5} width={340} />
          <CloudSm className="absolute top-[36%] left-[6%] animate-cloud-drift-slow" opacity={0.45} width={200} />
          <Cloud className="absolute bottom-[26%] left-[-6%] animate-cloud-drift-slow" opacity={0.65} width={480} />
          <Cloud className="absolute bottom-[20%] right-[-5%] animate-cloud-drift"    opacity={0.6} width={440} />
          <CloudSm className="absolute bottom-[30%] left-[30%] animate-cloud-drift-mid" opacity={0.55} width={220} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-10 max-w-6xl mx-auto flex flex-col items-center">

          {/* Display headline */}
          <div className="leading-none animate-fade-up">
            <h1 className="font-display display-xl text-white text-fire-glow tracking-widest uppercase block">
              M
            </h1>
            <h1 className="font-display display-xl text-smash-cream tracking-widest uppercase block -mt-4 sm:-mt-8 lg:-mt-14">
              SMASH
            </h1>
          </div>

          {/* Sub */}
          <p className="font-sans text-[11px] sm:text-sm font-extrabold uppercase tracking-[0.6em] text-smash-turquoise/75 animate-fade-up-200 mt-7 mb-2">
            Smash Burger
          </p>
          <p className="font-sans text-[clamp(0.95rem,2.2vw,1.4rem)] text-smash-cream/50 animate-fade-up-400 mb-10 font-light tracking-wide">
            Fuego. Carne. Obsesión.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 xs:gap-4 animate-fade-up-400 w-full xs:w-auto max-w-md xs:max-w-none mx-auto">
            <Link href="/pedidos" className="btn-smash text-xs xs:text-sm px-6 xs:px-10 py-3 xs:py-4 w-full xs:w-auto">
              <ShoppingBag className="h-3.5 xs:h-4 w-3.5 xs:w-4" />
              Pedir ahora
            </Link>
            <Link href="/menu" className="btn-outline text-xs xs:text-sm px-6 xs:px-10 py-3 xs:py-4 w-full xs:w-auto justify-center xs:justify-start">
              Ver la carta
              <ArrowRight className="h-3.5 xs:h-4 w-3.5 xs:w-4" />
            </Link>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap items-center justify-center gap-4 xs:gap-6 mt-8 xs:mt-12 animate-fade-up-600">
            {[
              { href: socialLinks.instagram, icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
              { href: socialLinks.tiktok,    icon: <TikTokIcon className="h-4 w-4" />, label: "TikTok" },
              { href: `https://wa.me/${contactInfo.whatsappNumber}`,
                icon: (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                ),
                label: "WhatsApp" },
            ].map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-smash-cream/35 hover:text-smash-cream transition-colors text-[10px] font-semibold uppercase tracking-[0.4em]">
                {icon}{label}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bob z-10">
          <div className="h-10 w-px bg-gradient-to-b from-smash-turquoise/60 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARQUEE TICKER 1 — Fire strip
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-smash-turquoise py-4 overflow-hidden">
        <MarqueeItem />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          STATS — numbers that pop
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-smash-dark py-12 xs:py-16 px-4 xs:px-6 overflow-hidden">
        <div className="fire-divider absolute top-0 left-0 right-0" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-16 bg-smash-turquoise/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-16 bg-smash-turquoise/6 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 text-center">
          {stats.map(({ value, label }, i) => (
            <ScrollReveal key={label} delay={["d1","d2","d3","d4"][i] as "d1"}>
              <p className="font-display text-3xl xs:text-4xl sm:text-5xl text-smash-cream leading-none tracking-wide mb-1 xs:mb-2">
                {value}
              </p>
              <p className="text-[8px] xs:text-[9px] font-black text-smash-cream/25 uppercase tracking-[0.3em] xs:tracking-[0.45em]">{label}</p>
            </ScrollReveal>
          ))}
        </div>
        <div className="fire-divider absolute bottom-0 left-0 right-0" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MANIFESTO — giant editorial statement
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-smash-black py-20 xs:py-24 sm:py-28 px-4 xs:px-6 overflow-hidden">
        {/* Ghost watermark SMASH behind content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-ghost leading-none" style={{ fontSize: "clamp(6rem, 30vw, 32rem)" }}>
            SMASH
          </span>
        </div>

        {/* Cloud accents */}
        <div className="absolute top-0 left-0 right-0 h-20 xs:h-24 sm:h-28 overflow-hidden opacity-5 pointer-events-none"
          style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute -top-4 xs:-top-6 left-[8%]" opacity={1} width={220} />
          <Cloud className="absolute -top-6 xs:-top-8 right-[6%]" opacity={1} width={260} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-2 xs:px-4">
          <ScrollReveal>
            <span className="label-fire block mb-4 xs:mb-6">Nuestra filosofía</span>
          </ScrollReveal>

          <ScrollReveal delay="d1" className="overflow-hidden">
            <h2 className="font-display display-lg text-smash-cream uppercase leading-none tracking-wide">
              No hay
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="d2" className="overflow-hidden">
            <h2 className="font-display display-lg text-smash-cream uppercase leading-none tracking-wide">
              atajos.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="d3" className="overflow-hidden mt-1 xs:mt-2">
            <h2 className="font-display display-lg uppercase leading-none tracking-wide text-gold-shimmer">
              Solo fuego
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="d4" className="overflow-hidden">
            <h2 className="font-display display-lg text-smash-cream uppercase leading-none tracking-wide">
              y carne.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay="d5">
            <p className="max-w-2xl mx-auto text-smash-cream/40 text-sm xs:text-base sm:text-lg leading-relaxed font-light mt-6 xs:mt-8 sm:mt-10">
              COGEMOS LA MEJOR CARNE. LA APLASTAMOS CONTRA LA PLANCHA A 180 GRADOS.
              LA DEJAMOS QUE FORME ESA COSTRA DORADA QUE LO CAMBIA TODO.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED BURGERS — horizontal scroll cards
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-smash-dark py-16 xs:py-20 overflow-hidden">
        {/* Header */}
        <div className="px-4 xs:px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto mb-8 xs:mb-10">
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 xs:gap-5">
            <div>
              <span className="label-fire block mb-3 xs:mb-4">Las burgers</span>
              <h2 className="font-display display-md text-smash-cream uppercase tracking-wide">
                Las imprescindibles
              </h2>
            </div>
            <Link href="/menu"
              className="inline-flex items-center gap-2 text-smash-turquoise text-[11px] xs:text-sm font-black uppercase tracking-[0.25em] xs:tracking-[0.3em] hover:gap-4 transition-all whitespace-nowrap">
              Ver toda la carta <ArrowRight className="h-3 xs:h-4 w-3 xs:w-4" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Horizontal scroll track */}
        <div className="flex justify-center">
          <div className="overflow-x-auto scroll-smooth pb-4 px-4 xs:px-6 sm:px-10 lg:px-16"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            <div className="flex gap-4 xs:gap-5 w-max">
              {featuredItems.map((item) => {
                const categoryLabel = categories.find((category) => category.id === item.category)?.label || item.category;
                const badgeType = item.badge === "Premium" ? "gold" : item.badge === "Favorito" ? "fire" : "sky";
                return (
                <div key={item.id}
                  className="group relative flex-none w-64 xs:w-72 sm:w-80 rounded-xl xs:rounded-2xl overflow-hidden
                  border border-smash-border hover:border-smash-turquoise/40 bg-smash-smoke
                  transition-all duration-300 hover:shadow-card-hover card-lift"
                  style={{ scrollSnapAlign: "start" }}>
                  <div className="relative h-44 xs:h-48 sm:h-52 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                      sizes="320px"
                      style={{ objectPosition: item.id === "the-basic" ? "center 75%" : "center center" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-smash-dark/80 via-transparent to-transparent" />
                    <div className="absolute top-2 xs:top-3 left-2 xs:left-3">
                      {badgeType === "fire" && <span className="tag-fire text-[10px] xs:text-[11px]">{item.badge || "Imprescindible"}</span>}
                      {badgeType === "gold" && <span className="tag-gold text-[10px] xs:text-[11px]">{item.badge || "Imprescindible"}</span>}
                      {badgeType === "sky"  && <span className="tag-sky text-[10px] xs:text-[11px]">{item.badge || "Imprescindible"}</span>}
                    </div>
                  </div>
                  <div className="p-4 xs:p-5">
                    <div className="flex items-start justify-between gap-2 mb-1 xs:mb-2">
                      <h3 className="font-display text-lg xs:text-xl sm:text-2xl text-smash-cream leading-none uppercase tracking-wide">{item.name}</h3>
                      <span className="font-display text-base xs:text-lg sm:text-xl text-smash-turquoise leading-none shrink-0">{item.price.toFixed(2)}€</span>
                    </div>
                    <p className="text-[10px] xs:text-[11px] uppercase tracking-[0.25em] text-smash-turquoise/75 mb-2">{categoryLabel}</p>
                    <p className="text-[12px] xs:text-sm text-smash-cream/40 leading-relaxed">{item.description}</p>
                    <Link href="/pedidos"
                      className="mt-3 xs:mt-4 inline-flex items-center gap-2 text-[9px] xs:text-[10px] font-black uppercase tracking-[0.25em] xs:tracking-[0.3em] text-smash-turquoise hover:gap-3 transition-all duration-200">
                      Pedir <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PEDIDOS CTA — fire gradient banner
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 xs:px-6">
        {/* Turquoise and Purple gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-smash-turquoise via-smash-turquoise/80 to-smash-dark" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E\")"
        }} />
        {/* Ghost watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-ghost leading-none text-white/10" style={{ fontSize: "clamp(6rem, 28vw, 22rem)", WebkitTextStroke: "2px rgba(255,255,255,0.12)" }}>
            PIDE
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-1 sm:px-0">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.55em] text-smash-cream/70 border border-smash-cream/30 px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm">
              <ShoppingBag className="h-3.5 w-3.5" />
              Nuevo sistema de pedidos
            </span>
          </ScrollReveal>
          <ScrollReveal>
            <h2 className="font-display display-lg text-white uppercase leading-none tracking-wide mb-5 sm:mb-6">
              Pide desde aquí.
              <br />Sin esperas.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="d2">
            <p className="text-smash-cream/80 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
              Selecciona tus burgers, personaliza tu pedido y recíbelo en el local o pásate a recogerlo.
              Directo por WhatsApp, sin complicaciones.
            </p>
          </ScrollReveal>
          <ScrollReveal delay="d3">
            <Link href="/pedidos"
              className="inline-flex items-center gap-3 bg-smash-black border border-smash-turquoise/45 text-smash-cream text-sm font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-smash-dark transition-colors shadow-2xl">
              <ShoppingBag className="h-5 w-5" />
              Hacer mi pedido
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARQUEE 2 — dark strip
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-smash-dark border-y border-smash-border py-5 overflow-hidden">
        <MarqueeItem dark />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LOCATION — sky/cloud strip
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 sky-bg opacity-90" />
        <div className="absolute inset-0 bg-smash-black/68" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[5%] left-[-5%] animate-cloud-drift" opacity={0.8} width={360} />
          <Cloud className="absolute top-[8%] right-[-4%] animate-cloud-drift-slow" opacity={0.7} width={320} />
          <CloudSm className="absolute top-[32%] left-[28%] animate-cloud-drift-mid" opacity={0.6} width={200} />
          <Cloud className="absolute bottom-[5%] left-[12%] animate-cloud-drift-slow" opacity={0.75} width={400} />
          <CloudSm className="absolute bottom-[8%] right-[8%] animate-cloud-drift" opacity={0.65} width={240} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10 px-2 sm:px-0">
          <ScrollReveal><span className="label-sky block mb-6">Encuéntranos</span></ScrollReveal>
          <ScrollReveal delay="d1">
            <h2 className="font-display display-md text-smash-cream uppercase tracking-wide mb-6">
              Estamos en<br />
              Carrer de Colegi, 5
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="d3">
            <Link href="/contacto" className="btn-smash">
              Ver en el mapa <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
