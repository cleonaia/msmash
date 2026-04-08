'use client';

import { menuItems } from '@/features/menu/data/menu';
import Image from 'next/image';
import { useState } from 'react';

function getImagePosition(itemId: string) {
  if (itemId === 'the-crispy') return 'center 34%';
  if (itemId === 'the-m-smash') return 'center 40%';
  if (itemId === 'tequenos') return 'center 30%';
  if (itemId === 'crispy-chicken') return 'center 44%';
  if (itemId === 'super-crispy-chicken') return 'center 42%';
  if (itemId === 'menu-kids') return 'center center';
  return 'center center';
}

function getMobileImagePosition(itemId: string) {
  if (itemId === 'the-crispy') return 'center 28%';
  if (itemId === 'the-m-smash') return 'center 34%';
  if (itemId === 'tequenos') return 'center 24%';
  if (itemId === 'crispy-chicken') return 'center 38%';
  if (itemId === 'super-crispy-chicken') return 'center 36%';
  if (itemId === 'menu-kids') return 'center center';
  return 'center center';
}

export function InstagramMenuCards() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  const downloadAsImage = async (item: typeof menuItems[0]) => {
    // Esto requeriría una librería como html2canvas
    // Por ahora es un placeholder para la funcionalidad
    alert(`Compartir: ${item.name} en Instagram`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">📱 Cartas para Instagram</h2>
        <p className="text-gray-600">Optimizadas para compartir en redes sociales</p>
      </div>

      {/* Grid de productos Instagram-ready */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const mobilePosition = getMobileImagePosition(item.id);
          const desktopPosition = getImagePosition(item.id);
          const imageSrc = imageErrors[item.id]
            ? '/images/products/placeholder.svg'
            : item.image || '/images/products/placeholder.svg';
          const isPlaceholder = imageSrc.endsWith('.svg') || imageSrc.includes('placeholder');
          return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {/* Imagen */}
            <div className="relative w-full h-64 bg-gray-200">
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                onError={() =>
                  setImageErrors((prev) => ({
                    ...prev,
                    [item.id]: true,
                  }))
                }
                className={
                  isPlaceholder
                    ? 'object-cover object-center'
                    : 'object-cover object-[var(--mobile-pos)] sm:object-[var(--desktop-pos)]'
                }
                style={{ '--mobile-pos': mobilePosition, '--desktop-pos': desktopPosition } as Record<string, string>}
              />
              {item.badge && (
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {item.badge}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {item.description}
              </p>

              {/* Precio */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-red-600">
                  {item.price.toFixed(2)}€
                </span>
              </div>

              {/* Alergenos */}
              {item.allergens.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Alérgenos:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                      >
                        {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón compartir */}
              <button
                onClick={() => downloadAsImage(item)}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 rounded-lg transition-all"
              >
                📲 Compartir en Instagram
              </button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
