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
    "https://www.google.com/maps/place/M+Smash+burguer/@41.5603212,2.0107491,17z/data=!4m15!1m8!3m7!1s0x12a492eba497c373:0xeff2de64e56501b3!2sCarrer+del+Col%C2%B7legi,+5,+08221+Terrassa,+Barcelona!3b1!8m2!3d41.5603212!4d2.0107491!16s%2Fg%2F11bw43phvd!3m5!1s0x12a49352c0c63c67:0xf4ff907d344c16ad!8m2!3d41.5603212!4d2.0107491!16s%2Fg%2F11z10g_12j?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
  googleReviewsUrl:
    "https://share.google/loYgEMmeESjAegREi",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=41.5603212,2.0107491&t=&z=17&ie=UTF8&iwloc=&output=embed",
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
