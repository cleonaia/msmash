// ─── Blog / Novetats data ──────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "nova-carta-tardor-2026",
    title: "Nova carta de tardor: ingredients de temporada",
    excerpt:
      "Arriba la tardor i amb ella els bolets, les castayes i els sabors càlids. Descobreix les novetats de la nostra carta per a aquesta estació.",
    content: `
La tardor és l'estació que més ens inspira a Virutes. Els bolets del Montseny, les castayes de l'Alt Berguedà, els naps i els carbassons... tot arriba al nostre forn amb una energia especial.

**Novetats de la carta:**

- **Focaccia de bolets i trufa**: una combinació excepcional de ceps, rossinyols i oli de trufa negra sobre la nostra massa mare.
- **Pinsa de carbassa i gorgonzola**: dolçor i intensitat en el mateix mos.
- **Postre de castanyes**: pannacota de castanyes amb mel de romaní.

Vine a provar-ho! La carta canvia cada temporada perquè mengem el que la terra ens dona ara.
    `.trim(),
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    category: "Carta",
    publishedAt: "2026-03-01",
    readingTime: 3,
  },
  {
    id: "2",
    slug: "historia-focaccia-lliguria",
    title: "La focaccia: un viatge a la Ligúria",
    excerpt:
      "D'on ve la focaccia? Un viatge pels orígens d'aquest pa que ha conquerit el món, i com nosaltres l'hem adaptat al gust mediterrani català.",
    content: `
La focaccia té els seus orígens a la Ligúria, la regió italiana banyada pel mar Mediterrani. Els genovesos ja la preparaven fa més de dos mil anys, i la recepta original —oli d'oliva, sal gruixuda, massa fermentada— continua sent la base de tot.

A Virutes, respectem aquesta tradició però l'adaptem: fem servir oli d'oliva verge extra de Catalunya, sal de l'Empordà i ingredients de proximitat. La nostra massa fermenta 48 hores per aconseguir aquella textura esponjosa i crosta daurada que ens defineix.

**La nostra tècnica:**
- Massa mare viva, alimentada cada dia
- Fermentació lenta en fred, 48 hores
- Fornejada a alta temperatura en forn de pedra
- Acabada amb generós rajolí d'AOVE

Cada focaccia és única. Cada dia és diferent. Això és el que ens encanta.
    `.trim(),
    coverImage:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    category: "Història",
    publishedAt: "2026-02-15",
    readingTime: 4,
  },
  {
    id: "3",
    slug: "click-collect-disponible",
    title: "Click & Collect: ara pots fer la teva comanda per emportar",
    excerpt:
      "Ja pots fer la teva comanda a Virutes des de casa i recollir-la quan vulguis. Sense cua, sense espera. L'artesà a la teva porta.",
    content: `
A partir d'avui, Virutes ofereix un servei de **Click & Collect**. Ara pots fer la teva comanda des de la web i recollir-la al local quan vulguis.

**Com funciona:**
1. Tria els productes a la nostra carta digital
2. Selecciona l'hora de recollida
3. Paga en línia o a la botiga
4. Vine i recull sense cua

Disponible per a totes les focaccies, pinses i plats del dia. Les comandes s'han de fer amb un mínim de 30 minuts d'antelació.

Esperem que aquest nou servei us faciliti la vida i pugueu gaudir de la nostra focaccia on i quan vulgueu!
    `.trim(),
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    category: "Novetats",
    publishedAt: "2026-02-01",
    readingTime: 2,
  },
];
