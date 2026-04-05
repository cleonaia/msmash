'use client';

import { menuItems, categories, allergenLabels } from '@/features/menu/data/menu';
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

export function MenuCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].id
  );

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  const getCategoryLabel = (id: string) => {
    return categories.find((c) => c.id === id)?.label || id;
  };

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            🍔 Nuestra Carta
          </h1>
          <p className="text-red-100 text-lg">
            Aplastado. Dorado. Perfecto.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-12 sticky top-20 bg-white/95 py-4 rounded-xl p-4 shadow-md z-10">
          {categories.map((category) => {
            const count = menuItems.filter(
              (item) => item.category === category.id
            ).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const mobilePosition = getMobileImagePosition(item.id);
            const desktopPosition = getImagePosition(item.id);
            return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              {/* Imagen */}
              <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-[var(--mobile-pos)] sm:object-[var(--desktop-pos)]"
                    style={{ '--mobile-pos': mobilePosition, '--desktop-pos': desktopPosition } as Record<string, string>}
                  />
                )}
                {item.badge && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {item.badge}
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Favorito
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                {/* Nombre y precio */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold text-red-600 whitespace-nowrap">
                    {item.price.toFixed(2)}€
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.description}
                </p>

                {/* Alérgenos */}
                {item.allergens.length > 0 && (
                  <div className="mb-4 pb-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      ⚠️ Alérgenos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="bg-yellow-100 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-300"
                        >
                          {allergen === 'gluten'
                            ? 'Gluten'
                            : allergen === 'lacteos'
                            ? 'Lácteos'
                            : allergen === 'huevos'
                            ? 'Huevos'
                            : allergen === 'mostaza'
                            ? 'Mostaza'
                            : allergen === 'soja'
                            ? 'Soja'
                            : allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón */}
                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
                  🛒 Añadir al Pedido
                </button>
              </div>
            </div>
          );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay productos en esta categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
