// ─── Virutes Menu Data ─────────────────────────────────────────────────────
export type Allergen = "gluten" | "lactics" | "ous" | "peix" | "fruits-sec" | "soja";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  allergens: Allergen[];
  featured?: boolean;
  badge?: string;         // "NOU" | "Preferit" | "Temporada"
  vegan?: boolean;
  vegetarian?: boolean;
}

export type MenuCategory =
  | "focaccies-classiques"
  | "focaccies-especials"
  | "pinses"
  | "plats"
  | "postres"
  | "begudes";

export const categories: { id: MenuCategory; label: string }[] = [
  { id: "focaccies-classiques", label: "Focaccies clàssiques" },
  { id: "focaccies-especials",  label: "Focaccies especials"  },
  { id: "pinses",               label: "Pinses"               },
  { id: "plats",                label: "Plats del dia"        },
  { id: "postres",              label: "Postres"              },
  { id: "begudes",              label: "Begudes"              },
];

const FOCACCIA_BASE =
  "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80";
const FOCACCIA_2 =
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80";
const FOCACCIA_3 =
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80";
const PINSA_IMG =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80";
const DESSERT_IMG =
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80";
const DRINK_IMG =
  "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&q=80";
const PLAT_IMG =
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80";

export const menuItems: MenuItem[] = [
  // ── Focaccies clàssiques ─────────────────────────────────────────────────
  {
    id: "focaccia-margherita",
    name: "Margherita clàssica",
    description: "Tomàquet artesà, mozzarella fior di latte, alfàbrega fresca i AOVE",
    price: 12.5,
    category: "focaccies-classiques",
    image: FOCACCIA_BASE,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
    featured: true,
    badge: "Preferit",
  },
  {
    id: "focaccia-rosemary",
    name: "Focaccia al romero",
    description: "Massa mare 48h, sal gruixuda, all confitat, romaní de temporada i oli d'oliva verge",
    price: 9.0,
    category: "focaccies-classiques",
    image: FOCACCIA_2,
    allergens: ["gluten"],
    vegetarian: true,
    vegan: true,
    featured: false,
  },
  {
    id: "focaccia-pomodoro",
    name: "Pomodoro e origano",
    description: "Tomàquet confit, orègà silvestre, olives negres taggiasche i parmigiano",
    price: 11.0,
    category: "focaccies-classiques",
    image: FOCACCIA_3,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
  },
  {
    id: "focaccia-formaggio",
    name: "Quattro formaggi",
    description: "Mozzarella, gorgonzola DOP, parmigià reggiano i ricotta fresca",
    price: 14.0,
    category: "focaccies-classiques",
    image: FOCACCIA_BASE,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
    featured: true,
    badge: "Temporada",
  },

  // ── Focaccies especials ───────────────────────────────────────────────────
  {
    id: "focaccia-prosciutto-rucola",
    name: "Prosciutto e Rucola",
    description: "Pernil cru italià DOP, rúcula baby, parmesà en escates i maionesa de llimona",
    price: 15.5,
    category: "focaccies-especials",
    image: FOCACCIA_2,
    allergens: ["gluten", "lactics", "ous"],
    featured: true,
    badge: "NOU",
  },
  {
    id: "focaccia-bolognese",
    name: "Ragú de vedella",
    description: "Ragú lent de vedella de pastura, beixamel artesana i parmigià ratllat",
    price: 14.0,
    category: "focaccies-especials",
    image: FOCACCIA_3,
    allergens: ["gluten", "lactics"],
    featured: true,
  },
  {
    id: "focaccia-burrata",
    name: "Burrata & Tomate",
    description: "Burrata fresca, tomàquet bikino, pesto de alfàbrega i reducció de balsamico",
    price: 16.0,
    category: "focaccies-especials",
    image: FOCACCIA_BASE,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
    badge: "Preferit",
  },
  {
    id: "focaccia-caponata",
    name: "Caponata siciliana",
    description: "Albergínia confitada, pebrot groc, pinyons torrats, sultanes i crema de mozzarella",
    price: 13.5,
    category: "focaccies-especials",
    image: FOCACCIA_2,
    allergens: ["gluten", "lactics", "fruits-sec"],
    vegetarian: true,
    vegan: false,
  },

  // ── Pinses ────────────────────────────────────────────────────────────────
  {
    id: "pinsa-burrata-cherry",
    name: "Pinsa Burrata",
    description: "Burrata cremosa, tomàquet cherry confitat, alfàbrega i AOVE d'Arbequina",
    price: 16.0,
    category: "pinses",
    image: PINSA_IMG,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
    featured: true,
  },
  {
    id: "pinsa-salmo",
    name: "Pinsa Salmó fumat",
    description: "Salmó fumat, formatge crema, rúcula, tàperes i llimona",
    price: 17.5,
    category: "pinses",
    image: PINSA_IMG,
    allergens: ["gluten", "lactics", "peix"],
    badge: "Preferit",
  },
  {
    id: "pinsa-funghi",
    name: "Pinsa Funghi",
    description: "Barreja de bolets de temporada, crema de parmentier, farigola i parmigià",
    price: 15.0,
    category: "pinses",
    image: PINSA_IMG,
    allergens: ["gluten", "lactics"],
    vegetarian: true,
  },

  // ── Plats del dia ─────────────────────────────────────────────────────────
  {
    id: "plat-sopa-tomquet",
    name: "Sopa de tomàquet",
    description: "Sopa de tomàquet rostit, oli d'oliva i pa de massa mare tostat",
    price: 8.5,
    category: "plats",
    image: PLAT_IMG,
    allergens: ["gluten"],
    vegetarian: true,
    vegan: true,
  },
  {
    id: "plat-polpette",
    name: "Polpette al sugo",
    description: "Mandonguilles de vedella amb salsa de tomàquet artesà i pa focaccia",
    price: 12.0,
    category: "plats",
    image: PLAT_IMG,
    allergens: ["gluten", "ous"],
  },
  {
    id: "plat-insalata",
    name: "Insalata della casa",
    description: "Enciam, bresaola, parmesà, nous i vinagreta de mostassa",
    price: 10.0,
    category: "plats",
    image: PLAT_IMG,
    allergens: ["lactics", "fruits-sec"],
  },

  // ── Postres ───────────────────────────────────────────────────────────────
  {
    id: "postre-tiramisu",
    name: "Tiramisú artesà",
    description: "Recepta clàssica amb mascarpone, cafè espresso i cacao de qualitat",
    price: 6.5,
    category: "postres",
    image: DESSERT_IMG,
    allergens: ["gluten", "lactics", "ous"],
    featured: true,
  },
  {
    id: "postre-pannacotta",
    name: "Pannacotta di vaniglia",
    description: "Panacota de vainilla Bourbon amb coulis de maduixes del Maresme",
    price: 6.0,
    category: "postres",
    image: DESSERT_IMG,
    allergens: ["lactics"],
    vegetarian: true,
  },

  // ── Begudes ───────────────────────────────────────────────────────────────
  {
    id: "beguda-agua",
    name: "Aigua mineral",
    description: "Natural o amb gas, 50 cl",
    price: 2.5,
    category: "begudes",
    image: DRINK_IMG,
    allergens: [],
    vegan: true,
    vegetarian: true,
  },
  {
    id: "beguda-vi-blanc",
    name: "Vi blanc de la casa",
    description: "Garnatxa blanca del Penedés, copa",
    price: 4.5,
    category: "begudes",
    image: DRINK_IMG,
    allergens: [],
  },
  {
    id: "beguda-vi-negre",
    name: "Vi negre de la casa",
    description: "Tempranillo de la Ribera del Duero, copa",
    price: 4.5,
    category: "begudes",
    image: DRINK_IMG,
    allergens: [],
  },
  {
    id: "beguda-sangria",
    name: "Sangria de la casa",
    description: "Recepta pròpia amb fruites de temporada, copa",
    price: 5.0,
    category: "begudes",
    image: DRINK_IMG,
    allergens: [],
  },
];

export const featuredItems = menuItems.filter((i) => i.featured);
export const allergenLabels: Record<Allergen, string> = {
  gluten:      "Gluten",
  lactics:     "Làctics",
  ous:         "Ous",
  peix:        "Peix",
  "fruits-sec": "Fruits secs",
  soja:        "Soja",
};
