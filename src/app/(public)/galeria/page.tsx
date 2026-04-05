import Image from "next/image";
import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { socialLinks } from "@/config/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

function Cloud({ className, opacity = 0.55, width = 280 }: { className?: string; opacity?: number; width?: number }) {
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

const galleryItemsRaw = [
  { src: "/images/products/the-m-smash.jpeg", alt: "The M Smash Burger", caption: "The M Smash" },
  { src: "/images/products/burger-the-basic.jpeg", alt: "Burger The Basic", caption: "The Basic Blue" },
  { src: "/images/products/the-crispy.jpeg", alt: "The Crispy", caption: "The Crispy" },
  { src: "/images/products/the-super-crispy.jpeg", alt: "The Super Crispy", caption: "Super Crispy" },
  { src: "/images/products/menu-kids.jpeg", alt: "Menu Kids", caption: "Menu Kids" },
  { src: "/images/products/tequenos.jpeg", alt: "Tequenos", caption: "Tequenos" },
  { src: "/images/products/fries-m.jpeg", alt: "Fries M", caption: "Fries M" },
  { src: "/images/products/crispy-chicken.jpeg", alt: "Crispy Chicken", caption: "Crispy Chicken" },
];

const galleryItems = galleryItemsRaw.filter(
  (item, index, items) => index === items.findIndex((candidate) => candidate.src === item.src)
);

const tiktokReels = [
  { src: "/images/products/the-m-smash.jpeg", title: "The Smash", subtitle: "Plancha en vivo", length: "0:15" },
  { src: "/images/products/the-super-crispy.jpeg", title: "Queso fundido", subtitle: "Costra dorada", length: "0:12" },
  { src: "/images/products/the-crispy.jpeg", title: "La costra dorada", subtitle: "Smash al punto", length: "0:18" },
  { src: "/images/products/crispy-chicken.jpeg", title: "Crispy Chicken", subtitle: "Golden crunch", length: "0:14" },
];

const uniqueTikTokReels = tiktokReels.filter(
  (item, index, items) => index === items.findIndex((candidate) => candidate.src === item.src)
);

export default function GaleriaPage() {
  return (
    <div className="bg-smash-black min-h-screen">

      {/* ── Header con nubes ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden sky-bg">
        <Image
          src="/images/products/the-m-smash.jpeg"
          alt="Galería M SMASH"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        {/* Cloud layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[10%] left-[-2%] animate-cloud-drift-slow" opacity={0.6} width={340} />
          <Cloud className="absolute top-[5%] right-[-3%] animate-cloud-drift" opacity={0.5} width={300} />
          <Cloud className="absolute bottom-[15%] left-[20%] animate-cloud-drift-mid" opacity={0.4} width={260} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-smash-black/90 via-smash-black/40 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <span className="label-sky block mb-3">Visuales</span>
          <h1 className="font-display display-md text-white uppercase tracking-wide leading-none">Galería</h1>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-smash-fire/70 mt-3">
            Burgers, momentos y fuego
          </p>
        </div>
      </div>

      {/* ── Gallery grid (masonry) ── */}
      <section className="bg-smash-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-smash-fire/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-smash-gold/15 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
            {galleryItems.map(({ src, alt, caption }, idx) => (
              <div key={src} className="group relative overflow-hidden rounded-3xl break-inside-avoid transform hover:scale-[1.02] transition-transform duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s both` }}>
                <div className="relative overflow-hidden rounded-3xl border border-smash-border/40 hover:border-smash-fire/50 transition-colors duration-300">
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700 z-20" />
                  
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={600}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-smash-black/80 via-smash-black/30 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-smash-fire/0 via-transparent to-smash-fire/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-display text-lg sm:text-2xl text-white uppercase tracking-[0.2em] sm:tracking-widest">{caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* ── TikTok reels strip ── */}
      <section className="relative bg-smash-dark py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="fire-divider absolute top-0 left-0 right-0" />
        
        {/* Background effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-smash-fire/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-smash-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header section */}
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-2.5 label-fire mb-6 animate-fade-up justify-center">
              <TikTokIcon className="h-4 w-4" />
              @msmashburguer
            </span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white uppercase tracking-widest leading-none mb-6 animate-fade-up-100">
              TikTok & Reels
            </h2>
            <p className="text-smash-cream/50 text-lg leading-relaxed max-w-2xl mx-auto font-light animate-fade-up-200 mb-8">
              Cada aplastada, cada costra, cada bite en slow motion. Síguenos para ver el fuego en vivo.
            </p>
            <a href={socialLinks.tiktok} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 btn-fire-border animate-fade-up-300">
              <TikTokIcon className="h-4 w-4" />
              Ver en TikTok
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Reels grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {uniqueTikTokReels.map((reel, idx) => (
              <a key={reel.title} href={socialLinks.tiktok} target="_blank" rel="noreferrer"
                className="group relative block aspect-[9/16] rounded-3xl overflow-hidden bg-smash-smoke border border-smash-border/40 hover:border-smash-fire/60 transition-all duration-300 transform hover:scale-105 hover:shadow-fire-sm"
                style={{ animation: `fadeInScale 0.6s ease-out ${idx * 0.1}s both` }}>
                <Image src={reel.src} alt={reel.title} fill
                  className="object-cover transition-all duration-700 group-hover:scale-115 group-hover:brightness-125"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                
                {/* Multiple gradient layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-smash-black/95 via-smash-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-smash-fire/0 via-transparent to-smash-fire/30 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                
                {/* Duration badge */}
                <div className="absolute top-4 right-4 rounded-full bg-smash-black/70 backdrop-blur-md border border-smash-border px-3 py-1.5 text-[10px] text-smash-cream/90 font-black tracking-widest group-hover:bg-smash-fire/80 group-hover:border-smash-fire transition-all duration-300">
                  {reel.length}
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-smash-fire/50 to-smash-fire/20 border border-smash-fire/40 flex items-center justify-center">
                      <TikTokIcon className="h-3 w-3 text-smash-fire" />
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-smash-cream/70">@msmash</span>
                  </div>
                  <p className="font-display text-lg text-white leading-none uppercase tracking-wide group-hover:text-fire-glow transition-colors duration-300">{reel.title}</p>
                  <p className="text-xs text-smash-cream/50 group-hover:text-smash-cream/70 transition-colors duration-300">{reel.subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </section>

      {/* ── Instagram CTA ── */}
      <section className="relative bg-smash-black py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[10%] left-[5%]" opacity={1} width={320} />
          <Cloud className="absolute top-[10%] right-[5%]" opacity={1} width={280} />
        </div>
        <div className="relative z-10">
          <span className="label-fire block mb-4">Más fotos</span>
          <h2 className="font-display display-md text-smash-cream uppercase tracking-wide mb-4">
            Síguenos en Instagram
          </h2>
          <p className="text-smash-cream/40 max-w-md mx-auto mb-8 leading-relaxed font-light">
            Subimos contenido cada día. Burgers, detrás de las cámaras, novedades. No te lo pierdas.
          </p>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
            className="btn-smash gap-2 px-8 py-4 text-base inline-flex">
            <Instagram className="h-5 w-5" />
            @msmashburguer
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── Redes oficiales ── */}
      <section className="bg-smash-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="label-sky block mb-3">Canales oficiales</span>
            <h2 className="font-display display-sm text-smash-cream uppercase tracking-wide">Instagram y TikTok</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="surface-smoke group flex items-center justify-between gap-4 p-6 transition-all duration-200 hover:border-smash-turquoise/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-smash-border bg-smash-black/40 text-smash-turquoise">
                  <Instagram className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">Instagram</p>
                  <p className="font-display text-xl uppercase tracking-wide text-smash-cream">@msmashburguer</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-smash-turquoise transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="surface-smoke group flex items-center justify-between gap-4 p-6 transition-all duration-200 hover:border-smash-fire/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-smash-border bg-smash-black/40 text-smash-fire">
                  <TikTokIcon className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-smash-cream/40">TikTok</p>
                  <p className="font-display text-xl uppercase tracking-wide text-smash-cream">@msmashburguer</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-smash-fire transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
