'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, Flame, ShoppingBag } from 'lucide-react';
import { menuItems, categories, type Allergen } from '@/features/menu/data/menu';
import { GoogleReviewsWidget } from './GoogleReviewsWidget';

const allergenLabels: Record<Allergen, string> = {
  gluten: 'Gluten',
  lacteos: 'Lacteos',
  huevos: 'Huevos',
  mostaza: 'Mostaza',
  soja: 'Soja',
  apio: 'Apio',
  crustaceos: 'Crustaceos',
  pescado: 'Pescado',
};

const badgeClass: Record<string, string> = {
  Favorito: 'tag-fire',
  Premium: 'tag-gold',
  Niños: 'inline-flex items-center px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.3em] bg-smash-turquoise/15 text-smash-turquoise border border-smash-turquoise/35',
  Top: 'tag-gold',
};

function formatPrice(value: number) {
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function getImagePosition(itemId: string) {
  if (itemId === 'the-basic') return 'center 78%';
  if (itemId === 'the-crispy') return 'center 36%';
  if (itemId === 'the-m-smash') return 'center 42%';
  if (itemId === 'menu-kids') return 'center center';
  if (itemId === 'tequenos') return 'center 34%';
  if (itemId === 'crispy-chicken') return 'center 45%';
  if (itemId === 'super-crispy-chicken') return 'center 42%';
  if (itemId === 'frankfurt') return 'center 62%';
  if (itemId.startsWith('cerveza-')) return 'center 42%';
  if (itemId === 'tinto-de-verano') return 'center 45%';
  return 'center center';
}

function getMobileImagePosition(itemId: string) {
  if (itemId === 'the-basic') return 'center 74%';
  if (itemId === 'the-crispy') return 'center 30%';
  if (itemId === 'the-m-smash') return 'center 36%';
  if (itemId === 'tequenos') return 'center 26%';
  if (itemId === 'crispy-chicken') return 'center 38%';
  if (itemId === 'super-crispy-chicken') return 'center 36%';
  return getImagePosition(itemId);
}

function getImagePositions(itemId: string) {
  return {
    mobile: getMobileImagePosition(itemId),
    desktop: getImagePosition(itemId),
  };
}

function isDrinkPhoto(itemId: string) {
  return (
    itemId.startsWith('cerveza-') ||
    itemId === 'tinto-de-verano' ||
    itemId === 'pepsi-clasica' ||
    itemId === 'lipton' ||
    itemId === 'pepsi-zero' ||
    itemId === 'sprite' ||
    itemId === 'schweppes-naranja' ||
    itemId === 'schweppes-limon' ||
    itemId === 'agua-solan' ||
    itemId === 'agua-gas'
  );
}

function ProductImage({
  src,
  alt,
  itemId,
  positions,
}: {
  src: string;
  alt: string;
  itemId: string;
  positions: { mobile: string; desktop: string };
}) {
  const [imageSrc, setImageSrc] = useState(src || '/images/products/placeholder.svg');
  const isPlaceholder = imageSrc.endsWith('.svg') || imageSrc.includes('placeholder');

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      onError={() => setImageSrc('/images/products/placeholder.svg')}
      className={
        isDrinkPhoto(itemId) || isPlaceholder
          ? 'object-cover object-center'
          : 'object-cover object-[var(--mobile-pos)] sm:object-[var(--desktop-pos)]'
      }
      style={{ '--mobile-pos': positions.mobile, '--desktop-pos': positions.desktop } as Record<string, string>}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
    />
  );
}

export function CarteProfessional() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems = useMemo(
    () =>
      activeCategory === 'all'
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="bg-smash-black min-h-screen">
      <div className="relative mt-20 h-52 sm:h-64 flex items-end overflow-hidden sky-bg">
        <Image
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&q=80"
          alt="Carta M SMASH"
          fill
          className="object-cover object-center opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-smash-black/90 via-smash-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <span className="label-fire block mb-3">La carta</span>
          <h1 className="font-display display-md text-white uppercase tracking-wide leading-none">Menu completo</h1>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-smash-sky/80 mt-2">
            Smash burgers · Entrantes · Bebidas
          </p>
        </div>
      </div>

      <div className="bg-smash-dark border-b border-smash-border">
        <div className="fire-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-smash-cream/40 font-medium">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-smash-fire" />
              Todos los alergenos visibles en cada producto
            </span>
            <span className="flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-smash-gold" />
              Recetas smash con ingredientes frescos
            </span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-16">
        <div className="sticky top-20 z-20 bg-smash-black/95 backdrop-blur-md pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-2 border-b border-smash-border mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-smash-fire text-white shadow-fire-sm'
                  : 'bg-smash-smoke border border-smash-border text-smash-cream/45 hover:border-smash-fire/50'
              }`}
            >
              Todo
            </button>
            {categories.map(({ id, label }) => {
              const count = menuItems.filter((item) => item.category === id).length;
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === id
                      ? 'bg-smash-fire text-white shadow-fire-sm'
                      : 'bg-smash-smoke border border-smash-border text-smash-cream/45 hover:border-smash-fire/50'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const positions = getImagePositions(item.id);
            return (
            <article
              key={item.id}
              className="surface-smoke overflow-hidden border border-smash-border hover:border-smash-fire/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 sm:h-48 w-full bg-smash-smoke-mid">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  itemId={item.id}
                  positions={positions}
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-smash-black/55 to-transparent pointer-events-none" />
                {item.badge && (
                  <div className="absolute top-3 left-3">
                    <span className={`${badgeClass[item.badge] ?? 'tag-fire'} text-[9px] px-2.5 py-1`}>
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="font-display text-xl sm:text-2xl text-smash-cream uppercase tracking-wide leading-tight sm:leading-none">
                    {item.name}
                  </h3>
                  <span className="font-display text-xl sm:text-2xl text-smash-turquoise leading-none whitespace-nowrap">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <p className="text-sm text-smash-cream/50 leading-relaxed mb-4 min-h-[44px]">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  {item.allergens.length > 0 ? (
                    item.allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-smash-smoke-mid border border-smash-border text-smash-cream/70"
                      >
                        {allergenLabels[allergen]}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-smash-sky/10 border border-smash-sky/30 text-smash-sky">
                      Sin alergenos declarados
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
          })}
        </div>

        <GoogleReviewsWidget />

        <div className="mt-12 text-center">
          <Link href="/pedidos" className="btn-smash inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Pedir ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
