import { PrismaClient, Role, ProductChannel, PaymentMethod } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding Quebracho data...");

  const adminEmail = "admin@quebracho.com.ar";
  const adminPassword = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          firstName: "Lucía",
          lastName: "Fernández",
          phone: "+54 9 11 5555-0000",
          marketingOptIn: true,
          favoriteCuts: ["Bife de chorizo", "Tira de asado"],
        },
      },
    },
  });

  const restaurantCategories = [
    {
      name: "Entradas",
      slug: "entradas",
      description: "Empezá la experiencia con estos bocados inspirados en la clásica picada criolla.",
    },
    {
      name: "Principales",
      slug: "principales",
      description: "Cortes premium a la parrilla perfumados con quebracho y hierbas patagónicas.",
    },
    {
      name: "Postres",
      slug: "postres",
      description: "Clásicos argentinos con un giro contemporáneo.",
    },
    {
      name: "Maridajes",
      slug: "maridajes",
      description: "Selección de vinos de bodegas boutique y cócteles de autor.",
    },
  ];

  const butcherCategories = [
    {
      name: "Cortes parrilleros",
      slug: "cortes-parrilleros",
      description: "Los cortes preferidos para una parrillada inolvidable.",
    },
    {
      name: "Madurados",
      slug: "madurados",
      description: "Cortes dry-aged de hasta 45 días con sabor intenso.",
    },
    {
      name: "Boxes & combos",
      slug: "boxes-combos",
      description: "Selecciones curadas listas para regalar o compartir.",
    },
    {
      name: "Embutidos & acompañamientos",
      slug: "embutidos-acompanamientos",
      description: "Chorizos artesanales, provoletas especiadas y salsas caseras.",
    },
  ];

  await prisma.productCategory.deleteMany();

  const createdRestaurantCategories = await Promise.all(
    restaurantCategories.map((category) =>
      prisma.productCategory.create({
        data: {
          ...category,
          channel: ProductChannel.RESTAURANT,
        },
      })
    )
  );

  const createdButcherCategories = await Promise.all(
    butcherCategories.map((category) =>
      prisma.productCategory.create({
        data: {
          ...category,
          channel: ProductChannel.BUTCHER,
        },
      })
    )
  );

  await prisma.product.deleteMany();

  const products = [
    {
      name: "Bife de chorizo dry-aged",
      slug: "bife-de-chorizo-dry-aged",
      description:
        "Corte premium madurado 30 días con hueso, marmoleo perfecto y notas ahumadas a quebracho chaqueño.",
      price: 14900,
      unit: "kg",
      stock: 32,
      isFeatured: true,
      badges: ["Madurado 30 días", "Reserva limitada"],
      pairings: ["Malbec de altura", "Manteca de chimichurri"],
      categorySlug: "madurados",
      images: [
        {
          url: "https://images.unsplash.com/photo-1604908176997-12518821b87b?auto=format&fit=crop&w=900&q=80",
          alt: "Bife de chorizo dry-aged sobre tabla",
        },
      ],
    },
    {
      name: "Tira de asado premium",
      slug: "tira-de-asado-premium",
      description:
        "Clásica tira ancha con hueso, aliñada con sal marina fueguina y terminación en horno de barro.",
      price: 8900,
      unit: "kg",
      stock: 48,
      isFeatured: true,
      badges: ["100% Angus", "Libre de antibióticos"],
      pairings: ["Blend tinto", "Chimichurri ahumado"],
      categorySlug: "cortes-parrilleros",
      images: [
        {
          url: "https://images.unsplash.com/photo-1608032205900-bc912c05e06b?auto=format&fit=crop&w=900&q=80",
          alt: "Tira de asado asándose a las brasas",
        },
      ],
    },
    {
      name: "Box Quebracho Signature",
      slug: "box-quebracho-signature",
      description:
        "Selección especial: ojo de bife dry-aged, chorizos criollos, provoleta ahumada, aderezos caseros y maridaje sugerido.",
      price: 52900,
      unit: "box",
      stock: 12,
      isFeatured: true,
      badges: ["Ideal regalos", "Incluye maridaje"],
      pairings: ["Malbec reserva", "Embutidos artesanales"],
      categorySlug: "boxes-combos",
      images: [
        {
          url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
          alt: "Box gourmet con cortes y vinos",
        },
      ],
    },
    {
      name: "Empanadas de carne a cuchillo",
      slug: "empanadas-carne-cuchillo",
      description: "Masa hojaldrada rellena con carne braseada, aceitunas verdes y especias norteñas.",
      price: 4500,
      unit: "6 unidades",
      stock: 60,
      isFeatured: false,
      badges: ["Receta familiar"],
      pairings: ["Malbec joven", "Salsa criolla"],
      categorySlug: "entradas",
      images: [
        {
          url: "https://images.unsplash.com/photo-1598965675760-315ec95f05af?auto=format&fit=crop&w=900&q=80",
          alt: "Empanadas argentinas en tabla de madera",
        },
      ],
    },
    {
      name: "Ojo de bife a la leña",
      slug: "ojo-de-bife-lena",
      description:
        "400g de ojo de bife Angus sellado al quebracho, con manteca de yerba mate y charlotte glaseada.",
      price: 19800,
      unit: "plato",
      stock: 25,
      isFeatured: true,
      badges: ["Top seller restaurante"],
      pairings: ["Cabernet Franc", "Puré de papas trufado"],
      categorySlug: "principales",
      images: [
        {
          url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
          alt: "Ojo de bife servido con guarnición",
        },
      ],
    },
    {
      name: "Flan casero con dulce de leche ahumado",
      slug: "flan-casero-dulce-ahumado",
      description: "Clásico flan de campo con dulce de leche cocido a fuego de quebracho y crema chantilly.",
      price: 5400,
      unit: "porción",
      stock: 40,
      isFeatured: false,
      badges: ["Clásico argentino"],
      pairings: ["Espumante extra brut"],
      categorySlug: "postres",
      images: [
        {
          url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80",
          alt: "Flan con dulce de leche",
        },
      ],
    },
  ];

  for (const product of products) {
    const category = [...createdRestaurantCategories, ...createdButcherCategories].find(
      (cat) => cat.slug === product.categorySlug
    );

    if (!category) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        isFeatured: product.isFeatured,
        badges: product.badges,
        pairings: product.pairings,
        categoryId: category.id,
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

  await prisma.blogPost.deleteMany();
  await prisma.recipeTag.deleteMany();

  const tags = await prisma.recipeTag.createManyAndReturn({
    data: [
      { name: "Parrilla", slug: "parrilla" },
      { name: "Recetas", slug: "recetas" },
      { name: "Tips", slug: "tips" },
      { name: "Maridajes", slug: "maridajes" },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "El ritual del asado perfecto",
        slug: "ritual-del-asado-perfecto",
        excerpt:
          "Secretos de nuestros parrilleros para lograr el punto exacto, dominar las brasas y conquistar a los invitados.",
        coverImage:
          "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80",
        content:
          "## Dominá las brasas\n\nNuestro maestro parrillero comparte una guía paso a paso para encender quebracho colorado, administrar alturas y sellar cortes premium. Sumamos tips de maridaje y guarniciones que elevan la experiencia.",
        authorId: admin.id,
        publishedAt: new Date(),
      },
      {
        title: "Maridajes que potencian tus cortes",
        slug: "maridajes-que-potencian",
        excerpt:
          "Sommelier Lucía recomienda vinos y cócteles que resaltan los matices ahumados de nuestros favoritos.",
        coverImage:
          "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
        content:
          "## Brindemos por el asado\n\nTe compartimos el pairing perfecto para cada corte destacado, incluyendo etiquetas boutique y tragos de autor inspirados en el quebracho.",
        authorId: admin.id,
        publishedAt: new Date(),
      },
    ],
  });

  const posts = await prisma.blogPost.findMany();

  for (const post of posts) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        tags: {
          connect: tags.slice(0, 2).map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  await prisma.contactMessage.deleteMany();

  await prisma.contactMessage.create({
    data: {
      name: "Agustina Pérez",
      email: "agustina@example.com",
      phone: "+54 9 11 2222-3333",
      subject: "Evento corporativo",
      message:
        "Queremos organizar un cocktail para 60 personas el próximo mes. ¿Podemos coordinar una degustación privada?",
    },
  });

  await prisma.order.deleteMany();

  await prisma.order.create({
    data: {
      customerName: "Gastón Ríos",
      customerEmail: "gaston@example.com",
      customerPhone: "+54 9 11 7777-8888",
      deliveryMethod: "Retiro en local",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: PaymentMethod.LOCAL,
      totalAmount: 52900,
      notes: "Retira el viernes 19 hs",
      items: {
        create: [
          {
            product: {
              connect: {
                slug: "box-quebracho-signature",
              },
            },
            quantity: 1,
            unitPrice: 52900,
            subtotal: 52900,
          },
        ],
      },
      user: {
        connect: {
          id: admin.id,
        },
      },
    },
  });

  console.info("✅ Seed completed");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
