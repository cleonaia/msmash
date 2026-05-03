import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const toCents = (price: number) => Math.round(price * 100);

async function main() {
  console.info("🌱 Seeding M SMASH data...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();

  const admin = await prisma.user.upsert({
    where: { email: "admin@msmash.es" },
    update: { role: "ADMIN" },
    create: { email: "admin@msmash.es", role: "ADMIN" },
  });

  const categoryMap = new Map<string, string>();

  const categories = [
    { name: "Singles", slug: "smash-singles", description: "Smash burgers." },
    { name: "Extras", slug: "extras", description: "Guarniciones." },
    { name: "Bebidas", slug: "bebidas", description: "Bebidas." },
  ];

  for (const cat of categories) {
    const created = await prisma.productCategory.create({
      data: { ...cat, channel: "RESTAURANT" },
    });
    categoryMap.set(cat.slug, created.id);
  }

  const products = [
    { id: "the-crispy", slug: "the-crispy", name: "The Crispy", description: "Pan brioche, smash Burger con queso gouda, bacon", price: toCents(11.0), categorySlug: "smash-singles" },
    { id: "the-m-smash", slug: "the-m-smash", name: "The M Smash", description: "Doble Smash, queso, bacon, huevo", price: toCents(13.0), categorySlug: "smash-singles" },
    { id: "the-basic", slug: "the-basic", name: "The Basic", description: "Smash, queso, ketchup, pepinillos", price: toCents(6.5), categorySlug: "smash-singles" },
    { id: "super-crispy-chicken", slug: "super-crispy-chicken", name: "THE SÚPER CHICKEN BURGER", description: "Pollo extra crujiente marinado con especias japonesas, queso cheddar, tomate Pera, Salsa M, salsa tártara koreana, cebolla caramelizada y su pan brioche", price: toCents(12.5), categorySlug: "smash-singles" },
    { id: "the-special", slug: "the-special", name: "THE SPECIAL🍔", description: "Pan brioche, Smash Burguer, queso cheddar, lechuga, tomate, huevo, salsas de la casa y bacon.", price: toCents(12.5), categorySlug: "smash-singles" },
    { id: "the-three-max", slug: "the-three-max", name: "The Three Max", description: "Pan brioche, tripé Smash burguer, quesos cheddar y Edam, cebolla caramelizada y salsa de la casa", price: toCents(15.5), categorySlug: "smash-singles" },
    { id: "the-hawaian-burger", slug: "the-hawaian-burger", name: "The Hawaian Burger", description: "Pan brioche, doble Smash burguer, Doble Queso Edam, trozo de piña asada, Costillar desmenuzado ( Receta de la Abuela) salsas de la casa y miel", price: toCents(17.0), categorySlug: "smash-singles" },
    { id: "tequenos", slug: "tequenos", name: "Tequeños", description: "Dedos de queso en hojaldre", price: toCents(5.0), categorySlug: "extras" },
    { id: "fries-m", slug: "fries-m", name: "Fries M", description: "Patatas fritas, salsa queso, bacon", price: toCents(7.0), categorySlug: "extras" },
    { id: "crispy-chicken", slug: "crispy-chicken", name: "CRISPY FINGER", description: "6 tiras de pollo rebozadas con especias japonesas y acompañadas con una tártara koreana", price: toCents(7.0), categorySlug: "extras" },
    { id: "fries-bacon-jam", slug: "fries-bacon-jam", name: "Fries Bacon Jam", description: "Patatas fritas caseras con mermelada de bacon a un precio de 7 euros.", price: toCents(7.0), categorySlug: "extras" },
    { id: "cheesecake-nutella", slug: "cheesecake-nutella", name: "Cheesecake de Lottus", description: "La clásica tarta de queso junto a una base de Lottus y lluvia de chocolate caliente.", price: toCents(6.5), categorySlug: "extras" },
    { id: "cerveza-radler", slug: "cerveza-radler", name: "Cerveza Radler", description: "Cerveza radler", price: toCents(2.8), categorySlug: "bebidas" },
    { id: "pepsi-clasica", slug: "pepsi-clasica", name: "Pepsi", description: "Pepsi Cola", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "sprite", slug: "sprite", name: "Sprite", description: "Sprite", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "lipton", slug: "lipton", name: "Lipton", description: "Lipton té limón", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "pepsi-zero", slug: "pepsi-zero", name: "Pepsi Zero", description: "Pepsi Cola Zero", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "schweppes-naranja", slug: "schweppes-naranja", name: "Schweppes Naranja", description: "Schweppes naranja", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "schweppes-limon", slug: "schweppes-limon", name: "Schweppes Limón", description: "Schweppes limón", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "cafe", slug: "cafe", name: "Cafe", description: "Cafe solo", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "capuccino", slug: "capuccino", name: "Capuccino", description: "Cafe con leche cremada", price: toCents(2.0), categorySlug: "bebidas" },
    { id: "agua-solan", slug: "agua-solan", name: "Agua Solan", description: "Agua mineral de Solan de Cabras", price: toCents(2.3), categorySlug: "bebidas" },
    { id: "agua-gas", slug: "agua-gas", name: "Agua con Gas", description: "Agua mineral con gas de Solan", price: toCents(2.5), categorySlug: "bebidas" },
    { id: "tinto-de-verano", slug: "tinto-de-verano", name: "Tinto de Verano", description: "Tinto de verano", price: toCents(3.5), categorySlug: "cervezas" },
  ];

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;
    const explicitImageMap: Record<string, string> = {
      'the-special': 'The_Special.jpeg',
      'the-hawaian-burger': 'The_Hawaiana.jpeg',
      'fries-bacon-jam': 'Fries_Bacon_Jam.jpeg',
      'menu-kids': 'Menu_Kids.jpeg',
      'fries-m': 'fries-m.jpeg',
      'cheesecake-nutella': 'chessecake_lottus.jpeg',
      'cheesecake-oreo': 'chessecake_oreo.jpg',
      'cafe': 'cafe.png',
      'capuccino': 'capuccino.jpg',
      'tinto-de-verano': 'TINTO_DE_VERANO.jpeg',
    };

    const imageFile = explicitImageMap[product.slug] || `${product.slug}.jpeg`;

    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categoryId,
        unit: "unidad",
        stock: 100,
        isFeatured: true,
        badges: JSON.stringify([]),
        images: {
          create: [{ url: `/images/products/${imageFile}`, alt: product.name, order: 0 }],
        },
      },
    });
  }

  console.info("✅ Seed done!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
