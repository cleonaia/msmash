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
    { id: "super-crispy-chicken", slug: "super-crispy-chicken", name: "THE SÚPER CHICKEN BURGER", description: "Pollo extra crujiente marinado con especias japonesas, queso cheddar, tomate Pera, Salsa M, salsa tártara koreana, cebolla caramelizada y su pan brioche", price: toCents(11.9), categorySlug: "smash-singles" },
    { id: "the-special", slug: "the-special", name: "THE SPECIAL🍔", description: "Pan brioche, Smash Burguer, queso cheddar, lechuga, tomate, huevo, salsas de la casa y bacon.", price: toCents(12.5), categorySlug: "smash-singles" },
    { id: "the-three-max", slug: "the-three-max", name: "The Three Max", description: "Pan brioche, tripé Smash burguer, quesos cheddar y Edam, cebolla caramelizada y salsa de la casa", price: toCents(15.5), categorySlug: "smash-singles" },
    { id: "the-hawaian-burger", slug: "the-hawaian-burger", name: "The Hawaian Burger", description: "Pan brioche, doble Smash burguer, Doble Queso Edam, trozo de piña asada, Costillar desmenuzado ( Receta de la Abuela) salsas de la casa y miel", price: toCents(17.0), categorySlug: "smash-singles" },
    { id: "tequenos", slug: "tequenos", name: "Tequeños", description: "Dedos de queso en hojaldre", price: toCents(5.0), categorySlug: "extras" },
    { id: "fries-m", slug: "fries-m", name: "Fries M", description: "Patatas fritas, salsa queso, bacon", price: toCents(7.0), categorySlug: "extras" },
    { id: "crispy-chicken", slug: "crispy-chicken", name: "CRISPY FINGER", description: "6 tiras de pollo rebozadas con especias japonesas y acompañadas con una tártara koreana", price: toCents(6.0), categorySlug: "extras" },
    { id: "cheesecake-nutella", slug: "cheesecake-nutella", name: "Cheesecake de Lottus", description: "La clásica tarta de queso junto a una base de Lottus y lluvia de chocolate caliente.", price: toCents(6.5), categorySlug: "extras" },
    { id: "cerveza-radler", slug: "cerveza-radler", name: "Cerveza Radler", description: "Cerveza radler", price: toCents(2.8), categorySlug: "bebidas" },
    { id: "pepsi-clasica", slug: "pepsi-clasica", name: "Pepsi", description: "Pepsi Cola", price: toCents(2.5), categorySlug: "bebidas" },
    { id: "sprite", slug: "sprite", name: "Sprite", description: "Sprite", price: toCents(2.5), categorySlug: "bebidas" },
  ];

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;
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
          create: [{ url: `/images/products/${product.slug}.jpeg`, alt: product.name, order: 0 }],
        },
      },
    });
  }

  console.info("✅ Seed done!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
