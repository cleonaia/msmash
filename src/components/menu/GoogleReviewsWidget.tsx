'use client';

import Link from 'next/link';
import { Star, MapPin, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function GoogleReviewsWidget() {
  const googleMapsUrl = siteConfig.googleMapsUrl;
  const reviewsUrl = siteConfig.googleReviewsUrl;

  return (
    <section className="w-full bg-gradient-to-b from-smash-dark via-smash-dark to-smash-smoke border-t border-b border-smash-border py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Lado izquierdo: Info y botones */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <span className="label-gold block mb-3">Lo que opinan nuestros clientes</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-smash-cream mb-4">
                Reseñas en Google
              </h2>
              <p className="text-smash-cream/60 text-base sm:text-lg leading-relaxed">
                Mira lo que dicen nuestros clientes sobre M SMASH BURGER. Cada reseña confirma nuestro compromiso con la calidad.
              </p>
            </div>

            {/* Rating display - Enhanced */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 justify-center lg:justify-start">
              <div className="flex flex-col items-center">
                <div className="text-6xl sm:text-7xl font-bold text-smash-gold mb-2">5.0</div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-smash-gold text-smash-gold"
                    />
                  ))}
                </div>
                <p className="text-smash-turquoise font-bold text-sm sm:text-base">6 reseñas verificadas</p>
              </div>
            </div>

            {/* CTA Buttons - Improved */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-smash inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold uppercase tracking-wide hover:gap-3 transition-all duration-200"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                Dejar Reseña
              </Link>
              <Link
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-smash-turquoise text-smash-turquoise font-bold uppercase text-sm sm:text-base tracking-[0.2em] hover:bg-smash-turquoise hover:text-black transition-all duration-200 inline-flex items-center justify-center gap-2 group"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                Ubicación
              </Link>
            </div>
          </div>

          {/* Lado derecho: Embed de Google Maps */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xl">
              <div className="relative bg-smash-smoke border-2 border-smash-turquoise/30 rounded-2xl overflow-hidden shadow-2xl hover:border-smash-turquoise/60 transition-all duration-300">
                <iframe
                  src={siteConfig.googleMapsEmbed}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[320px] sm:h-[360px] lg:h-[400px]"
                  title="Ubicación M SMASH en Google Maps"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banner de confianza - Mejorado */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-smash-smoke/60 via-smash-smoke/40 to-smash-smoke/60 border border-smash-gold/20 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm hover:border-smash-gold/40 transition-all duration-200">
          <p className="text-smash-cream/80 text-sm sm:text-base leading-relaxed font-medium">
            <span className="text-smash-gold font-bold text-lg">★★★★★ 5.0 estrellas</span> en Google Maps<br />
            <span className="text-smash-cream/60 text-xs sm:text-sm">Basado en opiniones verificadas de clientes reales</span>
          </p>
        </div>
      </div>
    </section>
  );
}
