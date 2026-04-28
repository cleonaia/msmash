// ─── Alfajorina Brand Data ────────────────────────────────────────────────────
export const alfajorinaConfig = {
  name: "Alfajorina",
  tagline: "Alfajores Artesanales",
  slogan: "Dulzura hecha a mano.",
  sloganSub: "Los alfajores artesanales más irresistibles.",
  city: "Barcelona",
  description:
    "Alfajores artesanales elaborados con ingredientes de primera calidad, rellenos de dulce de leche casero y coberturas únicas. Cada bocado es un viaje.",
  address: "Carrer de la Dolçor, 12, 08001 Barcelona",
  addressShort: "Carrer de la Dolçor, 12 · Barcelona",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carrer+de+la+Dolçor+12+Barcelona",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=Carrer+de+la+Dolçor+12+Barcelona&t=&z=17&ie=UTF8&iwloc=&output=embed",
  googleReviewsUrl: "https://share.google/alfajorina",
};

export const alfajorinaContact = {
  phone: "634 21 88 77",
  phonePretty: "634 21 88 77",
  phoneHref: "tel:+34634218877",
  email: "hola@alfajorina.com",
  whatsappNumber: "34634218877",
};

export const alfajorinaLegal = {
  taxName: "ALFAJORINA SL",
  taxId: "B12345678",
  commercialName: "Alfajorina",
  typeEntity: "sociedad limitada",
  address: "Carrer de la Dolçor, 12, 08001 Barcelona",
  legalEmail: alfajorinaContact.email,
  supportPhone: alfajorinaContact.phonePretty,
};

export const alfajorinaLinks = {
  instagram: "https://www.instagram.com/alfajorina/",
  tiktok: "https://www.tiktok.com/@alfajorina",
  whatsapp: `https://wa.me/${alfajorinaContact.whatsappNumber}`,
  phone: alfajorinaContact.phone,
  email: alfajorinaContact.email,
};

export const alfajorinaHours = [
  { days: "Lunes",              time: "Cerrado",              closed: true },
  { days: "Martes – Viernes",   time: "10:00–14:00 / 16:30–20:30", closed: false },
  { days: "Sábado",             time: "10:00–20:30",          closed: false },
  { days: "Domingo",            time: "11:00–15:00",          closed: false },
];

export const alfajorinaNavLinks = [
  { href: "/alfajorina",           label: "Inicio"    },
  { href: "/alfajorina/menu",      label: "La Carta"  },
  { href: "/alfajorina/pedidos",   label: "Pedidos"   },
  { href: "/alfajorina/nosotros",  label: "Nosotros"  },
  { href: "/alfajorina/galeria",   label: "Galería"   },
  { href: "/alfajorina/contacto",  label: "Contacto"  },
];

export const alfajorinaStats = [
  { value: "100%",     label: "Ingredientes naturales" },
  { value: "Casero",   label: "Dulce de leche propio"  },
  { value: "+12",      label: "Variedades únicas"       },
  { value: "Desde 2020", label: "Tradición artesanal"  },
];

export const alfajorinaValues = [
  {
    icon: "cookie",
    title: "Receta Original",
    description:
      "Cada alfajor sigue una receta transmitida con cariño. Sin atajos, sin industriales: masa de maicena, dulce de leche casero y cobertura de chocolate real.",
  },
  {
    icon: "heart",
    title: "Ingredientes Premium",
    description:
      "Seleccionamos la mejor harina, mantequilla de calidad y chocolate con un mínimo del 70% de cacao. Lo que entra es lo que sientes al morderlo.",
  },
  {
    icon: "sparkles",
    title: "Elaboración Artesanal",
    description:
      "Todo se hace a mano, en pequeños lotes, para garantizar frescura y el cariño que merece cada pieza. Sin conservantes, sin colorantes artificiales.",
  },
];

export const alfajorinaTestimonials = [
  {
    name: "Laura M.",
    text: "Los alfajores más ricos que he probado fuera de Argentina. El dulce de leche es exactamente como el de allá.",
    stars: 5,
  },
  {
    name: "Carlos P.",
    text: "Pedí una caja de 12 para una reunión y desaparecieron en minutos. Tuve que volver a pedir.",
    stars: 5,
  },
  {
    name: "Sara G.",
    text: "La cobertura de chocolate negro es adictiva. Imposible parar en uno.",
    stars: 5,
  },
];
