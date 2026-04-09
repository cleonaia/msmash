import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { hours, socialLinks, siteConfig, contactInfo, navLinks } from "@/config/site";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-smash-dark border-t border-smash-border">
      <div className="fire-divider" />
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-14 sm:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-10 sm:gap-12">

          {/* Brand block */}
          <div className="xs:col-span-2 lg:col-span-1">
            <p className="font-display text-3xl tracking-wider uppercase text-smash-cream">
              M SMASH
            </p>
            <p className="mt-1 xs:mt-1.5 text-[9px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.3em] text-smash-cream/25">
              {siteConfig.tagline} · {siteConfig.city}
            </p>
            <p className="mt-3 xs:mt-4 text-xs xs:text-sm text-smash-cream/40 max-w-[240px] leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-4 xs:mt-6 flex items-center gap-2">
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer"
                className="w-8 xs:w-9 h-8 xs:h-9 rounded-full bg-smash-smoke flex items-center justify-center text-smash-cream/40 hover:bg-green-500 hover:text-white transition-all duration-200 border border-smash-border"
                aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" className="h-3.5 xs:h-4 w-3.5 xs:w-4 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                className="w-8 xs:w-9 h-8 xs:h-9 rounded-full bg-smash-smoke flex items-center justify-center text-smash-cream/40 hover:bg-smash-fire hover:text-white transition-all duration-200 border border-smash-border"
                aria-label="Instagram">
                <Instagram className="h-3.5 xs:h-4 w-3.5 xs:w-4" />
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noreferrer"
                className="w-8 xs:w-9 h-8 xs:h-9 rounded-full bg-smash-smoke flex items-center justify-center text-smash-cream/40 hover:bg-smash-smoke-mid hover:text-white transition-all duration-200 border border-smash-border"
                aria-label="TikTok">
                <TikTokIcon className="h-3.5 xs:h-4 w-3.5 xs:w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="label-fire mb-4 xs:mb-5">Navegación</h4>
            <ul className="space-y-2 xs:space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs xs:text-sm text-smash-cream/40 hover:text-smash-fire transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="label-sky mb-4 xs:mb-5">Horarios</h4>
            <ul className="space-y-2">
              {hours.map(({ days, time, closed }) => (
                <li key={days} className="flex flex-col text-xs xs:text-sm leading-snug">
                  <span className={`font-semibold ${closed ? "text-smash-cream/25" : "text-smash-cream/60"}`}>{days}</span>
                    <span className={closed ? "text-smash-cream/20" : "text-smash-turquoise/80"}>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="label-gold mb-4 xs:mb-5">Contacto</h4>
            <ul className="space-y-3 xs:space-y-4">
              <li className="flex items-start gap-2 xs:gap-3 text-xs xs:text-sm text-smash-cream/40">
                <MapPin className="h-3.5 xs:h-4 w-3.5 xs:w-4 mt-0.5 text-smash-turquoise shrink-0" />
                <span className="text-smash-turquoise/80">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2 xs:gap-3 text-xs xs:text-sm text-smash-cream/40">
                <Phone className="h-3.5 xs:h-4 w-3.5 xs:w-4 text-smash-turquoise shrink-0" />
                <a href={contactInfo.phoneHref} className="hover:text-smash-turquoise transition-colors">{contactInfo.phonePretty}</a>
              </li>
              <li className="flex items-center gap-2 xs:gap-3 text-xs xs:text-sm text-smash-cream/40">
                <Mail className="h-3.5 xs:h-4 w-3.5 xs:w-4 text-smash-turquoise shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-smash-turquoise transition-colors">{contactInfo.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* QR codes */}
        <div className="mt-12 pt-10 border-t border-smash-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center">
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-smash-border shadow-sm">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fmsmashburger.page%2Fmenu&color=C4B5FD&bgcolor=111111&qzone=1"
                  alt="QR La Carta M SMASH"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-smash-cream/25 mb-0.5">Escanea para ver</p>
                <p className="font-display text-xl text-smash-cream leading-none tracking-widest uppercase">La Carta</p>
                <p className="text-xs text-smash-cream/25 mt-1">msmashburger.page/menu</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-smash-border shadow-sm">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fwww.instagram.com%2Fmsmashburguer%2F&color=C4B5FD&bgcolor=111111&qzone=1"
                  alt="QR Instagram M SMASH"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-smash-cream/25 mb-0.5">Síguenos en</p>
                <p className="font-display text-xl text-smash-cream leading-none tracking-widest uppercase">Instagram</p>
                <p className="text-xs text-smash-cream/25 mt-1">@msmashburguer</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-smash-border shadow-sm">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(siteConfig.googleReviewsUrl)}&color=C4B5FD&bgcolor=111111&qzone=1`}
                  alt="QR Reseñas Google M SMASH"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-smash-cream/25 mb-0.5">Escanea para</p>
                <p className="font-display text-xl text-smash-cream leading-none tracking-widest uppercase">Reseñas</p>
                <p className="text-xs text-smash-cream/25 mt-1">Google Maps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-smash-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-smash-cream/20 text-center sm:text-left">
            © M SMASH Burger. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-smash-cream/20">
            <Link href="/privacidad" className="hover:text-smash-turquoise transition-colors">Privacidad</Link>
            <Link href="/cookies" className="hover:text-smash-turquoise transition-colors">Cookies</Link>
            <Link href="/terminos" className="hover:text-smash-turquoise transition-colors">Términos</Link>
            <Link href="/alergenos" className="hover:text-smash-turquoise transition-colors">Alérgenos</Link>
            <Link href="/aviso-legal" className="hover:text-smash-turquoise transition-colors">Aviso legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
