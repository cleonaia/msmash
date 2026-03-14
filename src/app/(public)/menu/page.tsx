"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, Leaf, Info } from "lucide-react";
import { menuItems, categories, allergenLabels, type MenuCategory } from "@/features/menu/data/menu";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [showAllergens, setShowAllergens] = useState(false);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        search.length === 0 ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div>
      <PageHeader
        title="La nostra carta"
        subtitle="Focaccies, pinses i plats del dia elaborats amb massa mare i ingredients de proximitat"
        backgroundImage="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1600&q=80"
      />

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-20 z-30 bg-virutes-cream-light/95 backdrop-blur-md border-b border-virutes-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-virutes-red text-white shadow-sm"
                    : "bg-white border border-virutes-border text-virutes-brown hover:border-virutes-red hover:text-virutes-red"
                }`}
              >
                Tot
              </button>
              {categories.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeCategory === id
                      ? "bg-virutes-red text-white shadow-sm"
                      : "bg-white border border-virutes-border text-virutes-brown hover:border-virutes-red hover:text-virutes-red"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-virutes-brown/40" />
                <input
                  type="text"
                  placeholder="Cercar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-virutes-border rounded-full focus:outline-none focus:border-virutes-red text-virutes-brown placeholder-virutes-brown/40"
                />
              </div>
              <button
                onClick={() => setShowAllergens((v) => !v)}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-colors ${
                  showAllergens
                    ? "bg-virutes-red border-virutes-red text-white"
                    : "bg-white border-virutes-border text-virutes-brown hover:border-virutes-red"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Al·lèrgens</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-virutes-brown/60 text-lg">No hem trobat res per a &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="mt-4 btn-primary"
            >
              Veure tot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <article key={item.id} className="card-product">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider bg-virutes-red text-white px-3 py-1 rounded-full z-10">
                      {item.badge}
                    </span>
                  )}
                  {item.vegan && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs bg-virutes-olive text-white px-2.5 py-1 rounded-full z-10">
                      <Leaf className="h-3 w-3" /> Vegà
                    </span>
                  )}
                  {!item.vegan && item.vegetarian && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs bg-virutes-olive/80 text-white px-2.5 py-1 rounded-full z-10">
                      <Leaf className="h-3 w-3" /> Vegetarià
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-virutes-brown leading-snug">{item.name}</h3>
                    <span className="font-bold text-virutes-red shrink-0 tabular-nums text-lg">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <p className="text-sm text-virutes-brown/65 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  {showAllergens && item.allergens.length > 0 && (
                    <div className="border-t border-virutes-border pt-3">
                      <p className="text-xs text-virutes-brown/50 mb-1.5 font-medium uppercase tracking-wider">Al·lèrgens:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.allergens.map((a) => (
                          <span key={a} className="text-xs bg-virutes-cream border border-virutes-border text-virutes-brown/70 px-2 py-0.5 rounded-full">
                            {allergenLabels[a]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 bg-virutes-cream rounded-2xl p-6 text-sm text-virutes-brown/65 leading-relaxed">
          <p className="font-semibold text-virutes-brown mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-virutes-brown/50" /> Informació sobre al·lèrgens</p>
          <p>
            Si tens alguna al·lèrgia o intolerància alimentària, si us plau informa&apos;ns en fer la reserva o en arribar al local.
            Els nostres plats es preparen en entorns on es manipulen tots els al·lèrgens principals.
          </p>
        </div>
      </section>
    </div>
  );
}
