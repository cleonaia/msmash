import { PageHeader } from "@/components/ui/PageHeader";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { RestaurantInfo } from "@/components/reservations/RestaurantInfo";

export default function ReservasPage() {
  return (
    <div>
      <PageHeader
        title="Reservas y encargos"
        subtitle="Coordiná tus pedidos para asados, eventos privados o entregas a domicilio"
        backgroundImage="https://speedy.uenicdn.com/c2e720ac-5428-4cd8-a240-55d5ced204a1/c1536_a/image/upload/v1627589082/business/96173785-c54c-430c-967a-95c08f9e1b48.jpg"
      />

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.92)_0%,rgba(48,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)]" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card-strong gradient-border rounded-3xl p-8 shadow-[0_25px_120px_-60px_rgba(227,58,32,0.55)]">
          <ReservationForm />
        </div>
          <RestaurantInfo />
        </div>
      </section>
    </div>
  );
}
