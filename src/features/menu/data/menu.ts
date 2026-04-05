// ─── M SMASH Menu Data ─────────────────────────────────────────────────────
export type Allergen =
  | "apio"
  | "crustaceos"
  | "huevos"
  | "pescado"
  | "gluten"
  | "lacteos"
  | "mostaza"
  | "soja";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  allergens: Allergen[];
  featured?: boolean;
  badge?: string;
}

export type MenuCategory =
  | "burguers"
  | "entrantres"
  | "frankfurts"
  | "cervezas"
  | "bebidas"
  | "postres";

export const categories: { id: MenuCategory; label: string }[] = [
  { id: "burguers",     label: "Burguers"    },
  { id: "entrantres",   label: "Entrantes"   },
  { id: "frankfurts",   label: "Frankfurts"  },
  { id: "cervezas",     label: "Cervezas"    },
  { id: "bebidas",      label: "Bebidas"     },
  { id: "postres",      label: "Postres"     },
];

// ─── Image placeholders (remplace con tus URLs reales de fotos) ──────────────
const THE_CRISPY = "/images/products/the-crispy.jpeg";
const THE_M_SMASH = "/images/products/the-m-smash.jpeg";
const THE_BASIC = "/images/products/the-basic.jpeg";
const THE_SUPER_CRISPY = "/images/products/the-super-crispy.jpeg";
const MENU_KIDS = "/images/products/menu-kids.jpeg";
const FRANKFURT = "/images/products/frankfurt.jpeg";
const TEQUENOS = "/images/products/tequenos.jpeg";
const FRIES_M = "/images/products/fries-m.jpeg";
const CRISPY_CHICKEN = "/images/products/crispy-chicken.jpeg";
const CHEESECAKE_NUTELLA = "/images/products/cheesecake-nutella.svg";
const PEPSI_CLASICA = "/images/products/pepsi-cola.png";
const LIPTON = "/images/products/lipton.jpeg";
const PEPSI_ZERO = "/images/products/pepsi-cola-light.jpeg";
const SPRITE = "/images/products/sprite.png";
const SCHWEPPES_NARANJA = "/images/products/schweppes-naranja.jpeg";
const SCHWEPPES_LIMON = "/images/products/schweppes-limon.png";
const AGUA_SOLAN = "/images/products/agua-solan-de-cabras.webp";
const AGUA_GAS = "/images/products/agua-con-gas-solan.jpeg";
const CERVEZA_RADLER = "/images/products/cerveza-radler-33cl.jpeg";
const CERVEZA_ALAMBRE = "/images/products/cerveza-alambre-33cl.jpeg";
const CERVEZA_TOSTADA_SIN_ALCOHOL = "/images/products/cerveza-tostada-sin-alcohol.jpeg";
const CERVEZA_ECOLOGICA = "/images/products/cerveza-ecologica.jpeg";
const TINTO_DE_VERANO = "/images/products/tinto-de-verano.jpeg";

export const menuItems: MenuItem[] = [
  // ── BURGUERS ──────────────────────────────────────────────────────────────
  {
    id: "the-crispy",
    name: "The Crispy",
    description: "Pan brioche, smash Burger con queso gouda, bacon crujiente, nuestras salsas caseras, cebolla caramelizada",
    price: 11.0,
    category: "burguers",
    image: THE_CRISPY,
    allergens: ["gluten", "lacteos", "huevos", "soja"],
    featured: true,
    badge: "Favorito",
  },
  {
    id: "the-m-smash",
    name: "The M Smash Burger",
    description: "Pan brioche, doble Smash Burger, queso Gouda, queso Cheddar, bacon crispy, cebolla caramelizada, huevo, salsa tártara koreana, salsa de la casa",
    price: 13.0,
    category: "burguers",
    image: THE_M_SMASH,
    allergens: ["lacteos", "gluten", "mostaza", "soja", "huevos"],
    featured: true,
    badge: "Premium",
  },
  {
    id: "the-basic",
    name: "The Basic",
    description: "Pan brioche, smash Burger, queso cheddar, ketchup, encurtido de pepillos",
    price: 6.5,
    category: "burguers",
    image: THE_BASIC,
    allergens: ["gluten", "lacteos"],
  },
  {
    id: "super-crispy-chicken",
    name: "THE SÚPER CRISPY CHICKEN BURGER",
    description: "Pollo extra crujiente marinado con especias japonesas, queso cheddar, tomate Pera, Salsa M, salsa tártara koreana, cebolla caramelizada y su pan brioche",
    price: 11.9,
    category: "burguers",
    image: THE_SUPER_CRISPY,
    allergens: ["gluten", "lacteos", "huevos"],
    featured: true,
  },
  {
    id: "menu-kids",
    name: "MENÚ KIDS",
    description: "Smash burger, queso cheddar, pan brioche. Acompañada de patatas, refresco y unas gomitas",
    price: 10.9,
    category: "burguers",
    image: MENU_KIDS,
    allergens: ["gluten", "lacteos"],
    badge: "Niños",
  },

  // ── ENTRANTRES ────────────────────────────────────────────────────────────
  {
    id: "tequenos",
    name: "Tequeños",
    description: "4 Dedos de queso envueltos en hojaldre",
    price: 5.0,
    category: "entrantres",
    image: TEQUENOS,
    allergens: ["gluten", "lacteos"],
  },
  {
    id: "fries-m",
    name: "Fries M",
    description: "Patatas fritas caseras, salsa de queso cheetos y bacon",
    price: 7.0,
    category: "entrantres",
    image: FRIES_M,
    allergens: ["gluten", "lacteos"],
    featured: true,
  },
  {
    id: "crispy-chicken",
    name: "CRISPY CHICKEN",
    description: "6 Tiras de pollo rebozadas con especias japonesas y acompañada con una tártara koreana",
    price: 6.0,
    category: "entrantres",
    image: CRISPY_CHICKEN,
    allergens: ["gluten", "huevos"],
  },

  // ── FRANKFURTS ────────────────────────────────────────────────────────────
  {
    id: "frankfurt",
    name: "Frankfurt",
    description: "Pan de brioche, salsa de la casa, maíz, patata palito, ensalada, salchicha, queso gouda rayado",
    price: 7.0,
    category: "frankfurts",
    image: FRANKFURT,
    allergens: ["gluten", "lacteos", "mostaza", "soja", "huevos"],
  },

  // ── CERVEZAS ─────────────────────────────────────────────────────────────
  {
    id: "cerveza-radler",
    name: "Cerveza Radler 33cl",
    description: "Cerveza estilo radler, refrescante.",
    price: 2.8,
    category: "cervezas",
    image: CERVEZA_RADLER,
    allergens: ["gluten"],
  },
  {
    id: "cerveza-alambre",
    name: "Cerveza Alambre 33cl",
    description: "Cerveza rubia 33cl.",
    price: 2.8,
    category: "cervezas",
    image: CERVEZA_ALAMBRE,
    allergens: ["gluten"],
  },
  {
    id: "cerveza-tostada-sin-alcohol",
    name: "Cerveza Tostada Sin Alcohol",
    description: "Cerveza tostada 0,0.",
    price: 2.8,
    category: "cervezas",
    image: CERVEZA_TOSTADA_SIN_ALCOHOL,
    allergens: ["gluten"],
  },
  {
    id: "cerveza-ecologica",
    name: "Cerveza Ecológica",
    description: "Cerveza ecológica.",
    price: 3.0,
    category: "cervezas",
    image: CERVEZA_ECOLOGICA,
    allergens: ["gluten"],
  },
  {
    id: "tinto-de-verano",
    name: "Tinto de Verano",
    description: "Tinto de verano.",
    price: 5.0,
    category: "cervezas",
    image: TINTO_DE_VERANO,
    allergens: ["gluten"],
    badge: "Top",
  },

  // ── BEBIDAS ───────────────────────────────────────────────────────────────
  {
    id: "pepsi-clasica",
    name: "PEPSI COLA CLÁSICA",
    description: "Refresco Pepsi Cola clásica, 330ml",
    price: 2.5,
    category: "bebidas",
    image: PEPSI_CLASICA,
    allergens: [],
  },
  {
    id: "lipton",
    name: "LIPTON",
    description: "Lipton té limón, 330ml",
    price: 2.5,
    category: "bebidas",
    image: LIPTON,
    allergens: [],
  },
  {
    id: "pepsi-zero",
    name: "PEPSI COLA ZERO",
    description: "Pepsi Cola Zero azúcar, 330ml",
    price: 2.5,
    category: "bebidas",
    image: PEPSI_ZERO,
    allergens: [],
  },
  {
    id: "sprite",
    name: "Sprite",
    description: "Refresco Sprite, 330ml",
    price: 2.5,
    category: "bebidas",
    image: SPRITE,
    allergens: [],
  },
  {
    id: "schweppes-naranja",
    name: "SCHWEPPES DE NARANJA",
    description: "Schweppes naranja, 250ml",
    price: 2.5,
    category: "bebidas",
    image: SCHWEPPES_NARANJA,
    allergens: [],
  },
  {
    id: "schweppes-limon",
    name: "SCHWEPPES DE LIMÓN",
    description: "Schweppes limón, 250ml",
    price: 2.5,
    category: "bebidas",
    image: SCHWEPPES_LIMON,
    allergens: [],
  },
  {
    id: "agua-solan",
    name: "AGUA SOLAN DE CABRAS",
    description: "Agua mineral de Solan de Cabras",
    price: 2.3,
    category: "bebidas",
    image: AGUA_SOLAN,
    allergens: [],
  },
  {
    id: "agua-gas",
    name: "AGUA CON GAS SOLAN",
    description: "Agua mineral con gas de Solan",
    price: 2.5,
    category: "bebidas",
    image: AGUA_GAS,
    allergens: [],
  },

  // ── POSTRES ───────────────────────────────────────────────────────────────
  {
    id: "cheesecake-nutella",
    name: "Cheesecake dé Nutella",
    description: "La clásica tarta de queso junto a una base dé Nutella y lluvia de cacao en polvo. Es un buen final Feliz",
    price: 6.5,
    category: "postres",
    image: CHEESECAKE_NUTELLA,
    allergens: ["gluten", "lacteos", "huevos"],
  },
];

export const featuredItems = menuItems.filter((i) => i.featured);

export const allergenLabels: Record<Allergen, string> = {
  apio: "Apio",
  crustaceos: "Crustáceos",
  huevos: "Huevos",
  pescado: "Pescado",
  gluten: "Gluten",
  lacteos: "Lácteos",
  mostaza: "Mostaza",
  soja: "Soja",
};
