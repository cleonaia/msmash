import Image from "next/image";
import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { alfajorinaLinks } from "@/config/alfajorina";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=85",
    alt: "Alfajores clásicos",
    caption: "Alfajor Clásico",
    size: "large",
  },
  {
    src: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&q=85",
    alt: "Alfajor de chocolate negro",
    caption: "Chocolate Negro 70%",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1563897539633-7374c276c212?w=700&q=85",
    alt: "Dulce de leche casero",
    caption: "Dulce de Leche Casero",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85",
    alt: "Alfajores especiales",
    caption: "Alfajor Trío",
    size: "large",
  },
  {
    src: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=700&q=85",
    alt: "Alfajor de coco",
    caption: "Alfajor de Coco",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=700&q=85",
    alt: "Caja de alfajores regalo",
    caption: "Caja Regalo · 12 piezas",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=700&q=85",
    alt: "Caja de celebración",
    caption: "Caja Celebración",
    size: "large",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85",
    alt: "Alfajor de frambuesa",
    caption: "Frambuesa & Chocolate",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=85",
    alt: "Alfajor de pistacho",
    caption: "Pistacho Premium",
    size: "small",
  },
];

const instagramPosts = [
  {
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    likes: "1.2k",
    caption: "El clásico nunca falla 🍫",
  },
  {
    src: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    likes: "987",
    caption: "Para los amantes del chocolate negro 🖤",
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    likes: "2.1k",
    caption: "El Trío: tres capas, doble felicidad ✨",
  },
  {
    src: "https://images.unsplash.com/photo-1563897539633-7374c276c212?w=400&q=80",
    likes: "1.5k",
    caption: "Dulce de leche casero. Cada vez. Sin excepción 🥛",
  },
  {
    src: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&q=80",
    likes: "876",
    caption: "El coco le da ese toque especial 🥥",
  },
  {
    src: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
    likes: "3.2k",
    caption: "La caja perfecta para regalar 🎁",
  },
];

export default function AlfajorinaGaleriaPage() {
  return (
    <div className="min-h-screen bg-alfe-cream">

      {/* ── Header ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden bg-alfe-choco">
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80"
          alt="Galería Alfajorina"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/95 via-alfe-choco/50 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-10">
          <span className="alfe-label-caramel block mb-3">Imágenes</span>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] text-alfe-cream uppercase tracking-wide leading-none animate-fade-up">
            Galería
          </h1>
          <p className="text-alfe-cream/50 mt-2 text-sm animate-fade-up-200">
            Cada foto cuenta una historia dulce
          </p>
        </div>
      </div>

      {/* ── Masonry grid ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-10">
            <span className="alfe-label-choco block mb-3" style={{ color: "#C8833B" }}>Nuestras creaciones</span>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Artesanía visual
            </h2>
          </ScrollReveal>

          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryItems.map((item, i) => (
              <ScrollReveal
                key={item.src}
                delay={i % 4 === 0 ? "d1" : i % 4 === 1 ? "d2" : i % 4 === 2 ? "d3" : "d4"}
                className="break-inside-avoid"
              >
                <div className="group relative overflow-hidden rounded-2xl border border-alfe-border shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`relative ${item.size === "large" ? "aspect-[3/4]" : "aspect-square"}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-0 left-0 right-0 p-4 text-white text-xs font-bold uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram section ── */}
      <section className="bg-alfe-cream-dark py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <span className="alfe-label-rosa block mb-3">Redes sociales</span>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-alfe-choco uppercase tracking-wide leading-none">
                @alfajorina
              </h2>
            </div>
            <a
              href={alfajorinaLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn-alfe-outline inline-flex gap-2 items-center"
            >
              <Instagram className="h-4 w-4" />
              Seguir en Instagram
            </a>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramPosts.map((post, i) => (
              <ScrollReveal
                key={post.src}
                delay={i % 3 === 0 ? "d1" : i % 3 === 1 ? "d2" : "d3"}
              >
                <a
                  href={alfajorinaLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl border border-alfe-border shadow-sm"
                >
                  <Image
                    src={post.src}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 16.6vw, (min-width: 640px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-alfe-choco/70 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Instagram className="h-5 w-5 text-white" />
                    <span className="text-white text-xs font-bold">❤ {post.likes}</span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TikTok section ── */}
      <section className="bg-alfe-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-10">
            <span className="alfe-label-choco block mb-3" style={{ color: "#C8833B" }}>Detrás de cámaras</span>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-alfe-choco uppercase tracking-wide leading-none mb-6">
              El proceso en vídeo
            </h2>
            <p className="text-alfe-choco-light text-base max-w-xl mx-auto">
              Miranos hacer los alfajores en TikTok: desde el dulce de leche hasta la cobertura final.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1563897539633-7374c276c212?w=400&q=80",
                title: "Dulce de leche",
                subtitle: "El secreto bien guardado",
                length: "0:45",
              },
              {
                src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
                title: "La masa perfecta",
                subtitle: "Maicena y paciencia",
                length: "1:02",
              },
              {
                src: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
                title: "La cobertura",
                subtitle: "Chocolate 70%",
                length: "0:38",
              },
              {
                src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
                title: "El resultado final",
                subtitle: "Perfecto y listo",
                length: "0:25",
              },
            ].map((reel, i) => (
              <ScrollReveal key={reel.src} delay={i % 4 === 0 ? "d1" : i % 4 === 1 ? "d2" : i % 4 === 2 ? "d3" : "d4"}>
                <a
                  href={alfajorinaLinks.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-2xl border border-alfe-border shadow-sm aspect-[9/16]"
                >
                  <Image
                    src={reel.src}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/85 via-alfe-choco/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-alfe-choco/70 rounded-full px-2 py-0.5">
                    <span className="text-white text-[10px] font-bold">{reel.length}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <TikTokIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-xs font-black uppercase tracking-[0.2em] mb-0.5">{reel.title}</p>
                    <p className="text-white/60 text-[10px]">{reel.subtitle}</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={alfajorinaLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="btn-alfe-outline inline-flex gap-2 items-center"
            >
              <TikTokIcon className="h-4 w-4" />
              Ver todos en TikTok
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
