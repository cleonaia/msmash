// ─── Virutes Brand Data ────────────────────────────────────────────────────
export const siteConfig = {
  name: "Virutes",
  tagline: "Focacceria Artesanal",
  slogan: "Massa, temps i ànima.",
  sloganSub: "La focacceria artesanal de Sabadell.",
  city: "Sabadell",
  description:
    "Focacceria artesanal al cor de Sabadell. Massa mare de 48 hores, ingredients de proximitat i molt de caràcter.",
  address: "Via de Massagué, 31, 08201 Sabadell, Barcelona",
  addressShort: "Via de Massagué, 31 · Sabadell",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Via+de+Massagué+31+08201+Sabadell+Barcelona",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=Via+de+Massagué+31+Sabadell&t=&z=17&ie=UTF8&iwloc=&output=embed",
};

export const contactInfo = {
  phone: "933 34 55 91",
  phonePretty: "933 34 55 91",
  phoneHref: "tel:+34933345591",
  email: "hola@virutes.com",
  whatsappNumber: "34933345591",
};

export const socialLinks = {
  instagram: "https://www.instagram.com/virutes.sbd/",
  tiktok: "https://www.tiktok.com/@virutes.sbd",
  whatsapp: `https://wa.me/${contactInfo.whatsappNumber}`,
  phone: contactInfo.phone,
  email: contactInfo.email,
};

export const hours = [
  { days: "Dilluns",           time: "Tancat",               closed: true },
  { days: "Dimarts – Divendres", time: "12:00–15:30 / 19:30–22:30", closed: false },
  { days: "Dissabte",          time: "12:00–23:00",           closed: false },
  { days: "Diumenge",          time: "12:00–16:30",           closed: false },
];

export const navLinks = [
  { href: "/",           label: "Inici"    },
  { href: "/menu",       label: "Carta"    },
  { href: "/qui-som",    label: "Qui som"  },
  { href: "/galeria",    label: "Galeria"  },
  { href: "/blog",       label: "Novetats" },
  { href: "/contacto",   label: "Contacte" },
];

export const claims = [
  "Massa, temps i ànima.",
  "La focacceria artesanal de Sabadell.",
  "El sabor que et farà tornar.",
];

export const values = [
  {
    icon: "leaf",
    title: "Ingredients locals",
    description:
      "Treballem amb productors de proximitat. Cada ingredient té nom i origen.",
  },
  {
    icon: "clock",
    title: "48 hores de fermentació",
    description:
      "La nostra massa mare fermenta lentament. No hi ha dreceres quan es cuina amb rigor.",
  },
  {
    icon: "sun",
    title: "Temporada sempre",
    description:
      "La carta canvia amb l'estació. Mengem el que la terra ens dona ara.",
  },
];
