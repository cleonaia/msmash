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

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
    alt: "Focaccia margherita amb alfàbrega fresca",
    caption: "Margherita clàssica",
    wide: true,
  },
  {
    src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    alt: "Focaccia al romero sortint del forn",
    caption: "Al romero",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    alt: "Pinsa burrata i tomàquet cherry",
    caption: "Pinsa Burrata",
  },
  {
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    alt: "Focaccia quatre formatges sortint del forn",
    caption: "Quattro formaggi",
    wide: true,
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    alt: "Plat del dia a taula",
    caption: "Plat del dia",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: "Interior càlid del local",
    caption: "El nostre local",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    alt: "Massa fermentant al taulell",
    caption: "La nostra massa mare",
  },
  {
    src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80",
    alt: "Taula amb productes de temporada",
    caption: "De mercat i de temporada",
    wide: true,
  },
  {
    src: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80",
    alt: "Tiramisú de la casa",
    caption: "Tiramisú artesà",
  },
];

const tiktokReels = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80",
    title: "Fermentació en 15 segons",
    subtitle: "Massa mare · 48h",
    length: "0:15",
  },
  {
    src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80",
    title: "Inside el forn",
    subtitle: "Ritme de cuina",
    length: "0:21",
  },
  {
    src: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=900&q=80",
    title: "Focaccia crush",
    subtitle: "Tall i textura",
    length: "0:12",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
    title: "Pinsa mood",
    subtitle: "Burrata edition",
    length: "0:18",
  },
];

export default function GaleriaPage() {
  return (
    <div>
      {/* ── Header ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1920&q=80"
          alt="Galeria de Virutes"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/80 via-virutes-brown/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h1 className="font-display text-6xl sm:text-7xl text-white">Galeria</h1>
          <p className="font-serif italic text-white/75 text-lg mt-2">
            Moments, productes i el local de Virutes
          </p>
        </div>
      </div>

      {/* ── Gallery grid ── */}
      <section className="surface-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryItems.map(({ src, alt, caption, wide }) => (
              <div
                key={src}
                className={`group relative overflow-hidden rounded-2xl ${wide ? "sm:col-span-2" : ""} break-inside-avoid`}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={wide ? 500 : 600}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium">{caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TikTok reels strip ── */}
      <section className="bg-virutes-brown py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.36em] text-white/50">
                <TikTokIcon className="h-3.5 w-3.5" />
                Reels en vertical
              </span>
              <h2 className="font-display text-5xl sm:text-6xl text-white mt-3">TikTok vibes</h2>
              <p className="text-white/60 text-base mt-3 max-w-xl leading-relaxed">
                Una selecció visual amb format reel: curt, intens i amb la textura real de Virutes.
              </p>
            </div>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <TikTokIcon className="h-4 w-4" />
              Veure TikTok
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiktokReels.map((reel) => (
              <a
                key={reel.title}
                href={socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[9/16] rounded-2xl overflow-hidden bg-black"
              >
                <Image
                  src={reel.src}
                  alt={reel.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute top-3 right-3 rounded-full bg-black/45 border border-white/15 px-2.5 py-1 text-[11px] text-white/90">
                  {reel.length}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white">
                      <TikTokIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">@virutes.sbd</span>
                  </div>
                  <p className="font-semibold text-white leading-tight">{reel.title}</p>
                  <p className="text-xs text-white/70 mt-1">{reel.subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram CTA ── */}
      <section className="surface-cream py-20 px-4 text-center">
        <span className="section-label block mb-3">Més fotos</span>
        <h2 className="section-title mb-4">Segueix-nos a Instagram</h2>
        <p className="text-virutes-brown/65 max-w-md mx-auto mb-8">
          Cada dia pugem novetats, receptes i el darrere de les càmeres de Virutes. No te&apos;l perdis.
        </p>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noreferrer"
          className="btn-primary gap-2 px-8 py-4 text-base inline-flex"
        >
          <Instagram className="h-5 w-5" />
          @virutes.sbd
          <ArrowRight className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}
