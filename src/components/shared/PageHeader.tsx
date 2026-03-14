import Image from "next/image";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  /** Extra classes for the title (default: white) */
  titleClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  backgroundImage,
  children,
  titleClassName = "text-white",
}: PageHeaderProps) {
  return (
    <div className="relative mt-20 h-64 sm:h-80 md:h-96 flex items-end overflow-hidden">
      {/* Background image */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-virutes-red-dark via-virutes-red to-virutes-red-light" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-virutes-brown/80 via-virutes-brown/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h1 className={`font-display text-5xl sm:text-6xl leading-tight ${titleClassName}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-serif italic text-white/80 text-base sm:text-lg max-w-xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
