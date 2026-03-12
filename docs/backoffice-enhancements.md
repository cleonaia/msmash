# Habilitar registro real y edición desde el panel interno

Este documento detalla los pasos necesarios para completar dos funcionalidades pendientes:

1. **Registro real de clientes** desde `/cliente/registro`.
2. **Gestión interna** (cambio de estados y edición ligera) para reservas y pedidos desde `/admin`.

Sigue las instrucciones en orden. Cada bloque incluye notas sobre seguridad y pruebas.

---

## 1. Registro real de clientes

### 1.1. Preparar utilidades de autenticación

1. Revisa `src/lib/password.ts`:
   - Ya existe `hashPassword` y `verifyPassword` (utilizados por NextAuth).
   - Si no hubiera `hashPassword`, créalo usando `argon2.hash`.

2. Asegúrate de tener el **rol por defecto** correcto en `prisma/schema.prisma` (`Role.CUSTOMER`). Ya está definido.

### 1.2. Crear la server action de registro

1. Crea `src/actions/auth/register.ts` (nuevo módulo):
   - Importa `zod`, `prisma`, `hashPassword`, `registerSchema` (de `src/lib/validation.ts`).
   - Valida la entrada con `registerSchema`.
   - Verifica si el email ya existe y devuelve mensaje de error si es así.
   - Hashea la contraseña y crea `User` + `Profile`:
     ```ts
     const user = await prisma.user.create({
       data: {
         email: data.email.toLowerCase(),
         passwordHash,
         role: "CUSTOMER",
         profile: {
           create: {
             firstName: data.firstName,
             lastName: data.lastName,
             marketingOptIn: data.marketingOptIn ?? false,
           },
         },
       },
     });
     ```
   - Retorna `{ success: boolean; message: string }`.
   - Opcional: inicia sesión automática con `signIn("credentials", ...)` si quieres conectarlo tras la creación (requiere que la server action sea usada desde un componente Cliente con `startTransition`).

2. Exporta el tipo de la respuesta para reutilizarlo en el formulario.

### 1.3. Conectar el formulario de registro

1. En `src/app/cliente/registro/page.tsx`:
   - Importa la nueva action.
   - Reemplaza el `console.info` por la llamada real:
     ```ts
     startTransition(() => {
       registerUser(values)
         .then((response) => {...})
         .catch(() => {...});
     });
     ```
   - Muestra mensajes de éxito/error según la respuesta.
   - Opcional: redirige automáticamente a `/cliente` tras registrar.

2. Considera habilitar la opción de aceptar términos antes de enviar la información.

### 1.4. Pruebas

1. Ejecuta `npm run dev` y registra un usuario nuevo.
2. Verifica en SQLite/Prisma Studio que el registro se creó (`User`, `Profile`).
3. Intenta registrarte con el mismo correo para verificar el mensaje de error.
4. Haz login con las nuevas credenciales (`/auth/ingresar`).

---

## 2. Habilitar edición interna desde el panel

Objetivo: permitir que el equipo cambie estados de **reservas** y **pedidos** sin acceder a Prisma Studio.

### 2.1. Crear actions protegidas

1. Crea `src/actions/admin/reservations.ts` y `src/actions/admin/orders.ts`.
2. Cada archivo debe exportar funciones como `updateReservationStatus`, `updateOrderStatus`, `updatePaymentStatus`, etc.
3. Dentro de cada action:
   - Usa `getServerSession(authOptions)` y verifica `session?.user?.role === "ADMIN"`. Si no, lanza error.
   - Valida input con Zod (estado permitido, IDs existentes).
   - Actualiza la entidad en Prisma y `revalidatePath("/admin")`.

#### Ejemplo de esquema Zod
```ts
const updateReservationSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
});
```

### 2.2. Actualizar el panel `/admin`

1. En `src/app/admin/page.tsx`, para cada listado (reservas y pedidos):
   - Añade botones o un `<select>` para cambiar el estado.
   - Usa formularios `<form action={updateReservationStatus}>` o `useTransition` desde componentes cliente si prefieres feedback inmediato.
   - Muestra notificaciones (por ejemplo, usando `useState` en componentes cliente para el resultado).

2. Para los pedidos, considera dos acciones:
   - `updateOrderStatus` (PENDING → PREPARING → COMPLETED → CANCELLED).
   - `updatePaymentStatus` (PENDING → PAID → REFUNDED).

3. Opcional: añade filtros en el panel para ver solo pendientes.

### 2.3. Seguridad y UX

- **Autorización**: toda action debe rechazar usuarios no admin.
- **Registro de actividad**: si quieres dejar traza, crea un modelo `AuditLog` y registra cada cambio (opcional).
- **Feedback**: muestra un indicador de carga mientras se actualiza el estado y un mensaje de confirmación.

### 2.4. Pruebas

1. Ejecuta `npm run dev`.
2. Ingresa a `/admin` con un usuario admin.
3. Cambia el estado de una reserva y verifica en la base de datos.
4. Repite para pedidos y pago.
5. Intenta la acción con un usuario cliente y confirma que recibe `Forbidden`.

---

## 3. Consideraciones adicionales

- **Emails automáticos**: si quieres enviar correo al confirmar/cancelar, reutiliza `sendReservationNotifications`/`sendOrderNotifications` y crea variantes (p. ej. `sendOrderStatusUpdate`). Ejecuta el envío dentro de las nuevas actions.
- **Stripe**: cuando actives pagos reales, sincroniza `paymentStatus` con los webhooks.
- **Validaciones extra**: agrega límites (p. ej., no cancelar orden ya completada) dentro de las actions.

---

## 4. Checklist final

- [ ] `registerUser` implementado y conectado al formulario.
- [ ] Usuarios nuevos pueden iniciar sesión inmediatamente.
- [ ] Actions de admin creadas con validación y controles de rol.
- [ ] Panel `/admin` actualizado con botones/selects para cambiar estados.
- [ ] Revalidación de rutas y feedback visual funcionando.
- [ ] Pruebas manuales realizadas (registro, login, cambios de estado, fallos controlados).

Con este plan podrás completar el registro real de clientes y dar control al carnicero desde el panel interno sin tocar la base manualmente.