// ─── M SMASH Brand Data ──────────────────────────────────────────────────────
export const siteConfig = {
  name: "M SMASH",
  tagline: "Smash Burger",
  slogan: "Aplastado. Dorado. Perfecto.",
  sloganSub: "El smash burger definitivo de Terrassa.",
  city: "Terrassa",
  description:
    "Smash burgers de fuego en Terrassa. Carne aplastada al momento, queso fundido hasta los bordes y sabores que no se olvidan.",
  address: "Carrer del Col·legi, 5, 08221 Terrassa, Barcelona",
  addressShort: "Carrer del Col·legi, 5",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carrer+del+Col%C2%B7legi+5+08221+Terrassa+Barcelona",
  googleReviewsUrl:
    "https://www.google.com/maps/place/M+SMASH+BURGER/@41.5723,1.9762,15z/data=!4m6!3m5!1s0x12a427c00000001b:0x1234567890abcdef!8m2!3d41.5723!4d1.9762!16s%2Fg%2F11234567890",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=Carrer+del+Col%C2%B7legi+5+Terrassa&t=&z=16&ie=UTF8&iwloc=&output=embed",
};

export const contactInfo = {
  phone: "612 59 88 99",
  phonePretty: "612 59 88 99",
  phoneHref: "tel:+34612598899",
  email: "msmashburguer2026@gmail.com",
  whatsappNumber: "34612598899",
};
export const legalInfo = {
  taxName: "WILLIAM DA SILVA FERRARI",
  taxId: "Z0944573Z",
  commercialName: "M SMASH BURGUER",
  typeEntity: "autónomo",
  address: "Carrer del Col-legi 5, 08221 Terrassa, Barcelona",
  legalEmail: contactInfo.email,
  supportPhone: contactInfo.phonePretty,

  iban: "ES55 2100 0087 6302 0212 1332",
  bic: "CAIXESBBXXX",
  bankAccountHolder: "William Da Silva Ferrari",

  owner: {
    name: "William Da Silva Ferrari",
    role: "Titular",
  },
};


export const socialLinks = {
  instagram: "https://www.instagram.com/msmashburguer/",
  tiktok: "https://www.tiktok.com/@msmashburguer?_r=1&_t=ZN-95GD8MGZs6Y",
  whatsapp: `https://wa.me/${contactInfo.whatsappNumber}`,
  phone: contactInfo.phone,
  email: contactInfo.email,
};

export const hours = [
  { days: "Domingo – Jueves", time: "13:00–23:00", closed: false },
  { days: "Viernes – Sábado", time: "13:00–23:30", closed: false },
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
