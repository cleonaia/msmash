# 🚀 Guía Completa: Stripe + WhatsApp + Email + Admin Panel + Reembolsos

## ✅ Todo lo que se ha implementado

### 1️⃣ **Stripe** ✅
- ✅ Sesiones de checkout
- ✅ Webhooks de confirmación automática
- ✅ Sistema de reembolsos
- ✅ Integración con BD

### 2️⃣ **WhatsApp** ✅ (Twilio)
- ✅ Confirmación de pedido automática
- ✅ Notificación de pago fallido
- ✅ Mensajes personalizados con datos del pedido

### 3️⃣ **Email** ✅ (Resend + SMTP)
- ✅ Confirmación de pedido
- ✅ Notificación de pago fallido
- ✅ Email de reembolso
- ✅ Templates HTML profesionales

### 4️⃣ **Panel Admin** ✅
- ✅ Dashboard de estadísticas en tiempo real
- ✅ Filtros avanzados (estado, pago, fecha)
- ✅ Ver todas las órdenes pagadas
- ✅ Cambiar estados de órdenes
- ✅ Procesar reembolsos directamente

---

## ⚙️ Configuración Paso a Paso

### 📍 **PASO 1: Configurar Stripe** (ya hecho)

1. Ve a https://dashboard.stripe.com/
2. Obtén tus claves:
   - **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** → `STRIPE_SECRET_KEY`
3. Configurar webhook:
   - **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://tudominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `charge.failed`, `charge.refunded`
   - **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

---

### 📱 **PASO 2: Configurar WhatsApp con Twilio**

#### Crear cuenta Twilio:
1. Ve a https://www.twilio.com/
2. Crea una cuenta (gratis con crédito)
3. Ve a **Phone Numbers** → **Manage** → **Verified Caller IDs**
4. O compra un número de Twilio
5. Ve a **Messaging** → **Services** → **WhatsApp** → **Try it out**

#### Obtener credenciales:
1. **Account SID** → `TWILIO_ACCOUNT_SID`
2. **Auth Token** → `TWILIO_AUTH_TOKEN`
3. **WhatsApp Phone** → `TWILIO_WHATSAPP_PHONE` (ej: `+1234567890`)

#### En `.env.local`:
```bash
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_WHATSAPP_PHONE="+1234567890"
```

#### Permitir números de cliente (sandbox mode):
1. En Twilio Console → **Messaging** → **Services** → **WhatsApp**
2. Agrega los números de cliente que quieras permitir
3. Cada cliente recibirá un link para validarse

#### Producción (números reales):
- Obtén un número de Twilio
- Aprueba tu aplicación en WhatsApp Business
- Configura webhooks

---

### 📧 **PASO 3: Configurar Email**

#### Opción A: **Resend** (recomendado, más fácil)

1. Ve a https://resend.com/
2. Crea una cuenta gratis
3. Obtén tu **API Key**
4. En `.env.local`:
```bash
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

**✅ Listo, los emails se enviarán automáticamente**

---

#### Opción B: **Gmail SMTP** (alternativa)

1. Abre tu cuenta de Gmail
2. Activa **2-Step Verification**
3. Ve a **App Passwords** https://myaccount.google.com/apppasswords
4. Selecciona **Mail** + **Windows Computer** → Copia la contraseña
5. En `.env.local`:
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="contraseña-de-app-16-caraceres"
SMTP_FROM="orders@smashburger.com"
```

---

### 🔐 **PASO 4: Configurar Admin Panel**

El panel de admin está en: `/admin/orders`

Para acceder (por ahora sin autenticación, agregar después):
- URL: `http://localhost:3000/admin/orders`

Credenciales placeholder (cambiar en producción):
```bash
ADMIN_EMAIL="admin@smashburger.com"
ADMIN_PASSWORD="change-me-in-production"
```

---

## 🔗 Integración en la página de pedidos

Ya está integrado automáticamente, pero aquí está lo que sucede:

```
Usuario hace pedido
    ↓
Completa datos personales
    ↓
Realiza pago con Stripe (tarjeta)
    ↓
Stripe confirma pago
    ↓
Webhook dispara notificaciones:
    📧 Email de confirmación
    📱 WhatsApp de confirmación
    ✅ Orden guardada como "CONFIRMED"
    ↓
Admin ve orden en panel en tiempo real
    ↓
Admin puede:
    • Cambiar estado (Preparando → Listo → Completado)
    • Procesar reembolso
    • Enviar email adicional
```

---

## 🧪 Probar Todo

### Test Stripe:
- Tarjeta: `4242 4242 4242 4242`
- Fecha: `12/25`
- CVV: `123`

### Test WhatsApp:
- Twilio está en **sandbox mode**
- Necesitas permitir números específicos en Dashboard
- Los mensajes de prueba van al número configurado

### Test Email:
- Se envían automáticamente cuando configurado
- Revisa spam si no ves el email

---

## 📊 Variables de entorno COMPLETAS

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="ACxxxxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_WHATSAPP_PHONE="+1234567890"

# Email (elige uno)
RESEND_API_KEY="re_xxxxx"
# O
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu@gmail.com"
SMTP_PASSWORD="app_password"
SMTP_FROM="orders@smashburger.com"

# Admin
ADMIN_EMAIL="admin@smashburger.com"
ADMIN_PASSWORD="change-me"
```

---

## ✨ Funcionalidades Disponibles

### ✅ **Clientes ven:**
- ✅ Formulario de pedido integrado
- ✅ Pago seguro con Stripe
- ✅ Confirmación inmediata por WhatsApp + Email
- ✅ Página de éxito con details

### ✅ **Admin puede:**
- ✅ Ver todas las órdenes en tiempo real
- ✅ Filtrar por estado, pago, fecha
- ✅ Cambiar estado de órdenes
- ✅ Procesar reembolsos (Stripe integrado)
- ✅ Ver estadísticas en el dashboard
- ✅ Contactar clientes por email

### ✅ **Automatizaciones:**
- ✅ Confirmación automática por WhatsApp cuando se paga
- ✅ Email automático con detalles del pedido
- ✅ Notificación cuando pago falla
- ✅ Email cuando se procesa reembolso
- ✅ Webhook de Stripe en tiempo real

---

## 🧹 Clean Up / Próximos pasos

### Antes de producción:
1. [ ] Cambiar `ADMIN_PASSWORD` en `.env.local`
2. [ ] Agregar autenticación real al admin
3. [ ] Verificar números de teléfono en Twilio sandbox
4. [ ] Configurar dominio de email en Resend
5. [ ] Testear flujo completo de pago
6. [ ] Configurar webhooks en producción

### Features opcionales:
- [ ] SMS como fallback si WhatsApp falla
- [ ] Recordatorios por email si no recogen el pedido
- [ ] Descuentos y cupones
- [ ] Sistema de puntos/lealtad

---

## 🆘 Troubleshooting

### ❌ WhatsApp no se envía
→ ¿Tienes un número permitido en Twilio sandbox?
→ ¿Las credenciales de Twilio son correctas?

### ❌ Email no se envía
→ ¿Tienes RESEND_API_KEY o SMTP configurados?
→ ¿El SMTP_PASSWORD es la **app password** no la contraseña de Gmail?

### ❌ Webhook no funciona
→ En local: usa `stripe listen --forward-to localhost:3000/api/stripe/webhook`
→ En producción: verifica que la URL sea pública

### ❌ Reembolso falla
→ ¿La orden fue pagada con Stripe (no LOCAL)?
→ ¿El payment_intent es válido?

---

## 📞 Soporte

Si algo no funciona, revisa:
1. `.env.local` - todas las claves configuradas?
2. Logs en la terminal - ¿hay errores?
3. Stripe Dashboard - ¿eventos llegando?
4. Twilio Console - ¿logs de WhatsApp?

¡Listo! 🚀
