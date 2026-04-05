// ─── M SMASH Brand Data ──────────────────────────────────────────────────────
export const siteConfig = {
  name: "M SMASH",
  tagline: "Smash Burger",
  slogan: "Aplastado. Dorado. Perfecto.",
  sloganSub: "El smash burger definitivo de Terrassa.",
  city: "Terrassa",
  description:
    "Smash burgers de fuego en Terrassa. Carne aplastada al momento, queso fundido hasta los bordes y sabores que no se olvidan.",
  address: "Carrer de Colegi, 5, 08221 Terrassa, Barcelona",
  addressShort: "Carrer de Colegi, 5",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carrer+de+Colegi+5+08221+Terrassa+Barcelona",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=Carrer+de+Colegi+5+Terrassa&t=&z=16&ie=UTF8&iwloc=&output=embed",
};

export const contactInfo = {
  phone: "612 59 88 99",
  phonePretty: "612 59 88 99",
  phoneHref: "tel:+34612598899",
  email: "hola@msmash.es",
  whatsappNumber: "34612598899",
};

export const socialLinks = {
  instagram: "https://www.instagram.com/msmashburguer/",
  tiktok: "https://www.tiktok.com/@msmashburguer?_r=1&_t=ZN-95GD8MGZs6Y",
  whatsapp: `https://wa.me/${contactInfo.whatsappNumber}`,
  phone: contactInfo.phone,
  email: contactInfo.email,
};

export const hours = [
  { days: "Lunes",            time: "Cerrado",                  closed: true  },
  { days: "Martes – Viernes", time: "13:00–16:00 / 20:00–23:30", closed: false },
  { days: "Sábado",           time: "13:00–00:00",              closed: false },
  { days: "Domingo",          time: "13:00–17:00",              closed: false },
];

export const navLinks = [
  { href: "/",          label: "Inicio"    },
  { href: "/menu",      label: "La Carta"  },
  { href: "/pedidos",   label: "Pedidos"   },
  { href: "/nosotros",  label: "Nosotros"  },
  { href: "/galeria",   label: "Galería"   },
  { href: "/contacto",  label: "Contacto"  },
];

export const claims = [
  "Aplastado. Dorado. Perfecto.",
  "El smash burger más brutal de Terrassa.",
  "Imposible comer solo uno.",
];

export const stats = [
  { value: "180°",  label: "Temperatura plancha" },
  { value: "100%",  label: "Carne fresca" },
  { value: "Smash", label: "Técnica artesanal" },
];

export const values = [
  {
    icon: "flame",
    title: "Técnica Smash",
    description:
      "Aplastamos la carne al momento sobre la plancha a máxima temperatura. La costra caramelizada lo es todo.",
  },
  {
    icon: "beef",
    title: "Carne 100% fresca",
    description:
      "Sin congelados. Sin trampas. Carne seleccionada cada día para que cada bocado sea brutal.",
  },
  {
    icon: "star",
    title: "Combinaciones únicas",
    description:
      "Salsas propias, ingredientes que sorprenden. No encontrarás esto en ningún otro sitio.",
  },
];
