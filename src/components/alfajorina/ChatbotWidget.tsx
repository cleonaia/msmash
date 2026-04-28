"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X, Cookie } from "lucide-react";
import { alfajorinaProducts } from "@/features/alfajorina/data/menu";
import { alfajorinaContact, alfajorinaConfig, alfajorinaLinks, alfajorinaHours } from "@/config/alfajorina";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

type Reply = {
  text: string;
  cta?: { label: string; href: string; external?: boolean };
};

type QuickPanel = "clasicos" | "especiales" | "cajas" | null;

const quickPrompts = [
  "Ingredientes",
  "Ver carta",
  "Alfajores",
  "Alérgenos",
  "Hacer pedido",
  "Horario",
  "¿Dónde estáis?",
];

const clasicoNames = alfajorinaProducts
  .filter((p) => p.category === "clasicos")
  .map((p) => p.name);

const especialNames = alfajorinaProducts
  .filter((p) => p.category === "especiales")
  .map((p) => p.name);

const cajaNames = alfajorinaProducts
  .filter((p) => p.category === "cajas")
  .map((p) => p.name);

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildHoursText() {
  const lines = alfajorinaHours.map((h) => `${h.days}: ${h.time}`);
  return ["Nuestros horarios:", ...lines].join("\n");
}

function getFallbackReply(raw: string): Reply {
  const text = normalize(raw);

  if (/(hola|buenas|hey|hello)/.test(text)) {
    return {
      text: "¡Hola! Soy la asistente de Alfajorina 🍫 Te ayudo con nuestra carta, ingredientes, pedidos, horarios y más.",
    };
  }

  if (/(horario|abierto|cerrado|hora)/.test(text)) {
    return { text: buildHoursText() };
  }

  if (/(carta|menu|alfajores?|precio|producto)/.test(text)) {
    return {
      text: "Puedes ver toda nuestra carta en la sección de productos. Tenemos clásicos, especiales, cajas regalo y tortas. ¿Qué te apetece?",
      cta: { label: "Ver la carta", href: "/alfajorina/menu" },
    };
  }

  if (/(pedido|pedir|delivery|encargo|envio)/.test(text)) {
    return {
      text: "Perfecto. Puedes hacer tu pedido online desde la web o contactarnos directamente por WhatsApp para pedidos personalizados o eventos.",
      cta: { label: "Ir a pedidos", href: "/alfajorina/pedidos" },
    };
  }

  if (/(alergeno|alergenos|gluten|lacteo|huevo|sin gluten|intolerancia)/.test(text)) {
    return {
      text: "La mayoría de nuestros alfajores contienen gluten, lácteos y huevos. Para pedidos sin gluten o adaptados, escríbenos y lo preparamos especialmente para ti.",
      cta: { label: "Contactar", href: "/alfajorina/contacto" },
    };
  }

  if (/(ingrediente|lleva|composicion|receta)/.test(text)) {
    return {
      text: "Todos nuestros alfajores se elaboran con harina de maicena, mantequilla, huevos, azúcar glass y dulce de leche casero. La cobertura puede ser chocolate negro 70%, chocolate con leche, coco rallado o chocolate blanco.",
      cta: { label: "Ver carta completa", href: "/alfajorina/menu" },
    };
  }

  if (/(donde|direccion|ubicacion|mapa|como llegar|tienda)/.test(text)) {
    return {
      text: `Nos encontramos en ${alfajorinaConfig.address}. ¡Te esperamos!`,
      cta: { label: "Abrir en Google Maps", href: alfajorinaConfig.googleMapsUrl, external: true },
    };
  }

  if (/(telefono|llamar|contacto|email|correo|whatsapp|escribir)/.test(text)) {
    return {
      text: `Teléfono: ${alfajorinaContact.phonePretty}. Email: ${alfajorinaContact.email}. O escríbenos directamente por WhatsApp.`,
      cta: { label: "Abrir WhatsApp", href: alfajorinaLinks.whatsapp, external: true },
    };
  }

  if (/(regalo|caja|pack|evento|celebracion|empresa)/.test(text)) {
    return {
      text: "Tenemos cajas regalo preciosas: de 6, 12 y 24 alfajores con presentación artesanal y posibilidad de personalización. Perfectas para cualquier ocasión.",
      cta: { label: "Ver cajas regalo", href: "/alfajorina/menu" },
    };
  }

  if (/(torta|tarta|cumpleanos|encargo especial)/.test(text)) {
    return {
      text: "Nuestra Torta Alfajorina es preciosa y deliciosa. Preparada por encargo para 8-10 personas. Escríbenos con al menos 3 días de antelación.",
      cta: { label: "Contactar para encargo", href: "/alfajorina/contacto" },
    };
  }

  if (/(instagram|insta|tiktok|redes|follow|seguir)/.test(text)) {
    return {
      text: "Síguenos en Instagram y TikTok como @alfajorina para ver todas las novedades, recetas y detrás de cámaras.",
      cta: { label: "Ver Instagram", href: alfajorinaLinks.instagram, external: true },
    };
  }

  // Check for specific product name
  const matchedProduct = alfajorinaProducts.find((p) =>
    normalize(p.name).includes(text) || text.includes(normalize(p.name))
  );
  if (matchedProduct) {
    const allergenText =
      matchedProduct.allergens.length > 0
        ? `Alérgenos: ${matchedProduct.allergens.join(", ")}.`
        : "Sin alérgenos principales declarados.";
    return {
      text: `${matchedProduct.name} — ${matchedProduct.description}\nPrecio: ${matchedProduct.price.toFixed(2)}€. ${allergenText}`,
      cta: { label: "Ver carta completa", href: "/alfajorina/menu" },
    };
  }

  return {
    text: "Puedo ayudarte con nuestra carta, ingredientes, alérgenos, pedidos, cajas regalo, encargos especiales, horarios y ubicación. ¿Qué necesitas?",
  };
}

export function AlfajorinaChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<QuickPanel>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "¡Hola! Soy la asistente de Alfajorina 🍫 Pregúntame por nuestros alfajores, ingredientes, pedidos, cajas regalo o dónde encontrarnos.",
    },
  ]);
  const [lastCta, setLastCta] = useState<Reply["cta"]>();
  const nextId = useRef(2);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  // Hide chatbot in admin/auth areas
  const shouldRender =
    !pathname ||
    !(
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/cliente")
    );

  if (!shouldRender) return null;

  const panelItems =
    activePanel === "clasicos"
      ? clasicoNames
      : activePanel === "especiales"
        ? especialNames
        : activePanel === "cajas"
          ? cajaNames
          : [];

  const handleSend = (raw: string) => {
    const value = raw.trim();
    if (!value || isLoading) return;

    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text: value }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const reply = getFallbackReply(value);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, from: "bot", text: reply.text },
      ]);
      setLastCta(reply.cta);
      setIsLoading(false);
    }, 600);
  };

  const categoryButtons: { id: QuickPanel; label: string }[] = [
    { id: "clasicos", label: "Clásicos" },
    { id: "especiales", label: "Especiales" },
    { id: "cajas", label: "Cajas" },
  ];

  return (
    <>
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asistente de Alfajorina"
          className="fixed left-2 right-2 bottom-20 z-[60] h-[calc(100dvh-7rem)] sm:left-auto sm:right-6 sm:bottom-24 sm:w-[min(24rem,calc(100vw-3rem))] sm:h-[min(38rem,calc(100dvh-8rem))] rounded-3xl border border-alfe-border bg-alfe-cream shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <header className="relative px-4 py-3 border-b border-alfe-border bg-gradient-to-r from-alfe-caramel/15 via-alfe-cream to-alfe-rosa/10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-alfe-caramel text-white flex items-center justify-center shadow-md">
                  <Cookie className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-xl leading-none uppercase tracking-wide text-alfe-choco">
                    Alfajorina
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-alfe-choco-light">
                    Asistente online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-alfe-border text-alfe-choco-light hover:text-alfe-choco hover:border-alfe-caramel/60 transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-alfe-cream"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[90%] ${msg.from === "bot" ? "mr-auto" : "ml-auto"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "bot"
                      ? "bg-white text-alfe-choco border border-alfe-border shadow-sm"
                      : "ml-auto bg-alfe-caramel text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm bg-white text-alfe-choco-light border border-alfe-border shadow-sm">
                Escribiendo...
              </div>
            )}
          </div>

          {/* Footer input area */}
          <div className="px-4 py-3 border-t border-alfe-border bg-white space-y-3 shrink-0">
            {/* Category buttons */}
            <div className="grid grid-cols-3 gap-2">
              {categoryButtons.map((btn) => {
                const active = activePanel === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setActivePanel((c) => (c === btn.id ? null : btn.id))}
                    disabled={isLoading}
                    className={`text-[10px] px-2 py-2 rounded-full border font-bold uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? "border-alfe-caramel/70 bg-alfe-caramel/15 text-alfe-choco"
                        : "border-alfe-border text-alfe-choco-light hover:text-alfe-choco hover:border-alfe-caramel/40"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Panel items */}
            {activePanel && panelItems.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-alfe-border bg-alfe-cream-dark/60 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-alfe-choco-light/60">
                  {activePanel === "clasicos"
                    ? "Clásicos"
                    : activePanel === "especiales"
                      ? "Especiales"
                      : "Cajas regalo"}
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                  {panelItems.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => void handleSend(`${name} ¿qué lleva y alérgenos?`)}
                      disabled={isLoading}
                      className="text-[10px] px-2.5 py-1.5 rounded-full border border-alfe-caramel/30 bg-alfe-caramel/10 text-alfe-choco hover:border-alfe-caramel/70 hover:bg-alfe-caramel/20 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto pr-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[10px] px-2.5 py-1.5 rounded-full border border-alfe-border text-alfe-choco-light hover:text-alfe-choco hover:border-alfe-caramel/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Last CTA */}
            {lastCta && (
              <div>
                {lastCta.external ? (
                  <a
                    href={lastCta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-alfe-caramel hover:text-alfe-choco-mid transition-colors"
                  >
                    {lastCta.label}
                  </a>
                ) : (
                  <Link
                    href={lastCta.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-alfe-caramel hover:text-alfe-choco-mid transition-colors"
                  >
                    {lastCta.label}
                  </Link>
                )}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                disabled={isLoading}
                placeholder="Escribe: ingredientes, pedidos, horario..."
                className="flex-1 h-11 rounded-xl border border-alfe-border bg-alfe-cream-dark/30 px-3 text-sm text-alfe-text placeholder:text-alfe-choco-light/40 focus:outline-none focus:border-alfe-caramel/70"
              />
              <button
                type="button"
                onClick={() => handleSend(input)}
                disabled={isLoading}
                className="w-11 h-11 rounded-xl bg-alfe-caramel text-white hover:bg-alfe-choco-mid transition-colors flex items-center justify-center shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-4 sm:right-6 bottom-24 z-[55] h-14 px-5 rounded-full border border-alfe-caramel/60 bg-white text-alfe-caramel hover:text-white hover:bg-alfe-caramel transition-all duration-200 flex items-center gap-2 shadow-lg"
        aria-label="Abrir asistente"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          {isOpen ? "Cerrar" : "Ayuda"}
        </span>
      </button>
    </>
  );
}
