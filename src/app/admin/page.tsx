import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ReservationStatusControls } from "@/components/admin/ReservationStatusControls";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center text-white/70">
        <h1 className="text-3xl font-semibold text-white">Necesitás iniciar sesión</h1>
        <p className="max-w-md text-sm">
          Ingresá con tu cuenta de Quebracho para ver el panel de gestión.
        </p>
        <Button href="/auth/ingresar">Ir a iniciar sesión</Button>
      </div>
    );
  }

  if (session.user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center text-white/70">
        <h1 className="text-3xl font-semibold text-white">Acceso restringido</h1>
        <p className="max-w-md text-sm">
          Este panel es exclusivo para el equipo de Quebracho. Si necesitás acceso, contactá al administrador.
        </p>
        <Button href="/">Volver al inicio</Button>
      </div>
    );
  }

  const now = new Date();

  const [
    reservationCount,
    pendingReservationCount,
    orderCount,
    pendingOrderCount,
    messageCount,
  ] = await prisma.$transaction([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count(),
  ]);

  const upcomingReservations = await prisma.reservation.findMany({
    where: { reservationDate: { gte: now } },
    orderBy: { reservationDate: "asc" },
    take: 5,
  });

  const latestOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const latestMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const reservationStatusLabels = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    CANCELLED: "Cancelada",
  } as const;

  const orderStatusLabels = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    PREPARING: "En preparación",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  } as const;

  const paymentStatusLabels = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    REFUNDED: "Reintegrado",
  } as const;

  return (
    <div className="space-y-10 px-4 py-24 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Panel interno</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Bienvenida, {session.user?.name ?? session.user?.email}</h1>
        <p className="mt-2 text-sm text-white/70">
          Revisá el pulso del negocio: reservas del restaurante, pedidos de la tienda y mensajes de clientes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Total reservas: {reservationCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Reservas pendientes: {pendingReservationCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Pedidos tienda: {orderCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Pedidos por confirmar: {pendingOrderCount}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            Mensajes: {messageCount}
          </span>
        </div>
      </header>

        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-3">
          <Button href="/admin/blog" variant="secondary" size="sm">
            Gestionar blog & recetas
          </Button>
        </div>

      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[rgba(18,2,0,0.7)] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Próximas reservas</h2>
              <p className="text-sm text-white/60">Confirmá mesas y prepará el salón.</p>
            </div>
            <Button href="/reservas" variant="secondary" size="sm">
              Ver agenda
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {upcomingReservations.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60">
                Aún no hay reservas próximas en el sistema.
              </p>
            ) : (
              upcomingReservations.map((reservation: (typeof upcomingReservations)[number]) => (
                <article
                  key={reservation.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">{reservation.name}</p>
                      <p>{reservation.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">
                        {reservation.guests} comensales
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                        {reservationStatusLabels[reservation.status as keyof typeof reservationStatusLabels] ?? reservation.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/80">{formatDateTime(reservation.reservationDate)}</p>
                  {reservation.notes ? (
                    <p className="mt-2 text-xs text-white/60">Notas: {reservation.notes}</p>
                  ) : null}
                  <div className="mt-4">
                    <ReservationStatusControls reservationId={reservation.id} initialStatus={reservation.status} />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[rgba(18,2,0,0.7)] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Últimos pedidos</h2>
              <p className="text-sm text-white/60">Seguimiento del ecommerce y encargos.</p>
            </div>
            <Button href="/tienda" variant="secondary" size="sm">
              Ver tienda
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {latestOrders.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60">
                Todavía no hay pedidos registrados.
              </p>
            ) : (
              latestOrders.map((order: (typeof latestOrders)[number]) => (
                <article key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">{order.customerName}</p>
                      <p>{order.customerEmail}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">
                        {orderStatusLabels[order.status as keyof typeof orderStatusLabels] ?? order.status}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                        Pago {paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels] ?? order.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-white/80">Total: {formatCurrency(order.totalAmount / 100)}</p>
                  <p className="text-xs text-white/50">Creado el {formatDate(order.createdAt)}</p>
                  {order.notes ? <p className="mt-2 text-xs text-white/60">Notas: {order.notes}</p> : null}
                  <ul className="mt-3 space-y-1 text-xs text-white/60">
                    {order.items.map((item: (typeof order.items)[number]) => (
                      <li key={item.id}>
                        {item.quantity}x {item.product?.name ?? "Producto"}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <OrderStatusControls
                      orderId={order.id}
                      initialStatus={order.status}
                      initialPaymentStatus={order.paymentStatus}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[rgba(18,2,0,0.7)] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Consultas recientes</h2>
            <p className="text-sm text-white/60">Respondé rápido para fidelizar a los clientes.</p>
          </div>
          <Button href="/contacto" variant="secondary" size="sm">
            Ver formulario
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          {latestMessages.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60">
              No hay mensajes nuevos por el momento.
            </p>
          ) : (
            latestMessages.map((message: (typeof latestMessages)[number]) => (
              <article key={message.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-white">{message.name}</p>
                    <p>{message.email}</p>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">
                    {message.subject}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/50">Recibido el {formatDateTime(message.createdAt)}</p>
                <p className="mt-2 text-sm text-white/80">{message.message}</p>
                {message.phone ? (
                  <p className="mt-2 text-xs text-white/60">Teléfono: {message.phone}</p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
