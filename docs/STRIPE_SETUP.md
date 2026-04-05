# 🔐 Guía de Instalación de Stripe en Smash Burger

## ✅ Lo que se ha instalado

- Dependencias de Stripe: `stripe` + `@stripe/react-stripe-js`
- **2 rutas API**: Crear sesión de checkout + Webhook
- **3 componentes**:
  - `StripeCheckout.tsx` - Formulario de pago embebido
  - `OrderCheckout.tsx` - Flujo completo de pedido (datos + pago)
- **Server actions** para crear órdenes en bases de datos
- Variables de entorno configuradas en `.env.local`

---

## 🔑 Paso 1: Obtener claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crea una cuenta (gratis)
3. Ve a **Developers** → **API keys**
4. Copia:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

---

## ⚙️ Paso 2: Configurar variables de entorno

Abre `/msmash/.env.local` y reemplaza:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_tu_clave_aqui"
STRIPE_SECRET_KEY="sk_test_tu_clave_aqui"
```

Opcionalmente, configura el webhook (más abajo).

---

## 🪝 Paso 3: Configurar Webhook (opcional pero recomendado)

El webhook es lo que confirma automáticamente los pagos en tu base de datos.

### En Stripe Dashboard:
1. **Developers** → **Webhooks**
2. Click en **+ Add endpoint**
3. URL del evento: `https://tudominio.com/api/stripe/webhook`
   - En desarrollo local, usa Stripe CLI (ver abajo)
4. Events: Selecciona:
   - ✅ `checkout.session.completed`
   - ✅ `charge.failed`
   - ✅ `charge.refunded`
5. Copia el **signing secret** (`whsec_...`)

### En tu `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET="whsec_tu_secret_aqui"
```

### Para desarrollo local con Stripe CLI:

```bash
# Instala Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Autentica tu cuenta
stripe login

# Escucha eventos en local y reenvía a tu app
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copia el signing secret que aparece en la terminal
```

---

## 🚀 Paso 4: Usar el componente en tu app

### Opción A: Componente simple (solo pago)
```tsx
import StripeCheckout from '@/components/stripe/StripeCheckout'

<StripeCheckout 
  orderId="order_123"
  onSuccess={() => console.log('¡Pago exitoso!')}
/>
```

### Opción B: Flujo completo (datos + pago) ⭐ RECOMENDADO
```tsx
import OrderCheckout from '@/components/checkout/OrderCheckout'

<OrderCheckout
  cartItems={[
    { id: '1', name: 'Burger Clásica', price: 1299, quantity: 2 }
  ]}
  totalAmount={2598}
  onOrderComplete={(orderId) => console.log('Orden completa:', orderId)}
/>
```

---

## 📊 Base de datos: campos actualizados

El modelo `Order` ya tiene campos para Stripe:

```prisma
model Order {
  ...
  stripePaymentId  String?           // ID de la sesión
  paymentStatus    String            // PENDING, COMPLETED, FAILED
  paymentMethod    String            // STRIPE, LOCAL, etc
  ...
}
```

---

## 🧪 Modo TEST (números de tarjeta)

Usa estas tarjetas para probar:

| Tarjeta | Número | Resultado |
|---------|--------|-----------|
| Visa exitoso | `4242 4242 4242 4242` | ✅ Pago exitoso |
| Fallo | `4000 0000 0000 0002` | ❌ Pago rechazado |
| Autenticación | `4000 0025 0000 3155` | 🔐 Pide 3D Secure |

**Fecha/CVV:** Cualquiera en el futuro (ej: 12/25 / 123)

---

## 🔒 ¿Cómo funciona el flujo?

```
Usuario → Completa datos → Crea Orden (PENDING) → Paga con Stripe
                                                         ↓
                                        Stripe notifica al webhook
                                                         ↓
                    Webhook actualiza orden (COMPLETED) en BD
                                                         ↓
                            ¡Pago confirmado en la app!
```

---

## 🐛 Solucionar problemas

### ❌ Error: "STRIPE_SECRET_KEY is not defined"
→ Verifica que `.env.local` esté en `/msmash/.env.local` (no en la raíz)

### ❌ Error: "sessionId is undefined"
→ Asegúrate de que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sea correcta

### ❌ El webhook no funciona
→ En local, usa `stripe listen` (ver arriba)
→ En producción, usa la URL pública en Stripe Dashboard

---

## 📝 Próximos pasos

- [ ] Conectar WhatsApp para confirmar pedidos
- [ ] Panel de admin para ver órdenes pagadas
- [ ] Email de confirmación automático
- [ ] Sistema de reembolsos

---

¿Necesitas ayuda? 😊
