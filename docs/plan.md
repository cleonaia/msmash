# Quebracho Carnes Argentinas – Product & Experience Plan

## Research Snapshot
- **Local inspirations**: Referenced patterns from leading Argentine parrillas and carnicerías con e‑commerce (e.g., Cabaña Las Lilas, La Cabrera, Moët Carnes, and boutique butcher platforms like The Butcher’s Society). Common success traits include cinematic hero video/imagery, dual focus on restaurante + carnicería, frictionless reservation flows, prominent provenance storytelling, and curated boxes with pairing suggestions.
- **Audience segments**:
  - *Comensales gourmet* seeking reservas rápidas y menús estacionales.
  - *Asadores entusiastas* que quieren comprar cortes premium, combos y maridajes.
  - *Corporativo/regalos* para cajas empresariales y eventos privados.
- **Differentiators to highlight**: origen chaqueño del quebracho, maduración artesanal, integración restaurante + carnicería + catering, maridajes con vinos argentinos, reseñas de prensa y comunidad.

## Experience Architecture
1. **Home / Inicio**: immersive hero (video or slideshow), propuesta de valor, destacados del restaurante, combos de carnicería, CTA dobles (Reservar / Comprar).
2. **Historia**: línea de tiempo, ADN familiar, fotos de estancia, certificaciones.
3. **Menú**:
   - Secciones restaurante (entradas, principales, postres, maridajes).
   - Secciones carnicería (cortes, packs, embutidos, acompañamientos).
   - Filtros por categoría, badge de recomendados, pairing sugerido.
4. **Reservas**: formulario paso a paso con selector de fecha/hora, tamaño de grupo, preferencias; confirmación + email.
5. **Tienda online**: catálogo con filtros, carrito persistente, checkout con métodos locales (mercado pago/transferencia) y Stripe test-ready.
6. **Contacto & Ubicación**: mapa embebido, horarios, teléfonos, WhatsApp, redes, formulario rápido.
7. **Blog / Recetas**: recetas parrilleras, tips de cocción, novedades de eventos.
8. **Área cliente**: historial de pedidos y reservas, actualización de datos, favoritos.
9. **Panel interno**: dashboard con métricas, gestión CRUD de productos, posts, reservas, pedidos.

## Technical Blueprint
- **Stack**: Next.js 15 (App Router, Server Actions), TypeScript, Tailwind CSS 4, Zustand (client state), Prisma ORM + SQLite (local), ready for PostgreSQL. Authentication via NextAuth (Credentials + Magic Link). Email flows through Nodemailer SMTP (configurable). Payment abstraction with fallback ("Confirmar y pagar en local") + optional Stripe integration (env-based switch).
- **Key packages**: `next-auth`, `prisma`, `@prisma/client`, `argon2`, `zod`, `zustand`, `stripe` (optional), `react-hook-form`, `@tanstack/react-table`, `date-fns`, `lucide-react`, `tailwind-merge`, `clsx`, `resend` (optional), `nodemailer`.
- **Testing**: Jest + React Testing Library for components and server utilities; Playwright for user journeys (reservar, comprar, login admin).
- **Data Model (Prisma)**:
  - `User` (roles: CUSTOMER, ADMIN), `Profile`, `Reservation`, `Product`, `ProductCategory`, `ProductImage`, `Order`, `OrderItem`, `BlogPost`, `RecipeTag`, `ContactMessage`.
  - Soft-delete fields, timestamps, slugs.
- **CI considerations**: lint, type-check, prisma format, jest, playwright smoke.

## Implementation Phases
1. **Foundation**: configure Tailwind theme, global layout, typography, palette inspired en quebracho (tonos rojizos, dorados, madera oscura). Setup fonts via `next/font` (e.g., Playfair Display + Inter).
2. **Infrastructure**: Prisma setup + schema, seed script, NextAuth route handlers, middleware, layout shell with header/footer.
3. **Core UX**: build landing sections, historia, menú (static + CMS-backed), carrito + checkout, reservas (server action storing in DB), contacto, blog listing/detail.
4. **Account & Admin**: dashboards with protected routes, CRUD forms, tables con búsqueda/filtros.
5. **Enhancements**: email notifications, analytics placeholders, accessibility polish, animations (Framer Motion), SEO metadata, sitemap.
6. **QA & Docs**: tests, Playwright flows, README with setup, env template, future roadmap.

## Edge Cases & Considerations
- Manejar reservas simultáneas; bloquear horarios si capacidad llena.
- Validar disponibilidad de stock al checkout; decrementar inventario.
- Estados de pedido: pending, confirmed, preparing, completed, cancelled.
- Operar sin Stripe (modo local) y asegurar degrade elegante.
- Timezone Buenos Aires (America/Argentina/Buenos_Aires).
- Multi-idioma future-ready (es/en) utilizando arquitectura i18n.

## Deliverables Snapshot
- Full Next.js app con rutas: `/`, `/historia`, `/menu`, `/reservas`, `/tienda`, `/tienda/[slug]`, `/contacto`, `/blog`, `/blog/[slug]`, `/cliente/...`, `/admin/...`.
- API routes `/api/reservations`, `/api/products`, `/api/orders`, `/api/blog`, `/api/auth`.
- Prisma schema + seeds, `.env.example` con variables necesarias.
- Component library: hero, cards, timeline, tabs, accordions.
- Tests: jest unit for utils/components, Playwright smoke for reserva + checkout + admin login.
- Deployment readiness (Vercel) + instructions para habilitar Stripe / SMTP.
