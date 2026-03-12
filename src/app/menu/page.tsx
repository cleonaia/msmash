import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils";

const showcaseSections = [
  {
    category: "Elaborados caseros",
    items: [
      {
        name: "Chorizo criollo artesanal",
        description: "Receta tradicional argentina preparada a diario.",
        price: 9.5,
      },
      {
        name: "Matambre arrollado",
        description: "Relleno con verduras y especias, listo para cortar.",
        price: 18.9,
      },
      {
        name: "Milanesas caseras",
        description: "De ternera o pollo, empanado crujiente y especias propias.",
        price: 12.5,
      },
    ],
  },
  {
    category: "Listos para la parrilla",
    items: [
      {
        name: "Bife angosto selección",
        description: "Corte importado, marmoleo perfecto para la parrilla.",
        price: 24.5,
      },
      {
        name: "Bife ancho premium",
        description: "Jugoso y de sabor intenso, ideal para cocciones lentas.",
        price: 26.9,
      },
      {
        name: "Vacío argentino",
        description: "Corte clásico con grasa justa para asados familiares.",
        price: 19.8,
      },
    ],
  },
  {
    category: "Dulces y bebidas",
    items: [
      {
        name: "Alfajores artesanales",
        description: "Dulce de leche argentino y baño de chocolate.",
        price: 14,
      },
      {
        name: "Dulce de leche premium",
        description: "Frasco de 450 g, perfecto para postres caseros.",
        price: 6.9,
      },
      {
        name: "Vinos argentinos",
        description: "Malbec, Cabernet Franc y blends boutique.",
        price: 19.9,
      },
    ],
  },
];

const butcherMenu = [
  {
    name: "Bife angosto selección",
    price: 24.5,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588763/business/157bbdc3-374f-4d77-9271-dec1b417444c.jpg",
  },
  {
    name: "Bife ancho premium",
    price: 26.9,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588806/business/3e51bd35-921b-4e97-a829-d071f19df5da.jpg",
  },
  {
    name: "Chorizo criollo",
    price: 9.5,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588385/business/1c0ea266-5a02-4cd3-9194-222249e9e12c.jpg",
  },
  {
    name: "Fiambres y embutidos",
    price: 18.5,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588859/business/14c477c3-9ca8-43b4-84bf-5785886f7741.jpg",
  },
  {
    name: "Alfajores artesanales",
    price: 14,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588983/business/e8604003-c805-4553-9e13-92e6337967c9.jpg",
  },
  {
    name: "Vinos argentinos",
    price: 19.9,
    image: "https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c900_a/image/upload/v1627588934/business/f37284d0-7475-4f89-a1fa-25f01c4aab25.jpg",
  },
];

export default function MenuPage() {
  return (
    <div>
      <PageHeader
        title="Productos destacados"
        subtitle="Cortes argentinos, elaborados caseros y productos gourmet para llevar"
        backgroundImage="https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c1536_a/image/upload/v1627589110/business/625bab3a-c2de-4d60-8326-f48ca4bc2720.jpg"
      />

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.92)_0%,rgba(45,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)]" aria-hidden />
        <div className="relative">
          <h2 className="text-3xl font-semibold text-white">Catálogo en tienda</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {showcaseSections.map((section) => (
              <div key={section.category} className="surface-card-strong gradient-border rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-amber-400">{section.category}</h3>
                <ul className="mt-5 space-y-5">
                  {section.items.map((item) => (
                    <li key={item.name} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <span className="text-sm text-white/65">{formatCurrency(item.price)}</span>
                      </div>
                      <p className="text-sm text-white/65">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden border-t border-white/10 bg-[linear-gradient(160deg,rgba(18,2,0,0.92)_0%,rgba(48,6,0,0.88)_55%,rgba(18,2,0,0.94)_100%)] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,58,32,0.24),_transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">Galería de productos</h2>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Cortes seleccionados, elaborados caseros y dulces importados. Podés encargarlos online o retirarlos en la tienda.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {butcherMenu.map((product) => (
              <article key={product.name} className="overflow-hidden rounded-3xl surface-card gradient-border">
                <div className="relative h-52">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090100] via-black/25 to-transparent" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-amber-400">{formatCurrency(product.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
