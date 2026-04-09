import { NextResponse } from "next/server";
import { contactInfo, hours, siteConfig, socialLinks } from "@/config/site";
import { menuItems, type MenuItem, type Allergen } from "@/features/menu/data/menu";

type HistoryItem = {
  from: "user" | "bot";
  text: string;
};

type RequestBody = {
  message?: unknown;
  history?: unknown;
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type MenuReply = {
  title: string;
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

type ReplyPayload = {
  text: string;
  card?: MenuReply["card"];
  cta?: { label: string; href: string; external?: boolean };
};

const allergenLabels: Record<Allergen, string> = {
  apio: "Apio",
  crustaceos: "Crustáceos",
  huevos: "Huevos",
  pescado: "Pescado",
  gluten: "Gluten",
  lacteos: "Lácteos",
  mostaza: "Mostaza",
  soja: "Soja",
};

const burgerItems = menuItems.filter((item) => item.category === "burguers");
const drinkItems = menuItems.filter((item) => item.category === "bebidas");
const starterItems = menuItems.filter((item) => item.category === "entrantres");

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

function formatAllergens(allergens: Allergen[]) {
  if (allergens.length === 0) return "sin alérgenos declarados";
  return allergens.map((allergen) => allergenLabels[allergen]).join(", ");
}

function getMenuItemReply(item: MenuItem): MenuReply {
  const tags = [item.badge, ...item.allergens.map((allergen) => allergenLabels[allergen])].filter(Boolean) as string[];

  return {
    title: item.name,
    text: [
      `${item.name}`,
      `Precio: ${item.price.toFixed(2)}€`,
      `Contiene: ${item.description}`,
      `Alérgenos: ${formatAllergens(item.allergens)}`,
    ].join(" "),
    card: {
      title: item.name,
      subtitle: item.category === "burguers" ? "Burger premium" : item.category === "bebidas" ? "Bebida" : item.category === "entrantres" ? "Entrante" : "Producto",
      price: `${item.price.toFixed(2)}€`,
      facts: [
        item.description,
        `Alérgenos: ${formatAllergens(item.allergens)}`,
      ],
      tags,
      cta: item.category === "burguers" ? "Pregunta por otra burger" : undefined,
    },
  };
}

function getMenuReply(raw: string): MenuReply | null {
  const matchedItem = findMenuItemInText(raw);
  if (matchedItem) {
    return getMenuItemReply(matchedItem);
  }

  const text = normalize(raw);

  if (/(burguer|hamburguesa|burger|burgers|hamburguesas)/.test(text)) {
    return {
      title: "Hamburguesas",
      text: buildCategoryReply(burgerItems, "hamburguesas"),
    };
  }

  if (/(bebida|bebidas|refresco|refrescos|agua|cola|soda|limon)/.test(text)) {
    return {
      title: "Bebidas",
      text: buildCategoryReply(drinkItems, "bebidas"),
    };
  }

  if (/(entrante|entrantes|entrad|starter|aperitivo|tequenos|tequeños|fries|patatas|pollo crujiente|ribs|barbecue|bbq)/.test(text)) {
    return {
      title: "Entrantes",
      text: buildCategoryReply(starterItems, "entrantes"),
    };
  }

  if (/(que lleva|que contiene|ingredientes|alergenos|alergenos|lleva|contiene)/.test(text)) {
    return {
      title: "Carta",
      text: [
        "Puedo darte la información de cada hamburguesa o producto de la carta.",
        "Dime el nombre exacto o algo parecido y te digo ingredientes, descripción y alérgenos.",
      ].join(" "),
    };
  }

  return null;
}

function buildCategoryReply(items: MenuItem[], label: string) {
  return [
    `Estas son nuestras opciones de ${label.toLowerCase()}:`,
    ...items.map((item) => `${item.name} - ${item.price.toFixed(2)}€ - alérgenos: ${formatAllergens(item.allergens)}`),
    `Si quieres, te doy la ficha de cualquiera de ellas.`,
  ].join("\n");
}

function getBurgerCatalogReply() {
  return burgerItems
    .map((item) => `${item.name} - ${item.price.toFixed(2)}€ - alérgenos: ${formatAllergens(item.allergens)}`)
    .join("\n");
}

function findMenuItemInText(raw: string) {
  const text = normalize(raw);

  const exactMatch = menuItems.find((item) => {
    const itemName = normalize(item.name);
    const itemId = normalize(item.id.replace(/-/g, " "));
    return (itemName && text.includes(itemName)) || (itemId && text.includes(itemId));
  });

  if (exactMatch) {
    return exactMatch;
  }

  const orderedItems = [...menuItems].sort((left, right) => {
    const leftPriority = left.category === "bebidas" ? 0 : 1;
    const rightPriority = right.category === "bebidas" ? 0 : 1;
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    return right.name.length - left.name.length;
  });

  return orderedItems.find((item) => {
    const itemName = normalize(item.name);
    const itemId = normalize(item.id.replace(/-/g, " "));
    const tokens = [itemName, itemId].filter(Boolean);

    if (tokens.some((token) => text.includes(token))) {
      return true;
    }

    if (item.id === "the-super-crispy" && /(super|súper|crispy chicken|pollo crujiente)/.test(text)) return true;
    if (item.id === "the-m-smash" && /(m smash|double smash|doble smash)/.test(text)) return true;
    if (item.id === "the-crispy" && /(the crispy|crispy|crujiente)/.test(text)) return true;
    if (item.id === "the-basic" && /(the basic|basic|burger basica|burger básica|la basica|la básica)/.test(text)) return true;
    if (item.id === "menu-kids" && /(kids|ninos|niños|infantil)/.test(text)) return true;

    return false;
  });
}

function fallbackReply(raw: string): string {
  const text = normalize(raw);

  const menuReply = getMenuReply(raw);
  if (menuReply) {
    return menuReply.text;
  }

  if (/(hola|buenas|hey|hello)/.test(text)) {
    return "Hola. Soy el asistente de M SMASH. Te ayudo con carta, hamburguesas, alérgenos, pedidos, reservas, direccion y contacto.";
  }

  if (/(horario|abierto|cerrado|hora)/.test(text)) {
    return buildOpeningHoursText();
  }

  if (/(carta|menu|hamburguesa|burger|precios?)/.test(text)) {
    return [
      "Puedes ver toda la carta actualizada en la seccion menu.",
      "Si me dices una hamburguesa concreta, te digo qué contiene y sus alérgenos.",
    ].join(" ");
  }

  if (/(pedido|pedir|delivery|domicilio|takeaway|llevar)/.test(text)) {
    return "Puedes hacer tu pedido online desde la seccion pedidos o escribirnos por WhatsApp para soporte rapido.";
  }

  if (/(reserva|reservar|mesa)/.test(text)) {
    return "Para reservar, entra en la seccion reservas y te confirmamos cuanto antes.";
  }

  if (/(donde|direccion|ubicacion|mapa|como llegar)/.test(text)) {
    return `Estamos en ${siteConfig.address}.`;
  }

  if (/(telefono|llamar|contacto|email|correo|whatsapp)/.test(text)) {
    return `Telefono: ${contactInfo.phonePretty}. Email: ${contactInfo.email}.`;
  }

  return "Ahora mismo te puedo ayudar con horario, carta, pedidos, reservas, ubicacion y contacto.";
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { from?: unknown; text?: unknown };
  const validSender = candidate.from === "user" || candidate.from === "bot";
  return validSender && typeof candidate.text === "string";
}

function extractOutputText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  if (!Array.isArray(payload.output)) {
    return "";
  }

  const chunks = payload.output
    .filter((item) => item.type === "message" && Array.isArray(item.content))
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => (part.text ?? "").trim())
    .filter(Boolean);

  return chunks.join("\n\n").trim();
}

function buildSystemPrompt() {
  const openingHours = hours.map((item) => `${item.days}: ${item.time}`).join("\n");
  const burgerContext = burgerItems
    .map((item) => `${item.name}: ${item.description} | Alérgenos: ${formatAllergens(item.allergens)} | Precio: ${item.price.toFixed(2)}€`)
    .join("\n");
  const drinkContext = drinkItems
    .map((item) => `${item.name}: ${item.description} | Alérgenos: ${formatAllergens(item.allergens)} | Precio: ${item.price.toFixed(2)}€`)
    .join("\n");
  const starterContext = starterItems
    .map((item) => `${item.name}: ${item.description} | Alérgenos: ${formatAllergens(item.allergens)} | Precio: ${item.price.toFixed(2)}€`)
    .join("\n");

  return [
    "Eres el asistente virtual de M SMASH (smash burger en Terrassa).",
    "Responde siempre en espanol, tono cercano, claro y breve.",
    "Nunca inventes datos. Si no sabes algo, dilo y deriva al contacto humano.",
    "Si piden hablar con alguien, sugiere WhatsApp.",
    "Si preguntan por menu, pedidos, reservas, ubicacion o contacto, guia con pasos concretos.",
    "Si preguntan por una hamburguesa, responde con su nombre, precio, descripcion y alergenos usando solo la informacion proporcionada.",
    "Si preguntan por bebidas o entrantes, responde con la misma estructura corta y clara.",
    "Si no se puede identificar una hamburguesa exacta, ofrece la lista de hamburguesas disponibles.",
    "No uses markdown ni tablas, solo texto natural.",
    "Datos del negocio:",
    `Nombre: ${siteConfig.name}`,
    `Direccion: ${siteConfig.address}`,
    `Telefono: ${contactInfo.phonePretty}`,
    `Email: ${contactInfo.email}`,
    `WhatsApp: ${socialLinks.whatsapp}`,
    "Horario:",
    openingHours,
    "Carta de hamburguesas:",
    burgerContext,
    "Carta de bebidas:",
    drinkContext,
    "Carta de entrantes:",
    starterContext,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as RequestBody;
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ text: "Escribe tu consulta para poder ayudarte." }, { status: 400 });
    }

    const history = Array.isArray(body.history)
      ? body.history.filter(isHistoryItem).slice(-8)
      : [];

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const menuReply = getMenuReply(message);
      return NextResponse.json({
        text: menuReply?.text ?? fallbackReply(message),
        card: menuReply?.card,
        source: "fallback",
      });
    }

    const input = [
      {
        role: "system",
        content: [{ type: "input_text", text: buildSystemPrompt() }],
      },
      ...history.map((item) => ({
        role: item.from === "user" ? "user" : "assistant",
        content: [{ type: "input_text", text: item.text.slice(0, 800) }],
      })),
      {
        role: "user",
        content: [{ type: "input_text", text: message.slice(0, 1000) }],
      },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input,
        temperature: 0.4,
        max_output_tokens: 280,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const menuReply = getMenuReply(message);
      return NextResponse.json({
        text: menuReply?.text ?? fallbackReply(message),
        card: menuReply?.card,
        source: "fallback",
      });
    }

    const payload = (await response.json()) as OpenAIResponsePayload;
    const text = extractOutputText(payload);

    const menuReply = getMenuReply(message);
    return NextResponse.json({
      text: text || menuReply?.text || fallbackReply(message),
      card: menuReply?.card,
      source: text ? "openai" : "fallback",
    });
  } catch {
    return NextResponse.json({
      text: "Ha habido un problema temporal. Puedes preguntarme de nuevo o escribirnos por WhatsApp.",
      source: "fallback",
    });
  }
}