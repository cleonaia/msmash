import Image from "next/image";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  accent?: "fire" | "sky" | "gold";
}

export function PageHeader({
  title,
  subtitle,
  backgroundImage,
  children,
  accent = "fire",
}: PageHeaderProps) {
  const accentGradients = {
    fire: "from-smash-fire/80 via-smash-ember/40",
    sky:  "from-smash-sky/70 via-smash-sky/20",
    gold: "from-smash-gold/75 via-smash-gold/25",
  };
  const accentLabels = {
    fire: "text-smash-fire",
    sky:  "text-smash-sky",
    gold: "text-smash-gold",
  };

  return (
    <div className="relative mt-16 sm:mt-20 h-56 xs:h-64 sm:h-80 md:h-96 lg:h-[420px] flex items-end overflow-hidden">
      {backgroundImage ? (
        <Image src={backgroundImage} alt={title} fill className="object-cover scale-105 group-hover:scale-100" priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px" />
      ) : (
        <div className={`absolute inset-0 sky-bg`} />
      )}
      {/* Multiple gradient layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-smash-black/98 via-smash-black/60 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-t ${accentGradients[accent]} to-transparent opacity-60`} />
      
      {/* Fire/glow effect */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className={`absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-2xl sm:blur-3xl
          ${accent === "fire" ? "bg-smash-fire/40" : accent === "gold" ? "bg-smash-gold/30" : "bg-smash-sky/30"}
          animate-pulse`} />
        <div className={`absolute -bottom-8 sm:-bottom-10 -right-24 sm:-right-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-2xl sm:blur-3xl
          ${accent === "fire" ? "bg-smash-ember/30" : accent === "gold" ? "bg-smash-gold/20" : "bg-smash-sky/20"}
          animate-pulse`} style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="space-y-1 sm:space-y-2">
          <h1 className={`font-display text-[clamp(1.75rem,5vw,4rem)] sm:text-[clamp(2rem,6vw,5rem)] text-white leading-none uppercase tracking-widest drop-shadow-lg animate-fade-up`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-[clamp(0.65rem,1.5vw,0.95rem)] sm:text-[clamp(0.75rem,2vw,1rem)] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] ${accentLabels[accent]} opacity-90 animate-fade-up-100 drop-shadow`}>
              {subtitle}
            </p>
          )}
        </div>
        {children && <div className="mt-4 sm:mt-6 animate-fade-up-200">{children}</div>}
      </div>
    </div>
  );
}
