'use server'

import { prisma } from '@/lib/prisma'

/**
 * Registra un evento de analytics
 */
export async function trackEvent(
  type: string,
  data: {
    orderId?: string
    productId?: string
    userId?: string
    channel?: string
    metadata?: Record<string, any>
  }
) {
  try {
    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        orderId: data.orderId,
        productId: data.productId,
        userId: data.userId,
        channel: data.channel,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    })

    return event
  } catch (error) {
    console.error('Error tracking event:', error)
    // No throw - analytics errors shouldn't break user flow
    return null
  }
}

/**
 * Obtiene KPIs de ingresos
 */
export async function getRevenueKPIs() {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3))

    const [todayRevenue, monthRevenue, quarterRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, status: 'COMPLETED' },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: lastMonth }, status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: threeMonthsAgo }, status: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ])

    const avgTicket =
      todayRevenue._count > 0
        ? Math.round((todayRevenue._sum.totalAmount || 0) / todayRevenue._count)
        : 0

    return {
      today: todayRevenue._sum.totalAmount || 0,
      month: monthRevenue._sum.totalAmount || 0,
      quarter: quarterRevenue._sum.totalAmount || 0,
      ordersToday: todayRevenue._count,
      avgTicket,
      currency: 'EUR'
    }
  } catch (error) {
    console.error('Error fetching revenue KPIs:', error)
    return {
      today: 0,
      month: 0,
      quarter: 0,
      ordersToday: 0,
      avgTicket: 0,
      currency: 'EUR'
    }
  }
}

/**
 * Obtiene órdenes por canal (WEB, GLOVO, UBEREATS, etc)
 */
export async function getOrdersByChannel() {
  try {
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))

    const channels = await prisma.orderChannelMetadata.groupBy({
      by: ['channel'],
      where: { createdAt: { gte: lastMonth } },
      _count: true
    })

    const total = channels.reduce((sum: number, ch: any) => sum + ch._count, 0)

    return channels.map((ch: any) => ({
      channel: ch.channel || 'UNKNOWN',
      count: ch._count,
      percentage: total > 0 ? Math.round((ch._count / total) * 100) : 0
    }))
  } catch (error) {
    console.error('Error fetching orders by channel:', error)
    return []
  }
}

/**
 * Obtiene top productos
 */
export async function getTopProducts(limit = 5) {
  try {
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { createdAt: { gte: lastMonth }, status: 'COMPLETED' }
      },
      _sum: { quantity: true, subtotal: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit
    })

    // Enriquecer con datos del producto
    const enriched = await Promise.all(
      topProducts.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true }
        })
        return { ...item, product }
      })
    )

    return enriched.map((item: any) => ({
      id: item.productId,
      name: item.product?.name || 'Producto sin nombre',
      quantity: item._sum.quantity || 0,
      revenue: item._sum.subtotal || 0
    }))
  } catch (error) {
    console.error('Error fetching top products:', error)
    return []
  }
}

/**
 * Obtiene tendencia de ingresos (últimos N días)
 */
export async function getRevenueTrend(days = 7) {
  try {
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })

    const trend = await Promise.all(
      dates.map(async (date) => {
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)

        const dayData = await prisma.order.aggregate({
          where: {
            createdAt: { gte: date, lt: nextDate },
            status: 'COMPLETED'
          },
          _sum: { totalAmount: true },
          _count: true
        })

        return {
          date: date.toISOString().split('T')[0],
          revenue: dayData._sum.totalAmount || 0,
          orders: dayData._count
        }
      })
    )

    return trend
  } catch (error) {
    console.error('Error fetching revenue trend:', error)
    return []
  }
}

/**
 * Obtiene conversión (MENU_ACCESSED -> ORDER_CREATED)
 */
export async function getConversionMetrics() {
  try {
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))

    const [menuViews, checkouts, orders] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { type: 'MENU_ACCESSED', createdAt: { gte: lastMonth } }
      }),
      prisma.analyticsEvent.count({
        where: { type: 'CHECKOUT_COMPLETED', createdAt: { gte: lastMonth } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: lastMonth }, status: { in: ['COMPLETED', 'PENDING'] } }
      })
    ])

    return {
      menuViews,
      checkouts,
      orders,
      viewToCheckout: menuViews > 0 ? ((checkouts / menuViews) * 100).toFixed(2) + '%' : '0%',
      checkoutToOrder: checkouts > 0 ? ((orders / checkouts) * 100).toFixed(2) + '%' : '0%'
    }
  } catch (error) {
    console.error('Error fetching conversion metrics:', error)
    return {
      menuViews: 0,
      checkouts: 0,
      orders: 0,
      viewToCheckout: '0%',
      checkoutToOrder: '0%'
    }
  }
}

/**
 * Obtiene órdenes por estado
 */
export async function getOrdersByStatus() {
  try {
    const statuses = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    })

    return Object.fromEntries(statuses.map((s: any) => [s.status, s._count]))
  } catch (error) {
    console.error('Error fetching orders by status:', error)
    return {}
  }
}

/**
 * Obtiene métodos de pago utilizados
 */
export async function getPaymentMethodStats() {
  try {
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))

    const methods = await prisma.order.groupBy({
      by: ['paymentMethod'],
      where: { createdAt: { gte: lastMonth } },
      _count: true,
      _sum: { totalAmount: true }
    })

    return methods
  } catch (error) {
    console.error('Error fetching payment method stats:', error)
    return []
  }
}
