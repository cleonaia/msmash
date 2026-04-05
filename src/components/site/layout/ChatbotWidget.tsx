"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { menuItems } from "@/features/menu/data/menu";
import { contactInfo, hours, siteConfig, socialLinks } from "@/config/site";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  card?: {
    title: string;
    subtitle: string;
    price: string;
    facts: string[];
    tags: string[];
    cta?: string;
  };
};

type Reply = {
  text: string;
  cta?: { label: string; href: string; external?: boolean };
};

type ChatbotApiResponse = {
  text?: string;
  card?: Message["card"];
};

type QuickPanel = "burgers" | "starters" | "drinks" | null;

const quickPrompts = [
  "Horario",
  "Ver carta",
  "Hamburguesas",
  "Alérgenos",
  "Hacer pedido",
  "Reservar",
  "Donde estais",
];

const burgerQuickPrompts = menuItems
  .filter((item) => item.category === "burguers")
  .map((item) => item.name);

const beverageQuickPrompts = menuItems
  .filter((item) => item.category === "bebidas")
  .map((item) => item.name);

const starterQuickPrompts = menuItems
  .filter((item) => item.category === "entrantres")
  .map((item) => item.name);

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildOpeningHoursText() {
  const lines = hours.map((item) => `${item.days}: ${item.time}`);
  return ["Nuestros horarios:", ...lines].join("\n");
}

function getFallbackReply(raw: string): Reply {
  const text = normalize(raw);

  if (/(hola|buenas|hey|hello)/.test(text)) {
    return {
      text: "Hola. Soy el asistente de M SMASH. Te ayudo con carta, pedidos, reservas, direccion y contacto.",
    };
  }

  if (/(horario|abierto|cerrado|hora)/.test(text)) {
    return {
      text: buildOpeningHoursText(),
    };
  }

  if (/(carta|menu|hamburguesa|burger|precios?)/.test(text)) {
    return {
      text: "Puedes ver toda la carta actualizada en la seccion menu. Si quieres, te digo una hamburguesa concreta con precio y alérgenos.",
      cta: { label: "Ir a la carta", href: "/menu" },
    };
  }

  if (/(pedido|pedir|delivery|domicilio|takeaway|llevar)/.test(text)) {
    return {
      text: "Perfecto. Puedes hacer tu pedido online desde la web o escribirnos por WhatsApp para soporte rapido.",
      cta: { label: "Ir a pedidos", href: "/pedidos" },
    };
  }

  if (/(reserva|reservar|mesa)/.test(text)) {
    return {
      text: "Si quieres reservar, entra en la seccion de reservas y te confirmamos cuanto antes.",
      cta: { label: "Ir a reservas", href: "/reservas" },
    };
  }

  if (/(donde|direccion|ubicacion|mapa|como llegar)/.test(text)) {
    return {
      text: `Estamos en ${siteConfig.address}.`,
      cta: { label: "Abrir en Google Maps", href: siteConfig.googleMapsUrl, external: true },
    };
  }

  if (/(telefono|llamar|contacto|email|correo|whatsapp)/.test(text)) {
    return {
      text: `Telefono: ${contactInfo.phonePretty}. Email: ${contactInfo.email}.`,
      cta: { label: "Abrir WhatsApp", href: socialLinks.whatsapp, external: true },
    };
  }

  if (/(instagram|insta|tiktok|redes)/.test(text)) {
    return {
      text: "Nos encuentras en Instagram y TikTok como @msmashburguer.",
      cta: { label: "Ver TikTok", href: socialLinks.tiktok, external: true },
    };
  }

  return {
    text: "Ahora mismo te puedo ayudar con horario, carta, hamburguesas concretas, alérgenos, pedidos, reservas, ubicacion y contacto. Dime que necesitas.",
  };
}

export function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<QuickPanel>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
        text: "Hola. Soy tu asistente M SMASH. Preguntame por hamburguesas, alérgenos, pedidos, reservas o la carta.",
    },
  ]);
  const [lastCta, setLastCta] = useState<Reply["cta"]>();
  const nextId = useRef(2);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const categoryButtons = [
    { id: "burgers" as const, label: "Hamburguesas", tone: "fire" },
    { id: "starters" as const, label: "Entrantes", tone: "gold" },
    { id: "drinks" as const, label: "Bebidas", tone: "sky" },
  ];

  // Todos los hooks ANTES del condicional
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const shouldRender = useMemo(() => {
    if (!pathname) return true;
    return !(pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/cliente"));
  }, [pathname]);

  if (!shouldRender) return null;

  const panelItems =
    activePanel === "burgers"
      ? burgerQuickPrompts
      : activePanel === "starters"
        ? starterQuickPrompts
        : activePanel === "drinks"
          ? beverageQuickPrompts
          : [];

  const panelToneClasses =
    activePanel === "burgers"
      ? "border-smash-fire/30 bg-smash-fire/10 text-smash-cream/85 hover:border-smash-fire/70 hover:text-white"
      : activePanel === "starters"
        ? "border-smash-gold/30 bg-smash-gold/10 text-smash-cream/85 hover:border-smash-gold/70 hover:text-white"
        : "border-smash-sky/30 bg-smash-sky/10 text-smash-cream/85 hover:border-smash-sky/70 hover:text-white";

  const handleSend = async (raw: string) => {
    const value = raw.trim();
    if (!value || isLoading) return;

    const history = messages.slice(-8).map((message) => ({ from: message.from, text: message.text }));
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text: value }]);
    setInput("");
    setIsLoading(true);

    let botText = "";
    let botCard: Message["card"] | undefined;

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: value, history }),
      });

      if (response.ok) {
        const data = (await response.json()) as ChatbotApiResponse;
        if (typeof data.text === "string") {
          botText = data.text.trim();
        }
        botCard = data.card;
      }
    } catch {
      botText = "";
    }

    if (!botText) {
      botText = getFallbackReply(value).text;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nextId.current++,
        from: "bot",
        text: botText,
        card: botCard,
      },
    ]);
    setLastCta(getFallbackReply(value).cta);
    setIsLoading(false);
  };

  return (
    <>
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asistente de M SMASH"
          className="fixed left-2 right-2 bottom-20 z-[60] h-[calc(100dvh-7rem)] sm:left-auto sm:right-6 sm:bottom-24 sm:w-[min(24rem,calc(100vw-3rem))] sm:h-[min(38rem,calc(100dvh-8rem))] rounded-3xl border border-smash-border/60 bg-smash-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
        >
          <header className="relative px-3 sm:px-4 py-3 border-b border-smash-border/50 bg-gradient-to-r from-smash-fire/20 via-smash-black/50 to-smash-sky/10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-smash-fire/90 text-white flex items-center justify-center shadow-fire-sm">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg sm:text-xl leading-none uppercase tracking-wide text-white">M SMASH BOT</p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-smash-cream/55">Online ahora</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-smash-border/60 text-smash-cream/70 hover:text-white hover:border-smash-fire/60 transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-gradient-to-b from-smash-black to-smash-dark">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-[90%] ${message.from === "bot" ? "mr-auto" : "ml-auto"}`}>
                {message.card ? (
                  <div className="rounded-3xl border border-smash-fire/25 bg-gradient-to-br from-smash-smoke to-smash-dark p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-smash-turquoise/75 font-black">Ficha premium</p>
                        <h3 className="font-display text-xl uppercase tracking-wide text-white leading-none mt-1">
                          {message.card.title}
                        </h3>
                        <p className="text-xs text-smash-cream/45 mt-1">{message.card.subtitle}</p>
                      </div>
                      <span className="font-display text-2xl text-smash-fire leading-none whitespace-nowrap">
                        {message.card.price}
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-3">
                      {message.card.facts.map((fact) => (
                        <p key={fact} className="text-sm text-smash-cream/80 leading-relaxed">
                          {fact}
                        </p>
                      ))}
                    </div>

                    {message.card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-smash-black/60 border border-smash-border/60 text-smash-cream/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {message.card.cta && (
                      <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-smash-fire/80 font-black">
                        {message.card.cta}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                      message.from === "bot"
                        ? "bg-smash-smoke text-smash-cream/90 border border-smash-border/50"
                        : "ml-auto bg-smash-fire text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed bg-smash-smoke text-smash-cream/80 border border-smash-border/50">
                Escribiendo...
              </div>
            )}
          </div>

          <div className="px-3 sm:px-4 py-3 border-t border-smash-border/50 bg-smash-black/95 space-y-3 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {categoryButtons.map((button) => {
                const active = activePanel === button.id;
                return (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => setActivePanel((current) => (current === button.id ? null : button.id))}
                    disabled={isLoading}
                    className={`min-w-0 truncate text-[10px] sm:text-[11px] px-2 sm:px-3 py-2 rounded-full border font-bold uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? button.id === "burgers"
                          ? "border-smash-fire/70 bg-smash-fire/20 text-white"
                          : button.id === "starters"
                            ? "border-smash-gold/70 bg-smash-gold/20 text-white"
                            : "border-smash-sky/70 bg-smash-sky/20 text-white"
                        : "border-smash-border/70 text-smash-cream/70 hover:text-white hover:border-smash-fire/60"
                    }`}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>

            {activePanel && panelItems.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-smash-border/50 bg-smash-dark/60 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-smash-cream/35">
                  {activePanel === "burgers" ? "Burgers" : activePanel === "starters" ? "Entrantes" : "Bebidas"}
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                  {panelItems.map((itemName) => (
                    <button
                      key={itemName}
                      type="button"
                      onClick={() => void handleSend(`${itemName} qué lleva y alérgenos`)}
                      disabled={isLoading}
                      className={`text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 rounded-full border transition-colors ${panelToneClasses}`}
                    >
                      {itemName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 rounded-full border border-smash-border/70 text-smash-cream/75 hover:text-white hover:border-smash-fire/70 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {lastCta && (
              <div>
                {lastCta.external ? (
                  <a
                    href={lastCta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-smash-fire hover:text-smash-ember transition-colors"
                  >
                    {lastCta.label}
                  </a>
                ) : (
                  <Link
                    href={lastCta.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-smash-fire hover:text-smash-ember transition-colors"
                  >
                    {lastCta.label}
                  </Link>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSend(input);
                  }
                }}
                disabled={isLoading}
                placeholder="Escribe: horario, carta, pedido..."
                className="flex-1 h-11 rounded-xl border border-smash-border/70 bg-smash-dark px-3 text-sm text-smash-cream placeholder:text-smash-cream/35 focus:outline-none focus:border-smash-fire/70"
              />
              <button
                type="button"
                onClick={() => void handleSend(input)}
                disabled={isLoading}
                className="w-full sm:w-11 h-11 rounded-xl bg-smash-fire text-white hover:bg-smash-ember transition-colors flex items-center justify-center"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-4 sm:right-6 bottom-24 sm:bottom-24 z-[55] h-14 px-5 rounded-full border border-smash-fire/60 bg-smash-black/90 backdrop-blur-md text-smash-fire hover:text-white hover:bg-smash-fire transition-all duration-200 flex items-center gap-2 shadow-lg"
        aria-label="Abrir chatbot"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Chat</span>
      </button>
    </>
  );
}