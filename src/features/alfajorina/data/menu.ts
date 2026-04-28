// ─── Alfajorina Products Data ─────────────────────────────────────────────────
export type Allergen =
  | "gluten"
  | "lacteos"
  | "huevos"
  | "soja"
  | "frutos_secos"
  | "cacahuetes";

export interface AlfajorinaProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  allergens: Allergen[];
  featured?: boolean;
  badge?: string;
  flavors?: string[];
}

export type ProductCategory =
  | "clasicos"
  | "especiales"
  | "cajas"
  | "tortas"
  | "temporada";

export const alfajorinaCategories: { id: ProductCategory; label: string }[] = [
  { id: "clasicos",    label: "Clásicos"     },
  { id: "especiales",  label: "Especiales"   },
  { id: "cajas",       label: "Cajas y Sets" },
  { id: "tortas",      label: "Tortas"       },
  { id: "temporada",   label: "Temporada"    },
];

export const alfajorinaProducts: AlfajorinaProduct[] = [
  // ── CLÁSICOS ────────────────────────────────────────────────────────────────
  {
    id: "alfajor-clasico",
    name: "Alfajor Clásico",
    description: "Masa de maicena suave, relleno de dulce de leche casero y cubierto de chocolate con leche. El original de siempre.",
    price: 2.5,
    category: "clasicos",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "El Favorito",
  },
  {
    id: "alfajor-chocolate-negro",
    name: "Alfajor de Chocolate Negro",
    description: "Masa de maicena con cacao, relleno generoso de dulce de leche y bañado en chocolate negro 70%. Intenso y sublime.",
    price: 2.8,
    category: "clasicos",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "Bestseller",
  },
  {
    id: "alfajor-coco",
    name: "Alfajor de Coco",
    description: "Masa suave, dulce de leche y rebozado en coco rallado tostado. El clásico de las abuelas, perfeccionado.",
    price: 2.5,
    category: "clasicos",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
  },
  {
    id: "alfajor-blanco",
    name: "Alfajor de Chocolate Blanco",
    description: "Masa de vainilla, relleno de dulce de leche extra cremoso y cobertura de chocolate blanco belga. Elegante y delicado.",
    price: 2.8,
    category: "clasicos",
    image: "https://images.unsplash.com/photo-1563897539633-7374c276c212?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos", "soja"],
    featured: false,
  },

  // ── ESPECIALES ──────────────────────────────────────────────────────────────
  {
    id: "alfajor-trio",
    name: "Alfajor Trío",
    description: "Tres capas de masa de maicena con doble relleno de dulce de leche y cobertura de chocolate negro. Para los valientes.",
    price: 3.9,
    category: "especiales",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "Nuevo",
  },
  {
    id: "alfajor-frambuesa",
    name: "Alfajor de Frambuesa",
    description: "Masa de vainilla, mermelada de frambuesa artesanal y cobertura de chocolate negro. Un equilibrio perfecto entre dulce y ácido.",
    price: 3.2,
    category: "especiales",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "Especial",
  },
  {
    id: "alfajor-limon",
    name: "Alfajor de Limón",
    description: "Masa de limón con ralladura fresca, crema de limón casera y cobertura de chocolate blanco. Fresco y sorprendente.",
    price: 3.0,
    category: "especiales",
    image: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
  },
  {
    id: "alfajor-pistacho",
    name: "Alfajor de Pistacho",
    description: "Masa de pistacho, crema de pistacho siciliano y cobertura de chocolate con leche. El capricho refinado.",
    price: 3.5,
    category: "especiales",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos", "frutos_secos"],
    featured: false,
    badge: "Premium",
  },

  // ── CAJAS Y SETS ────────────────────────────────────────────────────────────
  {
    id: "caja-6",
    name: "Caja Surtida · 6 Alfajores",
    description: "6 alfajores a elegir entre todas las variedades disponibles. Presentación en caja artesanal con lazo. Perfecto para regalar.",
    price: 13.9,
    category: "cajas",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "Regalo Perfecto",
  },
  {
    id: "caja-12",
    name: "Caja Deluxe · 12 Alfajores",
    description: "12 alfajores surtidos en caja deluxe con papel de seda y personalización. El regalo definitivo.",
    price: 25.9,
    category: "cajas",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
  },
  {
    id: "caja-24",
    name: "Caja Celebración · 24 Alfajores",
    description: "24 alfajores en caja especial para eventos y celebraciones. Incluye tarjeta personalizada.",
    price: 48.0,
    category: "cajas",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
    badge: "Eventos",
  },

  // ── TORTAS ──────────────────────────────────────────────────────────────────
  {
    id: "torta-alfajorina",
    name: "Torta Alfajorina",
    description: "Bizcocho de maicena, capas de dulce de leche, cobertura de chocolate negro y decoración de alfajoritos. Para 8-10 personas.",
    price: 38.0,
    category: "tortas",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
    badge: "Por encargo",
  },
  {
    id: "torta-individual",
    name: "Mini Torta Individual",
    description: "Versión individual de la torta alfajorina. Perfecta para caprichos o como postre especial.",
    price: 7.5,
    category: "tortas",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
  },

  // ── TEMPORADA ────────────────────────────────────────────────────────────────
  {
    id: "alfajor-navidad",
    name: "Alfajor de Especias Navideñas",
    description: "Masa de canela, jengibre y anís estrellado. Relleno de dulce de leche con naranja y cobertura de chocolate negro. Edición limitada.",
    price: 3.5,
    category: "temporada",
    image: "https://images.unsplash.com/photo-1607920592519-bab2a80a0c57?w=600&q=85",
    allergens: ["gluten", "lacteos", "huevos"],
    featured: false,
    badge: "Edición Limitada",
  },
];

export const alfajorinaFeaturedProducts = alfajorinaProducts.filter(
  (p) => p.featured
);
