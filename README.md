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
2. Configura claves reales (Stripe, delivery, email, WhatsApp, OpenAI).
3. Revisa el checklist de salida en `docs/PRODUCTION_LAUNCH_CHECKLIST.md`.
