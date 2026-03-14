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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-virutes-cream border-t border-virutes-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-4xl text-virutes-red hover:opacity-80 transition-opacity">
              Virutes
            </Link>
            <p className="mt-1.5 text-base text-virutes-brown-mid font-serif italic">
              {siteConfig.tagline} · {siteConfig.city}
            </p>
            <p className="mt-4 text-base text-virutes-brown/70 max-w-[240px] leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-virutes-brown/10 flex items-center justify-center text-virutes-brown/60 hover:bg-virutes-red hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-virutes-brown/10 flex items-center justify-center text-virutes-brown/60 hover:bg-virutes-brown hover:text-white transition-all duration-200"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-virutes-brown/10 flex items-center justify-center text-virutes-brown/60 hover:bg-[#25D366] hover:text-white transition-all duration-200"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="section-label mb-5">Navegació</h4>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-base text-virutes-brown/70 hover:text-virutes-red transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reservas" className="text-base text-virutes-brown/70 hover:text-virutes-red transition-colors">
                  Reserves
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaris */}
          <div>
            <h4 className="section-label mb-5">Horaris</h4>
            <ul className="space-y-2">
              {hours.map(({ days, time, closed }) => (
                <li key={days} className="flex flex-col text-base leading-snug">
                  <span className={`font-medium ${closed ? "text-virutes-red" : "text-virutes-brown"}`}>
                    {days}
                  </span>
                  <span className={closed ? "text-virutes-red/70" : "text-virutes-brown/60"}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="section-label mb-5">Contacte</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-base text-virutes-brown/70">
                <MapPin className="h-4 w-4 mt-0.5 text-virutes-red shrink-0" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3 text-base text-virutes-brown/70">
                <Phone className="h-4 w-4 text-virutes-red shrink-0" />
                <a href={contactInfo.phoneHref} className="hover:text-virutes-red transition-colors">
                  {contactInfo.phonePretty}
                </a>
              </li>
              <li className="flex items-center gap-3 text-base text-virutes-brown/70">
                <Mail className="h-4 w-4 text-virutes-red shrink-0" />
                <a href={`mailto:${socialLinks.email}`} className="hover:text-virutes-red transition-colors">
                  {socialLinks.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── QR codes strip ── */}
        <div className="mt-12 pt-10 border-t border-virutes-border">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-virutes-border shadow-sm">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fvirutes.com%2Fmenu&color=3E2723&bgcolor=F5ECD7&qzone=1"
                  alt="QR La Carta"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-virutes-brown/40 mb-0.5">Escaneja per veure</p>
                <p className="font-serif italic text-virutes-brown text-lg leading-none">La Carta</p>
                <p className="text-xs text-virutes-brown/50 mt-1">virutes.com/menu</p>
              </div>
            </div>
            <div className="h-12 w-px bg-virutes-border hidden sm:block" />
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-virutes-border shadow-sm">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fvirutes.com%2Freserves&color=C0392B&bgcolor=FDFAF4&qzone=1"
                  alt="QR Reserves"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-virutes-brown/40 mb-0.5">Escaneja per</p>
                <p className="font-serif italic text-virutes-brown text-lg leading-none">Reservar taula</p>
                <p className="text-xs text-virutes-brown/50 mt-1">virutes.com/reserves</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-virutes-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-virutes-brown/40 text-center sm:text-left">
            © 2026 Virutes Focacceria Artesanal. Tots els drets reservats.
          </p>
          <div className="flex items-center gap-6 text-xs text-virutes-brown/40">
            <Link href="/privacitat"   className="hover:text-virutes-red transition-colors">Política de privacitat</Link>
            <Link href="/cookies"      className="hover:text-virutes-red transition-colors">Cookies</Link>
            <Link href="/avis-legal"   className="hover:text-virutes-red transition-colors">Avís legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
