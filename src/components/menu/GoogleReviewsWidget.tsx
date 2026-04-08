'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export function GoogleReviewsWidget() {
  const googleMapsUrl = "https://www.google.com/maps/place/M+SMASH+BURGER/@41.5633,1.9900,17z/data=!3m1!4b1!4m6!3m5!1s0x12a49eab5c5c5c5d:0x5c5c5c5c5c5c5c5c!8m2!3d41.5633!4d1.9900!16s%2Fg%2F11j2q7m8q9";
  const reviewsUrl = "https://www.google.com/maps/place/M+SMASH+BURGER/@41.5633,1.9900,17z/reviews";

  return (
    <section className="w-full bg-smash-dark border-t border-b border-smash-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado izquierdo: Info y botones */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-smash-cream mb-3">
                Reseñas en Google
              </h2>
              <p className="text-smash-cream/60 text-lg">
                Mira lo que dicen nuestros clientes sobre M SMASH BURGER
              </p>
            </div>

            {/* Rating display */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-smash-turquoise">5.0</div>
                  <div className="flex gap-1 mt-2 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-smash-gold text-smash-gold"
                      />
                    ))}
                  </div>
                  <p className="text-smash-cream/50 text-sm mt-2">6 reseñas</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-smash inline-flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Ver Reseñas
              </Link>
              <Link
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-smash-turquoise text-smash-turquoise font-bold uppercase text-sm tracking-[0.2em] hover:bg-smash-turquoise hover:text-black transition-all inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Ubicación
              </Link>
            </div>
          </div>

          {/* Lado derecho: Embed de Google Maps */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="relative bg-smash-smoke border border-smash-border rounded-2xl overflow-hidden shadow-2xl">
                {/* Imagen placeholder con iframe embebido */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.9834455816434!2d1.987922!3d41.563320!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49eab5c5c5c5d%3A0x5c5c5c5c5c5c5c5c!2sM%20SMASH%20BURGER!5e0!3m2!1ses!2ses!4v1712600000000"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banner de confianza */}
        <div className="mt-12 bg-smash-smoke/40 border border-smash-border/50 rounded-xl p-6 text-center">
          <p className="text-smash-cream/70 text-sm">
            <span className="text-smash-turquoise font-bold">5.0 estrellas</span> en Google Maps basado en opiniones verificadas de clientes reales
          </p>
        </div>
      </div>
    </section>
  );
}
