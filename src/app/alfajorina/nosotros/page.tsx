import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star, Package } from "lucide-react";
import { alfajorinaValues, alfajorinaConfig } from "@/config/alfajorina";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const milestones = [
  {
    year: "2020",
    text: "Alfajorina nació en una cocina pequeña de Barcelona. La receta de la abuela argentina de su fundadora, perfeccionada durante generaciones, se convirtió en el punto de partida.",
  },
  {
    year: "2022",
    text: "El primer mercado de productores locales fue un éxito rotundo. Los alfajores se agotaron en menos de dos horas. Supimos que había algo especial.",
  },
  {
    year: "2023",
    text: "Abrimos nuestra primera tienda en el Eixample barcelonés. Las cajas regalo empezaron a llegar a toda España y comenzamos con los pedidos online.",
  },
  {
    year: "Hoy",
    text: "Seguimos elaborando cada alfajor a mano, con el mismo cariño del primer día. La receta no cambia porque no hace falta. Algunos clásicos son perfectos.",
  },
];

export default function AlfajorinaNosotrosPage() {
  return (
    <div className="min-h-screen bg-alfe-cream">

      {/* ── Hero ── */}
      <div className="relative mt-20 h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden bg-alfe-choco">
        <Image
          src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1920&q=80"
          alt="El obrador de Alfajorina"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alfe-choco/95 via-alfe-choco/40 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="alfe-label-caramel block mb-5">Nuestra historia</span>
          <h1 className="font-display text-[clamp(3rem,9vw,7rem)] text-alfe-cream uppercase tracking-wide leading-none mb-4 animate-fade-up">
            Nacidas para
            <br />
            <span className="text-caramel-glow">Endulzar</span>
          </h1>
          <p className="text-alfe-cream/65 text-lg sm:text-xl leading-relaxed font-light animate-fade-up-200 max-w-xl mx-auto">
            <span className="block">La receta manda, nosotras obedecemos.</span>
            <span className="block text-alfe-cream/50">Dulce de leche que abraza y chocolate que derrite.</span>
            <span className="block">No prometemos milagros, prometemos placer.</span>
            <span className="block text-alfe-dulce font-medium">Y cuando lo pruebas, ya no hay marcha atrás.</span>
          </p>
        </div>
      </div>

      {/* ── Story ── */}
      <section className="bg-alfe-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-choco block mb-5" style={{ color: "#C8833B" }}>Cómo empezó todo</span>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Una receta, una historia
            </h2>
          </ScrollReveal>
          <div className="space-y-6 text-alfe-choco-light leading-relaxed text-lg">
            <ScrollReveal>
              <p>
                &ldquo;¿Por qué en Barcelona no hay alfajores de verdad?&rdquo; Esa fue la pregunta que lo cambió todo. No había respuesta satisfactoria. Así que decidimos ser la respuesta.
              </p>
            </ScrollReveal>
            <ScrollReveal delay="d1">
              <p>
                Empezamos con la receta de la abuela: harina de maicena, mantequilla, huevos y azúcar glass. Mezclados con paciencia, horneados con amor, rellenos de dulce de leche casero que se cocina durante horas en la olla tradicional.
              </p>
            </ScrollReveal>
            <ScrollReveal delay="d2">
              <p>
                Cuando los vecinos del mercado empezaron a hacer cola antes de que abriéramos, supimos que teníamos algo especial. No solo una receta, sino una experiencia. Y eso, no se improvisa.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <div className="relative h-64 sm:h-80 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=1800&q=80"
          alt="Chocolate artesanal"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-alfe-choco/75" />
        <ScrollReveal className="relative z-10 text-center px-6 max-w-3xl">
          <p className="font-display text-[clamp(1.4rem,4vw,2.8rem)] text-alfe-cream uppercase tracking-wide leading-tight text-caramel-glow">
            &ldquo;El dulce de leche perfecto no se hace con prisa. Se hace con tiempo, con leche de verdad y con amor.&rdquo;
          </p>
        </ScrollReveal>
      </div>

      {/* ── Values ── */}
      <section className="bg-alfe-cream-dark py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="alfe-label-rosa block mb-5">Nuestros valores</span>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Lo que nos hace únicos
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alfajorinaValues.map(({ title, description }, i) => {
              const icons = [
                <Heart key="heart" className="h-6 w-6 text-alfe-rosa" />,
                <Star key="star" className="h-6 w-6 text-alfe-caramel" />,
                <Package key="package" className="h-6 w-6 text-alfe-verde" />,
              ];
              const borderColors = [
                "border-alfe-rosa/20 bg-alfe-rosa/5",
                "border-alfe-caramel/20 bg-alfe-caramel/5",
                "border-alfe-verde/20 bg-alfe-verde/5",
              ];
              return (
                <ScrollReveal key={title} delay={i === 0 ? "d1" : i === 1 ? "d2" : "d3"}>
                  <div className="surface-alfe p-8">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${borderColors[i]}`}>
                      {icons[i]}
                    </div>
                    <h3 className="font-display text-2xl text-alfe-choco uppercase tracking-wide mb-3">{title}</h3>
                    <p className="text-alfe-choco-light leading-relaxed text-sm">{description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-alfe-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="alfe-label-caramel block mb-5">La trayectoria</span>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] text-alfe-choco uppercase tracking-wide leading-none">
              Paso a paso
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-alfe-caramel/80 via-alfe-dulce/60 to-alfe-rosa/40" />

            <div className="space-y-12">
              {milestones.map(({ year, text }, idx) => (
                <ScrollReveal key={year} delay={idx === 0 ? "d1" : idx === 1 ? "d2" : idx === 2 ? "d3" : "d4"}>
                  <div className="relative pl-12 sm:pl-0">
                    {/* Node */}
                    <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 -translate-y-1">
                      <div className="w-8 h-8 rounded-full bg-alfe-caramel border-4 border-alfe-cream shadow-md z-20 relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`sm:w-[45%] ${idx % 2 === 0 ? "sm:ml-auto sm:pl-8" : "sm:mr-auto sm:pr-8 sm:text-right"}`}>
                      <div className="p-6 rounded-2xl border border-alfe-border bg-white shadow-sm hover:shadow-md hover:border-alfe-caramel/40 transition-all duration-300">
                        <span className="font-display text-3xl text-alfe-caramel tracking-wide mb-2 block">{year}</span>
                        <p className="text-alfe-choco-light leading-relaxed text-sm">{text}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-alfe-choco py-20 px-6 text-center">
        <ScrollReveal>
          <span className="alfe-label-caramel block mb-5">¿A qué esperas?</span>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-alfe-cream uppercase tracking-wide mb-5 leading-none">
            Ven a conocernos
          </h2>
          <p className="text-alfe-cream/50 text-base mb-10 font-light max-w-lg mx-auto">
            La mejor manera de conocer Alfajorina es probando uno. Y luego otro. Y luego la caja entera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/alfajorina/menu" className="btn-alfe-primary px-10 py-4">
              <Heart className="h-4 w-4" />
              Ver la carta
            </Link>
            <Link
              href="/alfajorina/contacto"
              className="inline-flex items-center gap-2 px-10 py-4 border border-alfe-cream/30 text-alfe-cream text-sm font-semibold rounded-full hover:bg-alfe-cream/10 transition-all duration-200"
            >
              Contactar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
