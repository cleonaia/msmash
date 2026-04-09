# Smash Burger

Propuesta de web para locales de Hamburgeseria, con herramientas digitales para extender el negocio y mejorar la rentabilidad. De una forma personzalida con mejor atención al cliente. 

## Chatbot IA

El chatbot ya esta integrado en la web y funciona con OpenAI si defines estas variables de entorno:

```bash
OPENAI_API_KEY=tu_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Si `OPENAI_API_KEY` no esta configurada, el chat sigue funcionando en modo fallback con respuestas locales (horario, carta, pedidos, reservas, ubicacion y contacto).

## Integraciones Delivery

El proyecto incluye integración para:

- UberEats
- Glovo
- Deliveroo
- Just Eat

Webhooks disponibles:

- `/api/webhooks/ubereats`
- `/api/webhooks/glovo`
- `/api/webhooks/deliveroo`
- `/api/webhooks/justeat`

## Producción

1. Copia `/.env.production.example` como base para tu entorno productivo.
2. Configura `DATABASE_URL` con una URL real de PostgreSQL (Neon, Supabase, Railway o Vercel Postgres).
3. Configura claves reales (Stripe, delivery, email, WhatsApp, OpenAI).
4. Ejecuta migraciones antes de arrancar en producción:

```bash
npm run db:migrate:deploy
```

5. Revisa el checklist de salida en `docs/PRODUCTION_LAUNCH_CHECKLIST.md`.

## Base de datos

- Prisma usa PostgreSQL en `prisma/schema.prisma`.
- Migración inicial incluida en `prisma/migrations/20260408_init_postgresql/migration.sql`.
- En local también necesitas `DATABASE_URL` de PostgreSQL para `prisma migrate dev`.
