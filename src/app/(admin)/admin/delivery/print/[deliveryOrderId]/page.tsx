import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AutoPrint from './AutoPrint'

export const dynamic = 'force-dynamic'

type PrintDeliveryOrderPageProps = {
  params: Promise<{
    deliveryOrderId: string
  }>
}

function formatMoney(cents: number) {
  return `${(cents / 100).toFixed(2)} EUR`
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function PrintDeliveryOrderPage({ params }: PrintDeliveryOrderPageProps) {
  const { deliveryOrderId } = await params
  const order = await prisma.deliveryOrder.findUnique({
    where: { id: deliveryOrderId }
  })

  if (!order) {
    notFound()
  }

  let items: Array<{ name: string; quantity: number; price: number }> = []

  try {
    const parsed = JSON.parse(order.items || '[]')
    if (Array.isArray(parsed)) {
      items = parsed.map((item: any) => ({
        name: String(item?.name || item?.title || 'Producto'),
        quantity: Number(item?.quantity || 1),
        price: Number(item?.price || item?.unitPrice || 0)
      }))
    }
  } catch {
    items = []
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <main className="min-h-screen bg-white text-black p-4 print:p-0">
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .ticket {
            width: 72mm;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.3;
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print mb-4 rounded border border-gray-300 px-4 py-2 text-sm text-gray-700">
        Esta vista se imprime automaticamente. Usa el dialogo de impresion del navegador.
      </div>

      <section className="ticket mx-auto w-[360px] max-w-full border border-dashed border-gray-400 p-3 font-mono text-[12px]">
        <header className="text-center">
          <p className="text-[16px] font-bold">M SMASH BURGER</p>
          <p>Ticket de delivery</p>
          <p>{formatDate(order.createdAt)}</p>
          <p>Pedido: {order.platformOrderId}</p>
        </header>

        <hr className="my-2 border-t border-dashed border-black" />

        <div className="space-y-1">
          <p>Plataforma: {order.platform}</p>
          <p>Cliente: {order.customerName}</p>
          <p>Telefono: {order.customerPhone || '-'}</p>
          <p>Estado: {order.status}</p>
        </div>

        <hr className="my-2 border-t border-dashed border-black" />

        <div>
          {items.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="mb-1">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1">{item.quantity}x {item.name}</p>
                <p>{formatMoney(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-2 border-t border-dashed border-black" />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex items-center justify-between text-[15px] font-bold">
            <span>TOTAL</span>
            <span>{formatMoney(order.totalAmount)}</span>
          </div>
        </div>

        <hr className="my-2 border-t border-dashed border-black" />

        <footer className="text-center">
          <p>Gracias por tu compra</p>
          <p>www.msmashburger.page</p>
        </footer>
      </section>
      <AutoPrint />
    </main>
  )
}
