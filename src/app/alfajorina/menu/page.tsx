"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import {
  alfajorinaProducts,
  alfajorinaCategories,
  type ProductCategory,
} from "@/features/alfajorina/data/menu";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

export default function AlfajorinaMenuPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? alfajorinaProducts
      : alfajorinaProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-alfe-cream">

      {/* ── Header ── */}
      <div className="relative mt-20 h-64 sm:h-80 flex items-end overflow-hidden bg-alfe-choco">
        <Image
          src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80"
          alt="Carta de alfajores Alfajorina"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/95 via-alfe-choco/50 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-10">
          <span className="alfe-label-caramel block mb-3">Alfajorina</span>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] text-alfe-cream uppercase tracking-wide leading-none animate-fade-up">
            La Carta
          </h1>
          <p className="text-alfe-cream/50 mt-2 text-sm animate-fade-up-200">
            Elaborados a mano cada mañana · Sin conservantes · Con amor
          </p>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div className="sticky top-20 z-30 bg-alfe-cream/95 backdrop-blur-md border-b border-alfe-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-alfe-caramel text-white shadow-md"
                  : "border border-alfe-border text-alfe-choco-light hover:text-alfe-choco hover:border-alfe-caramel/40"
              }`}
            >
              Todos
            </button>
            {alfajorinaCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-alfe-caramel text-white shadow-md"
                    : "border border-alfe-border text-alfe-choco-light hover:text-alfe-choco hover:border-alfe-caramel/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-alfe-choco-light">
            <p className="text-lg">No hay productos en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="card-alfe group flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 tag-alfe text-[9px]">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg text-alfe-choco leading-none uppercase tracking-wide">
                      {product.name}
                    </h3>
                    <span className="font-display text-lg text-alfe-caramel leading-none whitespace-nowrap shrink-0">
                      {fmt(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-alfe-choco-light leading-relaxed flex-1 mb-4">
                    {product.description}
                  </p>
                  {product.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="text-[9px] px-2 py-0.5 rounded-full border border-alfe-border text-alfe-choco-light bg-alfe-cream-dark"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/alfajorina/pedidos"
                    className="btn-alfe-primary w-full justify-center text-xs py-2.5 mt-auto"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Añadir al pedido
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <section className="bg-alfe-choco py-16 px-6 text-center">
        <span className="alfe-label-caramel block mb-4">¿No encuentras lo que buscas?</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-alfe-cream uppercase tracking-wide mb-4">
          Encargos Personalizados
        </h2>
        <p className="text-alfe-cream/50 text-sm max-w-lg mx-auto mb-8">
          Cajas temáticas, tortas especiales, sabores a medida para eventos o regalos corporativos. Cuéntanos lo que necesitas.
        </p>
        <Link href="/alfajorina/contacto" className="btn-alfe-primary inline-flex px-10 py-4">
          Solicitar encargo <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
