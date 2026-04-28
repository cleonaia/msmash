import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import {
  alfajorinaHours,
  alfajorinaLinks,
  alfajorinaConfig,
  alfajorinaContact,
  alfajorinaNavLinks,
} from "@/config/alfajorina";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}

export function AlfajorinaFooter() {
  return (
    <footer className="bg-alfe-choco text-alfe-cream/80">
      <div className="alfe-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">

          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-3xl tracking-wider uppercase text-alfe-cream">
              Alfajorina
            </p>
            <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-alfe-cream/35">
              {alfajorinaConfig.tagline} · {alfajorinaConfig.city}
            </p>
            <p className="mt-4 text-sm text-alfe-cream/40 max-w-[240px] leading-relaxed">
              {alfajorinaConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={alfajorinaLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-alfe-choco-mid/60 flex items-center justify-center text-alfe-cream/40 hover:bg-green-600 hover:text-white transition-all duration-200 border border-alfe-cream/10"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={alfajorinaLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-alfe-choco-mid/60 flex items-center justify-center text-alfe-cream/40 hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white transition-all duration-200 border border-alfe-cream/10"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={alfajorinaLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-alfe-choco-mid/60 flex items-center justify-center text-alfe-cream/40 hover:bg-alfe-choco-light hover:text-white transition-all duration-200 border border-alfe-cream/10"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="alfe-label-caramel mb-5">Navegación</h4>
            <ul className="space-y-3">
              {alfajorinaNavLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-alfe-cream/40 hover:text-alfe-dulce transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="alfe-label-choco mb-5" style={{ color: "#E8B46A" }}>Horarios</h4>
            <ul className="space-y-2.5">
              {alfajorinaHours.map(({ days, time, closed }) => (
                <li key={days} className="flex flex-col text-sm leading-snug">
                  <span className={`font-semibold ${closed ? "text-alfe-cream/25" : "text-alfe-cream/60"}`}>
                    {days}
                  </span>
                  <span className={closed ? "text-alfe-cream/20" : "text-alfe-dulce/80"}>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="alfe-label-rosa mb-5">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-alfe-cream/40">
                <MapPin className="h-4 w-4 mt-0.5 text-alfe-caramel shrink-0" />
                <span className="text-alfe-cream/70">{alfajorinaConfig.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-alfe-cream/40">
                <Phone className="h-4 w-4 text-alfe-caramel shrink-0" />
                <a href={alfajorinaContact.phoneHref} className="hover:text-alfe-dulce transition-colors">
                  {alfajorinaContact.phonePretty}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-alfe-cream/40">
                <Mail className="h-4 w-4 text-alfe-caramel shrink-0" />
                <a href={`mailto:${alfajorinaContact.email}`} className="hover:text-alfe-dulce transition-colors">
                  {alfajorinaContact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* QR codes */}
        <div className="mt-14 pt-10 border-t border-alfe-cream/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-2xl">
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-alfe-cream/20 shadow-sm">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent("https://alfajorina.com/menu")}&color=2E1810&bgcolor=FFFFFF&qzone=1`}
                  alt="QR La Carta Alfajorina"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-alfe-cream/25 mb-0.5">
                  Escanea para ver
                </p>
                <p className="font-display text-xl text-alfe-cream leading-none tracking-widest uppercase">
                  La Carta
                </p>
                <p className="text-xs text-alfe-cream/25 mt-1">alfajorina.com/menu</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-2 bg-white rounded-xl border border-alfe-cream/20 shadow-sm">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(alfajorinaLinks.instagram)}&color=C8833B&bgcolor=FFFFFF&qzone=1`}
                  alt="QR Instagram Alfajorina"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-alfe-cream/25 mb-0.5">
                  Síguenos en
                </p>
                <p className="font-display text-xl text-alfe-cream leading-none tracking-widest uppercase">
                  Instagram
                </p>
                <p className="text-xs text-alfe-cream/25 mt-1">@alfajorina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-alfe-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-alfe-cream/20 text-center sm:text-left">
            © Alfajorina. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-alfe-cream/20">
            <Link href="/privacidad" className="hover:text-alfe-dulce transition-colors">Privacidad</Link>
            <Link href="/cookies" className="hover:text-alfe-dulce transition-colors">Cookies</Link>
            <Link href="/terminos" className="hover:text-alfe-dulce transition-colors">Términos</Link>
            <Link href="/aviso-legal" className="hover:text-alfe-dulce transition-colors">Aviso legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
