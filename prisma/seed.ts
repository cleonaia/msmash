import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  ProductChannel,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

const toCents = (price: number) => Math.round(price * 100);

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  priceEuro: number;
  unit: string;
  stock: number;
  isFeatured: boolean;
  badges: string[];
  pairings: string[];
  categorySlug: string;
  images: Array<{ url: string; alt: string }>;
};

const restaurantCategories = [
  {
    name: "Singles",
    slug: "smash-singles",
    description: "Smash burgers de una carne con costra brutal y mucho sabor.",
  },
  {
    name: "Doubles",
    slug: "smash-doubles",
    description: "Doble carne, doble queso y actitud M SMASH.",
  },
  {
    name: "Especiales",
    slug: "smash-especiales",
    description: "Combinaciones de autor para los que buscan algo distinto.",
  },
  {
    name: "Extras",
    slug: "extras",
    description: "Guarniciones, toppings y sides para montar tu burger perfecta.",
  },
  {
    name: "Bebidas",
    slug: "bebidas",
    description: "Refrescos, cerveza y shakes para acompañar cada bocado.",
  },
];

const products: SeedProduct[] = [
  {
    name: "The Classic",
    slug: "the-classic",
    description:
      "Carne smash 120g, queso americano, cebolla caramelizada, pepinillo y salsa de la casa.",
    priceEuro: 9.5,
    unit: "unidad",
    stock: 120,
    isFeatured: true,
    badges: ["El Original"],
    pairings: ["Patatas Smash", "Refresco"],
    categorySlug: "smash-singles",
    images: [
      {
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
        alt: "The Classic de M SMASH",
      },
    ],
  },
  {
    name: "The Smoky",
    slug: "the-smoky",
    description:
      "Smash ahumado, bacon crujiente, queso gouda y honey mustard.",
    priceEuro: 11.5,
    unit: "unidad",
    stock: 90,
    isFeatured: true,
    badges: ["Top Ventas"],
    pairings: ["Aros de Cebolla", "Cerveza"],
    categorySlug: "smash-singles",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&q=80",
        alt: "The Smoky con bacon",
      },
    ],
  },
  {
    name: "Double Trouble",
    slug: "double-trouble",
    description:
      "Doble smash, doble cheddar, bacon crujiente, cebolla frita y salsa BBQ.",
    priceEuro: 13.5,
    unit: "unidad",
    stock: 80,
    isFeatured: true,
    badges: ["El Mas Potente"],
    pairings: ["Patatas con Queso", "SMASH Shake"],
    categorySlug: "smash-doubles",
    images: [
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
        alt: "Double Trouble",
      },
    ],
  },
  {
    name: "Double Fire",
    slug: "double-fire",
    description:
      "Doble smash, queso pepper jack, jalapenos fritos, guacamole y sriracha mayo.",
    priceEuro: 14.5,
    unit: "unidad",
    stock: 70,
    isFeatured: true,
    badges: ["Picante"],
    pairings: ["Patatas Smash", "Agua mineral"],
    categorySlug: "smash-doubles",
    images: [
      {
        url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900&q=80",
        alt: "Double Fire",
      },
    ],
  },
  {
    name: "Blue Sky",
    slug: "blue-sky",
    description:
      "Smash con queso azul, rucula baby, pera caramelizada y miel de romero.",
    priceEuro: 11.9,
    unit: "unidad",
    stock: 65,
    isFeatured: true,
    badges: ["Especial"],
    pairings: ["Aros de Cebolla", "Cerveza"],
    categorySlug: "smash-especiales",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=900&q=80",
        alt: "Blue Sky",
      },
    ],
  },
  {
    name: "Truffle Smash",
    slug: "truffle-smash",
    description:
      "Smash con aceite de trufa, queso brie y champinones salteados.",
    priceEuro: 14.9,
    unit: "unidad",
    stock: 45,
    isFeatured: false,
    badges: ["Edicion limitada"],
    pairings: ["Patatas con Queso", "SMASH Shake"],
    categorySlug: "smash-especiales",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=900&q=80",
        alt: "Truffle Smash",
      },
    ],
  },
  {
    name: "Patatas Smash",
    slug: "patatas-smash",
    description:
      "Patatas crujientes con sal Maldon y romero. El side imprescindible.",
    priceEuro: 4.5,
    unit: "racion",
    stock: 200,
    isFeatured: false,
    badges: ["Must Have"],
    pairings: ["The Classic"],
    categorySlug: "extras",
    images: [
      {
        url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80",
        alt: "Patatas Smash",
      },
    ],
  },
  {
    name: "SMASH Shake",
    slug: "smash-shake",
    description: "Batido artesano de vainilla, chocolate o fresa.",
    priceEuro: 4.5,
    unit: "unidad",
    stock: 140,
    isFeatured: false,
    badges: ["Nuevo"],
    pairings: ["Double Trouble"],
    categorySlug: "bebidas",
    images: [
      {
        url: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=900&q=80",
        alt: "SMASH Shake",
      },
    ],
  },
];

const tags = [
  { name: "Smash", slug: "smash" },
  { name: "Tecnica", slug: "tecnica" },
  { name: "Menu", slug: "menu" },
  { name: "Terrassa", slug: "terrassa" },
];

const posts = [
  {
    title: "Como lograr una costra smash perfecta",
    slug: "costra-smash-perfecta",
    excerpt:
      "Temperatura, presion y timing: los tres secretos para una burger brutal en plancha.",
    coverImage:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80",
    content:
      "## La costra lo cambia todo\n\nEn M SMASH trabajamos plancha muy caliente, bola de carne fresca y aplastado rapido para conseguir reaccion de Maillard y sabor intenso.",
    tagSlugs: ["smash", "tecnica"],
  },
  {
    title: "Las combinaciones favoritas del equipo",
    slug: "combinaciones-favoritas-equipo",
    excerpt:
      "Estas son las burgers y extras que mas piden nuestros cocineros cuando termina el servicio.",
    coverImage:
      "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=1200&q=80",
    content:
      "## Picks internos de M SMASH\n\nDouble Trouble con patatas smash y un shake: un combo ganador para cerrar la noche.",
    tagSlugs: ["menu", "terrassa"],
  },
];

async function main() {
  console.info("🌱 Seeding M SMASH data...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@msmash.es" },
    update: {
      role: Role.ADMIN,
    },
    create: {
      email: "admin@msmash.es",
      role: Role.ADMIN,
    },
  });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {
      firstName: "M",
      lastName: "SMASH",
      phone: "+34 937 84 12 55",
      marketingOptIn: true,
      favoriteCuts: ["The Classic", "Double Trouble"],
    },
    create: {
      userId: admin.id,
      firstName: "M",
      lastName: "SMASH",
      phone: "+34 937 84 12 55",
      marketingOptIn: true,
      favoriteCuts: ["The Classic", "Double Trouble"],
    },
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favoriteProduct.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.recipeTag.deleteMany();
  await prisma.contactMessage.deleteMany();

  const categoryBySlug = new Map<string, string>();
  for (const category of restaurantCategories) {
    const created = await prisma.productCategory.create({
      data: {
        ...category,
        channel: ProductChannel.RESTAURANT,
      },
    });
    categoryBySlug.set(category.slug, created.id);
  }

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) {
      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: toCents(product.priceEuro),
        unit: product.unit,
        stock: product.stock,
        isFeatured: product.isFeatured,
        badges: product.badges,
        pairings: product.pairings,
        categoryId,
        images: {
          create: product.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            order: index,
          })),
        },
      },
    });
  }

  await prisma.recipeTag.createMany({
    data: tags,
  });

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        content: post.content,
        authorId: admin.id,
        publishedAt: new Date(),
        tags: {
          connect: post.tagSlugs.map((slug) => ({ slug })),
        },
      },
    });
  }

  await prisma.contactMessage.create({
    data: {
      name: "Alex Martin",
      email: "alex@example.com",
      phone: "+34 612 34 56 78",
      subject: "Reserva para grupo",
      message:
        "Hola equipo, queremos reservar para 10 personas este sabado por la noche. Muchas gracias.",
    },
  });

  const demoProduct = await prisma.product.findUnique({
    where: { slug: "double-trouble" },
  });

  if (demoProduct) {
    await prisma.order.create({
      data: {
        customerName: "Sergio Lopez",
        customerEmail: "sergio@example.com",
        customerPhone: "+34 600 11 22 33",
        deliveryMethod: "Recogida en local",
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.LOCAL,
        totalAmount: demoProduct.price,
        notes: "Punto de carne bien dorado.",
        items: {
          create: [
            {
              productId: demoProduct.id,
              quantity: 1,
              unitPrice: demoProduct.price,
              subtotal: demoProduct.price,
            },
          ],
        },
        userId: admin.id,
      },
    });
  }

  console.info("✅ Seed M SMASH completed");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
