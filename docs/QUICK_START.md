# ⚡ QUICK START - CARTA DIGITAL (5 MINUTOS)

**¿Tienes prisa? Esto es lo que necesitas AHORA:**

---

## 1️⃣ TU CARTA ESTÁ LISTA EN: 

```
src/features/menu/data/menu.ts
```

✅ Todos los productos
✅ Descripciones exactas
✅ Precios correctos
✅ Alérgenos reales

---

## 2️⃣ AGREGA SOLO TUS FOTOS

```bash
# Crea esta carpeta
mkdir -p public/images/products

# Copia tus 17 fotos aquí con estos nombres:
the-crispy.jpg
the-m-smash.jpg
the-basic.jpg
the-super-crispy.jpg
menu-kids.jpg
frankfurt.jpg
tequeños.jpg
fries-m.jpg
crispy-chicken.jpg
cheesecake-nutella.jpg
pepsi-clasica.jpg
lipton.jpg
pepsi-zero.jpg
sprite.jpg
schweppes-naranja.jpg
schweppes-limon.jpg
agua-solan.jpg
agua-gas.jpg
```

✅ ¡Listo! Las rutas ya están configuradas.

---

## 3️⃣ USA EN TU WEB

```tsx
// En cualquier página de tu sitio
import { MenuCatalog } from '@/components/menu/MenuCatalog';

export default function Page() {
  return <MenuCatalog />;
}
```

✅ Vista profesional de la carta
✅ Responsive (móvil, tablet, desktop)
✅ Filtros por categoría

---

## 4️⃣ DESCARGA PDF

```tsx
import { MenuPDFExport } from '@/components/menu/MenuPDFExport';

export default function Page() {
  return <MenuPDFExport />;
}
```

✅ Botón para descargar PDF
✅ Listo para imprimir
✅ Genera automáticamente

---

## 5️⃣ PUBLICA EN INSTAGRAM

**Todos los textos están aquí:**
```
docs/INSTAGRAM_ESTRATEGIA.md
```

✅ Copia-pega listos
✅ Hashtags optimizados
✅ CTA efectivos

**Templates de diseño aquí:**
```
docs/INSTAGRAM_TEMPLATES.md
```

✅ Colores
✅ Tamaños
✅ Layouts

---

## 🎯 TODO ESTÁ HECHO

| Qué | Dónde | Estado |
|-----|-------|--------|
| Base de datos | `src/features/menu/data/menu.ts` | ✅ Hecho |
| Componente web | `src/components/menu/MenuCatalog.tsx` | ✅ Hecho |
| Componente PDF | `src/components/menu/MenuPDFExport.tsx` | ✅ Hecho |
| API PDF | `src/app/api/menu/generate-pdf/route.ts` | ✅ Hecho |
| Documentación | `docs/` (5 archivos) | ✅ Hecho |
| Fotos | `public/images/products/` | ⏳ Tú |

---

## 📱 3 FORMAS DE USAR TU CARTA

### 1. WEB
- Url: `/menu`
- Vista: Profesional, filtros, responsive

### 2. PDF
- Url: `/descargar-carta`
- Uso: Imprimir, compartir, WhatsApp

### 3. INSTAGRAM
- Textos: Copy-paste en `INSTAGRAM_ESTRATEGIA.md`
- Diseños: Templates en `INSTAGRAM_TEMPLATES.md`

---

## 🚀 ¡SIGUIENTE PASO!

1. Agrega tus fotos a `public/images/products/`
2. Test: `npm run dev` 
3. ¡Publica en Instagram!

---

**Más info en:** `GUIA_CARTA_DIGITAL.md`

✅ **WhatsApp configurado**

---

## 4️⃣ **Admin Panel - ¡YA ESTÁ LISTO!**

Solo accede a:
```
http://localhost:3000/admin/orders
```

### Qué ves:
- 📊 Estadísticas de órdenes
- 📋 Tabla de todas las órdenes
- 🔄 Botón para reembolsos
- 🔍 Filtros

✅ **Admin panel funcionando**

---

## 🧪 Ahora Testea

### Test 1: Hacer un pedido
```
1. Ve a http://localhost:3000/pedidos
2. Elige items
3. Completa datos: Nombre, Email, Teléfono
4. Haz clic en "Continuar al pago"
5. Usa tarjeta de prueba: 4242 4242 4242 4242
6. Fecha: 12/25
7. CVV: 123
8. Haz clic en Pagar
```

### Resultado esperado:
✅ Ves "¡Pedido confirmado!" en la web
✅ Recibes email de confirmación
✅ Recibes WhatsApp de confirmación

### Test 2: Ver en Admin
```
1. Ve a http://localhost:3000/admin/orders
2. Busca tu pedido en la tabla
3. Cambia estado a "Preparando"
4. Cambia a "Listo"
5. Cambia a "Completado"
```

### Test 3: Reembolso
```
1. En la tabla, haz clic en el menú (⋮)
2. Haz clic en "Reembolsar"
3. Escribe un motivo
4. Haz clic en "Confirmar Reembolso"
5. Cliente recibe email de reembolso
6. El dinero vuelve a su tarjeta en 3-5 días
```

---

## 🔧 .env.local FINAL

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." (opcional en dev)

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Resend Email
RESEND_API_KEY="re_..."

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your_token"
TWILIO_WHATSAPP_PHONE="+1234567890"
```

---

## ✅ Checklist

- [ ] Stripe keys en `.env.local`
- [ ] Resend key en `.env.local`
- [ ] Twilio credentials en `.env.local`
- [ ] Servidor corriendo: `npm run dev`
- [ ] Accedo a `/admin/orders`
- [ ] Test de pedido completado
- [ ] Recibí email
- [ ] Recibí WhatsApp
- [ ] Test de reembolso

---

## 🆘 Problemas?

### No recibo WhatsApp
- ¿El número de `TWILIO_WHATSAPP_PHONE` es correcto?
- ¿Agregaste el número en Twilio sandbox?
- Revisa logs en la terminal

### No recibo email
- ¿RESEND_API_KEY es correcto?
- Revisa la carpeta de spam
- Mira logs en la terminal

### Webhook no funciona
- En desarrollo: No es necesario, funciona igual
- En producción: Configura como se indica en COMPLETE_SETUP.md

---

## 🚀 ¡LISTO!

Ya tienes:
✅ Pagos con Stripe
✅ Notificaciones por WhatsApp
✅ Emails automáticos
✅ Panel admin para ver órdenes
✅ Sistema de reembolsos

**Siguiente:** Agregar login al admin panel (opcional)

---

Cualquier duda, revisa `COMPLETE_SETUP.md` para más detalles.
