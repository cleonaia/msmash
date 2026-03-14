import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Trophy } from "lucide-react";

const teamMembers = [
  {
    name: "Marta Puig",
    role: "Fundadora & Cap de cuina",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80",
    quote: "La focaccia és el pa de la veritat. No et menteix mai.",
    initials: "MP",
  },
  {
    name: "Jordi Esteve",
    role: "Forner & Mestre de massa",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80",
    quote: "Cada matí a les 6 alimento la mare. Ella ens alimenta a nosaltres.",
    initials: "JE",
  },
  {
    name: "Alba Roca",
    role: "Sala & Atenció al client",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80",
    quote: "Veig als clients sortir feliços. Això és el més bonic.",
    initials: "AR",
  },
];

const milestones = [
  { year: "2022", text: "Obrim les portes amb 5 taules i un forn. Poca gent sabia on érem." },
  { year: "2023", text: "Guanyem el premi al millor pa artesà del Vallès. Comencem a omplir-nos." },
  { year: "2024", text: "Ampliem el local i obrim Click & Collect. Sabadell ja ens coneix." },
  { year: "2026", text: "Avui som la focacceria de referència de la ciutat. Gràcies a vosaltres." },
];

export default function QuiSomPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative mt-20 h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="L'equip de Virutes al forn"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/85 via-virutes-brown/40 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-virutes-cream/70 mb-4">
            La nostra història
          </span>
          <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">Qui som</h1>
          <p className="font-serif italic text-white/80 text-xl">
            Una focacceria amb ànima, una família amb farina a les mans.
          </p>
        </div>
      </div>

      {/* ── Story ── */}
      <section className="surface-light py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">La nostra història</span>
          <h2 className="section-title mt-3 mb-8">Nats a Sabadell, criats al forn</h2>
          <div className="space-y-5 text-virutes-brown/75 leading-relaxed text-lg">
            <p>
              Virutes va néixer el 2022 d&apos;una obsessió: fer la millor focaccia de Catalunya. No hi hauria dreceres, no hi hauria ingredients industrials. Només massa mare viva, fermentació llarga i productes que coneixem per nom.
            </p>
            <p>
              El nom &ldquo;Virutes&rdquo; ve de les encenalls de fusta del forn de llenya del pare del fundador. Un record d&apos;infantesa, una metàfora de tot allò artesà i honest.
            </p>
            <p>
              Avui som un petit gran equip de tres persones. Fornem de dilluns a diumenge (bé, de dimarts —el dilluns descancem). Cada dia és diferent, cada focaccia és única, i cada client que surt content és la nostra millor recompensa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Editorial image break ── */}
      <div className="relative h-72 lg:h-[420px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1800&q=80"
          alt="Forn artesanal de Virutes"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-virutes-brown/65" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="font-serif italic text-white text-2xl sm:text-3xl lg:text-[2.5rem] text-center max-w-2xl leading-snug">
            &ldquo;La focaccia no s&apos;improvisa. Es cuida, es mima, es dona temps.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Values ── */}
      <section className="surface-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Els nostres valors</span>
            <h2 className="section-title mt-3">El que ens fa ser Virutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-6 w-6 text-virutes-olive" />,
                title: "Ingredients locals",
                description: "Treballem amb productors de la comarca. Sabem d'on ve cada ingredient. Km0 no és un eslògan, és una pràctica diària.",
                color: "bg-virutes-olive/10",
              },
              {
                icon: <Heart className="h-6 w-6 text-virutes-red" />,
                title: "Fet amb amor",
                description: "Sona a tòpic però és real. No hi ha una sola focaccia que surti del forn sense que algú de l'equip l'hagi mirat i pensat: \"avui està bona\".",
                color: "bg-virutes-red/10",
              },
              {
                icon: <Trophy className="h-6 w-6 text-amber-600" />,
                title: "Qualitat sense excuses",
                description: "No rebaixem qualitat per anar més ràpid. Si la massa no és perfecta, tornem a fermentar. El resultat sempre val la pena.",
                color: "bg-amber-100",
              },
            ].map(({ icon, title, description, color }) => (
              <div key={title} className="bg-white rounded-3xl p-8 shadow-sm border border-virutes-border">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                  {icon}
                </div>
                <h3 className="font-semibold text-virutes-brown text-xl mb-3">{title}</h3>
                <p className="text-virutes-brown/65 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="surface-light py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">La nostra trajectòria</span>
            <h2 className="section-title mt-3">Pas a pas</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-virutes-border" />
            <div className="space-y-10">
              {milestones.map(({ year, text }) => (
                <div key={year} className="flex gap-8">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-virutes-red flex items-center justify-center shadow-lg shadow-virutes-red/25 z-10 relative">
                      <span className="text-white font-bold text-xs">{year}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-virutes-brown/75 leading-relaxed text-lg">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="surface-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">L&apos;equip</span>
            <h2 className="section-title mt-3">Les cares de Virutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map(({ name, role, image, quote, initials }) => (
              <div key={name} className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-virutes-brown shadow-lg">
                <Image
                  src={image}
                  alt={role}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/92 via-virutes-brown/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-black tracking-[0.18em] text-white backdrop-blur-sm">
                    {initials}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-virutes-red mb-2">{role}</p>
                  <h3 className="font-display text-2xl text-white leading-none mb-3">{name}</h3>
                  <p className="font-serif italic text-white/65 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-virutes-red py-20 px-4 text-center">
        <span className="font-display text-5xl text-white block mb-4">Vine a conèixer-nos</span>
        <p className="text-white/80 text-lg mb-8 font-serif italic">
          La millor manera d&apos;entendre Virutes és tastant-la.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/reservas" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-virutes-red font-bold rounded-full hover:bg-virutes-cream transition-colors">
            Reservar taula <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/menu" className="btn-outline-cream px-8 py-4">
            Veure la carta
          </Link>
        </div>
      </section>
    </div>
  );
}
