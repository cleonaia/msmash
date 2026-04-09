import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Zap, Star } from "lucide-react";

function Cloud({ className, opacity = 0.55, width = 280 }: { className?: string; opacity?: number; width?: number }) {
  return (
    <svg width={width} viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <ellipse cx="160" cy="80" rx="148" ry="36" fill="white" />
      <ellipse cx="100" cy="70" rx="76" ry="46" fill="white" />
      <ellipse cx="200" cy="66" rx="72" ry="42" fill="white" />
      <ellipse cx="148" cy="55" rx="60" ry="48" fill="white" />
      <ellipse cx="228" cy="72" rx="52" ry="36" fill="white" />
    </svg>
  );
}

const milestones = [
  { year: "2025", text: "Aquí nació la idea: crear una smash burger de verdad en Terrassa, con técnica, producto fresco y personalidad propia." },
  { year: "2026", text: "Empezamos a hacerlo realidad en Carrer del Col·legi, 5. Estamos en el inicio del proyecto y vamos paso a paso, con ambición." },
  { year: "Próximo", text: "Lo siguiente lo iremos construyendo con la comunidad: nuevas recetas, más contenido y más fuego." },
];

export default function NosotrosPage() {
  return (
    <div className="bg-smash-black min-h-screen">

      {/* ── Hero ── */}
      <div className="relative mt-20 h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden sky-bg">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="El equipo de M SMASH"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        {/* Cloud layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[8%] left-[-2%] animate-cloud-drift-slow" opacity={0.5} width={360} />
          <Cloud className="absolute top-[5%] right-[-3%] animate-cloud-drift" opacity={0.45} width={320} />
          <Cloud className="absolute top-[35%] left-[25%] animate-cloud-drift-mid" opacity={0.4} width={260} />
          <Cloud className="absolute bottom-[15%] right-[10%] animate-cloud-drift-slow" opacity={0.35} width={300} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-smash-black/90 via-smash-black/35 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <span className="label-sky block mb-5">Nuestra historia</span>
          <h1 className="font-display display-md text-smash-cream uppercase tracking-wide mb-4">
            Nacidos para
            <br />
            <span className="text-fire-glow">Aplastar</span>
          </h1>
          <p className="text-smash-cream/70 text-lg sm:text-2xl leading-relaxed font-light max-w-2xl mx-auto">
            <span className="block">La plancha manda, nosotros obedecemos.</span>
            <span className="block text-smash-cream/60">Carne que chispea, pan que abraza y queso que se derrite.</span>
            <span className="block">No prometemos milagros, prometemos sabor.</span>
            <span className="block text-smash-sky font-medium">Y cuando lo pruebas, ya lo entiendes.</span>
          </p>
        </div>
      </div>

      {/* ── Story ── */}
      <section className="bg-smash-black py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="label-fire block mb-6">Nuestra historia</span>
          <h2 className="font-display display-md text-smash-cream uppercase tracking-wide mb-10">
            Todo empezó con una pregunta
          </h2>
          <div className="space-y-6 text-smash-cream/55 leading-relaxed text-lg text-left">
            <p>
              &ldquo;¿Por qué no hay ninguna smash burger de verdad en Terrassa?&rdquo; Esa fue la pregunta que lo
              inició todo. No había respuesta. Así que decidimos ser la respuesta.
            </p>
            <p>
              Empezamos probando la técnica en casa. Plancha de hierro fundido, carne de ternera fresca,
              mucho queso y demasiada ambición. Cuando los vecinos empezaron a llamar al timbre para pedir
              una, supimos que teníamos algo.
            </p>
            <p>
              Encontramos el local en Carrer del Col·legi, 5, lo montamos casi solos y abrimos sin hacer ruido.
              El ruido lo hizo la gente. Y TikTok hizo el resto.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pull quote con nubes ── */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1800&q=80"
          alt="Burger smash en la plancha"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-smash-black/75" />
        {/* Cloud layer over the image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[5%] left-[5%] animate-cloud-drift-slow" opacity={0.5} width={300} />
          <Cloud className="absolute top-[5%] right-[5%] animate-cloud-drift" opacity={0.4} width={260} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-smash-cream text-center max-w-3xl leading-tight uppercase tracking-wide text-fire-glow">
            &ldquo;La costra dorada no se improvisa. Se consigue a 180 grados y sin miedo.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Values ── */}
      <section className="bg-smash-dark py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="label-gold block mb-5">Nuestros valores</span>
            <h2 className="font-display display-md text-smash-cream uppercase tracking-wide">Lo que nos hace SMASH</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Flame className="h-6 w-6" />,
                title: "Técnica Smash",
                description: "Aplastamos la carne en el momento. La costra caramelizada que se forma a 180 grados es nuestra firma. Sin esto, no somos nosotros.",
                accent: "fire" as const,
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Carne fresca cada día",
                description: "Sin congelados. Sin excusas. Cada mañana llega la carne fresca. Si se acaba, se acaba. La calidad no se negocia.",
                accent: "gold" as const,
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "Recetas propias",
                description: "Las salsas, las combinaciones, la selección de quesos. Todo es nuestro. No copiamos a nadie porque no queremos parecernos a nadie.",
                accent: "sky" as const,
              },
            ].map(({ icon, title, description, accent }) => {
              const bg = { fire: "bg-smash-fire/10 border-smash-fire/20 text-smash-fire", gold: "bg-smash-gold/10 border-smash-gold/20 text-smash-gold", sky: "bg-smash-sky/10 border-smash-sky/20 text-smash-sky" };
              return (
                <div key={title} className="surface-smoke p-8">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${bg[accent]}`}>
                    {icon}
                  </div>
                  <h3 className="font-display text-2xl text-smash-cream uppercase tracking-wide mb-3">{title}</h3>
                  <p className="text-smash-cream/45 leading-relaxed text-sm">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="relative bg-smash-black py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-smash-fire/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-smash-gold/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-sky block mb-5">La trayectoria</span>
            <h2 className="font-display display-md text-smash-cream uppercase tracking-wide">Paso a paso</h2>
          </div>
          
          <div className="relative">
            {/* Animated gradient line */}
            <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-smash-fire/80 via-smash-gold/60 to-smash-sky/50">
              <div className="absolute inset-0 bg-gradient-to-b from-smash-fire via-transparent to-transparent opacity-50 animate-pulse" />
            </div>
            
            <div className="space-y-12">
              {milestones.map(({ year, text }, idx) => (
                <div key={year} className={`relative ${idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  {/* Timeline node */}
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 -translate-y-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-smash-fire border-4 border-smash-black shadow-fire-lg z-20 relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-smash-fire animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`pl-20 sm:pl-0 ${idx % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"} group`}>
                    <div className="relative p-6 rounded-2xl border border-smash-border/50 bg-smash-smoke/40 backdrop-blur-sm hover:border-smash-fire/50 hover:bg-smash-smoke/60 transition-all duration-300 hover:shadow-fire-sm">
                      <span className="font-display text-3xl text-smash-fire tracking-wide mb-2 block">{year}</span>
                      <p className="text-smash-cream/65 leading-relaxed text-base">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 sky-bg opacity-80" />
        <div className="absolute inset-0 bg-smash-black/70" />
        {/* Clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "soft-light" }}>
          <Cloud className="absolute top-[5%] left-[-5%] animate-cloud-drift" opacity={0.8} width={360} />
          <Cloud className="absolute top-[10%] right-[-4%] animate-cloud-drift-slow" opacity={0.7} width={320} />
          <Cloud className="absolute bottom-[10%] left-[20%] animate-cloud-drift-mid" opacity={0.6} width={280} />
        </div>
        <div className="relative z-10">
          <span className="label-sky block mb-5">¿A qué esperas?</span>
          <h2 className="font-display display-md text-smash-cream uppercase tracking-wide mb-5">
            Ven a conocernos
          </h2>
          <p className="text-smash-cream/50 text-lg mb-10 font-light">
            La mejor manera de entender M SMASH es comiéndola.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu" className="btn-smash">
              <Flame className="h-4 w-4" /> Ver la carta
            </Link>
            <Link href="/contacto" className="btn-outline">
              Cómo llegar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
