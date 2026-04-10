import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/config/site'
import AutoPrint from './AutoPrint'

export const dynamic = 'force-dynamic'

type PrintOrderPageProps = {
  params: Promise<{
    orderId: string
  }>
}

type TicketOrder = {
  id: string
  createdAt: Date
  customerName: string
  customerPhone: string
  deliveryMethod: string
  paymentStatus: string
  paymentMethod: string
  status: string
  totalAmount: number
  notes: string | null
  items: Array<{
    id: string
    quantity: number
    subtotal: number
    productName: string
  }>
}

function getFallbackOrder(orderId: string): TicketOrder {
  return {
    id: orderId,
    createdAt: new Date(),
    customerName: 'Cliente',
    customerPhone: '-',
    deliveryMethod: 'Retiro en local',
    paymentStatus: 'PENDING',
    paymentMethod: 'LOCAL',
    status: 'PENDING',
    totalAmount: 0,
    notes: 'No se pudieron cargar todos los datos del ticket. Imprime este comprobante y revisa el pedido en admin.',
    items: []
  }
}

function getTestOrder(): TicketOrder {
  return {
    id: 'test-ticket-0001',
    createdAt: new Date(),
    customerName: 'Cliente de prueba',
    customerPhone: '600 000 000',
    deliveryMethod: 'Retiro en local',
    paymentStatus: 'PENDING',
    paymentMethod: 'LOCAL',
    status: 'PENDING',
    totalAmount: 2890,
    notes: 'Ticket de prueba TPV (puedes ignorarlo).',
    items: [
      {
        id: 'item-test-1',
        quantity: 1,
        subtotal: 1290,
        productName: 'The M Smash'
      },
      {
        id: 'item-test-2',
        quantity: 1,
        subtotal: 400,
        productName: 'Patatas'
      },
      {
        id: 'item-test-3',
        quantity: 1,
        subtotal: 1200,
        productName: 'Combo bebida'
      }
    ]
  }
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

function getReviewsQrUrl() {
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(siteConfig.googleReviewsUrl)}&color=111111&bgcolor=ffffff&qzone=1`
}

function getPaymentMethodLabel(method: string) {
  const normalized = String(method || '').toUpperCase()

  if (normalized === 'STRIPE') return 'Tarjeta online'
  if (normalized === 'DATAPHONE' || normalized === 'TPV' || normalized === 'CARD_PRESENT') return 'Datáfono'
  if (normalized === 'CASH') return 'Efectivo'
  if (normalized === 'LOCAL') return 'Pago local'

  return normalized || 'Sin definir'
}

export default async function PrintOrderPage({ params }: PrintOrderPageProps) {
  const { orderId } = await params
  const isTestTicket = orderId === 'test-ticket'

  let order: TicketOrder
  let printableItems: Array<{ id: string; quantity: number; subtotal: number; productName: string }> = []

  try {
    const baseOrder = isTestTicket
      ? getTestOrder()
      : await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: true
          }
        })

    if (!baseOrder) {
      notFound()
    }

    order = baseOrder as TicketOrder

    const productIds = Array.from(
      new Set((baseOrder.items || []).map((item: any) => item.productId).filter(Boolean))
    )
    const products = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true }
        })
      : []

    const productNames = new Map(products.map((product) => [product.id, product.name]))

    printableItems = (baseOrder.items || []).map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      subtotal: item.subtotal,
      productName:
        item.productName ||
        productNames.get(item.productId) ||
        (item.productId ? `Producto ${String(item.productId).slice(-6)}` : 'Producto')
    }))
  } catch (error) {
    console.error('Print order page failed, using fallback ticket:', error)
    order = getFallbackOrder(orderId)
    printableItems = order.items
  }

  const itemCount = printableItems.reduce((acc, item) => acc + item.quantity, 0)

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
          <p>{isTestTicket ? 'Ticket de prueba' : 'Ticket de pedido'}</p>
          <p>{formatDate(order.createdAt)}</p>
          <p>Pedido: #{order.id.slice(-8)}</p>
        </header>

        <hr className="my-2 border-t border-dashed border-black" />

        <div className="space-y-1">
          <p>Cliente: {order.customerName}</p>
          <p>Telefono: {order.customerPhone}</p>
          <p>Entrega: {order.deliveryMethod}</p>
          <p>Pago: {order.paymentStatus} ({getPaymentMethodLabel(order.paymentMethod)})</p>
          <p>Estado: {order.status}</p>
        </div>

        <hr className="my-2 border-t border-dashed border-black" />

        <div>
          {printableItems.map((item) => (
            <div key={item.id} className="mb-1">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1">{item.quantity}x {item.productName}</p>
                <p>{formatMoney(item.subtotal)}</p>
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

        {order.notes ? (
          <>
            <hr className="my-2 border-t border-dashed border-black" />
            <div>
              <p className="font-bold">Notas:</p>
              <p>{order.notes}</p>
            </div>
          </>
        ) : null}

        <hr className="my-2 border-t border-dashed border-black" />

        <footer className="text-center">
          <p>!Gracias por tu compra!</p>
          <p className="mt-1 text-[11px]">¿Te gustó? Déjanos tu reseña</p>
          <div className="mt-2 flex justify-center">
            <img
              src={getReviewsQrUrl()}
              alt="QR reseñas Google"
              width={70}
              height={70}
              className="border border-dashed border-black p-1"
            />
          </div>
          <p>www.msmashburger.page</p>
        </footer>
      </section>
      <AutoPrint />
    </main>
  )
}
