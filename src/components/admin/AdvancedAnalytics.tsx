'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDeliveryOrders } from '@/actions/delivery'

type PlatformType = 'UBEREATS' | 'GLOVO' | 'DELIVEROO' | 'JUSTEAT'

interface DeliveryOrderItem {
  name: string
  quantity: number
  price: number
}

interface DeliveryOrderView {
  id: string
  platform: string
  status: string
  totalPrice: number
  currency: string
  receivedAt: string | Date
  deliveredAt?: string | Date | null
  items: DeliveryOrderItem[]
}

interface PlatformMetrics {
  platform: string
  todayOrders: number
  todayRevenue: number
  monthOrders: number
  monthRevenue: number
  avgTicket: number
  completionRate: number
  avgDeliveryTime: number
  growthRate: number
}

interface AnalyticsData {
  metrics: Record<PlatformType, PlatformMetrics>
  topProducts: Array<{ name: string; quantity: number; revenue: number; platform: string }>
  hourlyDistribution: Array<{ hour: string; ubereats: number; glovo: number; deliveroo: number; justeat: number }>
  statusDistribution: Array<{ status: string; count: number; percentage: number }>
}

const PLATFORMS: PlatformType[] = ['UBEREATS', 'GLOVO', 'DELIVEROO', 'JUSTEAT']

const PLATFORM_LABELS: Record<PlatformType, string> = {
  UBEREATS: 'UberEats',
  GLOVO: 'Glovo',
  DELIVEROO: 'Deliveroo',
  JUSTEAT: 'Just Eat'
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function sumRevenue(orders: DeliveryOrderView[]) {
  return orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
}

function toTitleStatus(status: string) {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'received') return 'Recibido'
  if (normalized === 'accepted') return 'Aceptado'
  if (normalized === 'prepared') return 'Preparado'
  if (normalized === 'collected') return 'Recogido'
  if (normalized === 'delivered') return 'Entregado'
  if (normalized === 'cancelled') return 'Cancelado'

  return status || 'Desconocido'
}

export function AdvancedAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'performance'>('revenue')

  const periodDays = useMemo(() => {
    if (timeframe === 'today') return 1
    if (timeframe === 'week') return 7
    return 30
  }, [timeframe])

  const loadAnalytics = useCallback(async () => {
    setLoading(true)

    try {
      const lookbackDays = Math.max(periodDays * 2, 30)
      const orders = (await getDeliveryOrders(lookbackDays)) as DeliveryOrderView[]

      const now = new Date()
      const currentStart = new Date(now)
      currentStart.setHours(0, 0, 0, 0)
      currentStart.setDate(currentStart.getDate() - (periodDays - 1))

      const previousStart = new Date(currentStart)
      previousStart.setDate(previousStart.getDate() - periodDays)

      const currentOrders = orders.filter((order) => {
        const received = toDate(order.receivedAt)
        return received ? received >= currentStart : false
      })

      const previousOrders = orders.filter((order) => {
        const received = toDate(order.receivedAt)
        return received ? received >= previousStart && received < currentStart : false
      })

      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 0, 0)

      const metrics = PLATFORMS.reduce((acc, platform) => {
        const currentPlatformOrders = currentOrders.filter((o) => o.platform === platform)
        const previousPlatformOrders = previousOrders.filter((o) => o.platform === platform)

        const todayPlatformOrders = currentPlatformOrders.filter((o) => {
          const received = toDate(o.receivedAt)
          return received ? received >= todayStart : false
        })

        const deliveredCount = currentPlatformOrders.filter((o) => String(o.status).toLowerCase() === 'delivered').length
        const completionRate = currentPlatformOrders.length > 0
          ? (deliveredCount / currentPlatformOrders.length) * 100
          : 0

        const avgDeliveryDurations = currentPlatformOrders
          .map((order) => {
            const start = toDate(order.receivedAt)
            const end = toDate(order.deliveredAt)
            if (!start || !end) return null
            const minutes = Math.round((end.getTime() - start.getTime()) / 60000)
            return minutes > 0 ? minutes : null
          })
          .filter((value): value is number => value !== null)

        const avgDeliveryTime = avgDeliveryDurations.length > 0
          ? Math.round(avgDeliveryDurations.reduce((sum, value) => sum + value, 0) / avgDeliveryDurations.length)
          : 0

        const currentCount = currentPlatformOrders.length
        const previousCount = previousPlatformOrders.length
        const growthRate = previousCount > 0
          ? ((currentCount - previousCount) / previousCount) * 100
          : currentCount > 0
            ? 100
            : 0

        const monthRevenue = sumRevenue(currentPlatformOrders)
        const todayRevenue = sumRevenue(todayPlatformOrders)

        acc[platform] = {
          platform: PLATFORM_LABELS[platform],
          todayOrders: todayPlatformOrders.length,
          todayRevenue,
          monthOrders: currentCount,
          monthRevenue,
          avgTicket: currentCount > 0 ? monthRevenue / currentCount : 0,
          completionRate,
          avgDeliveryTime,
          growthRate
        }

        return acc
      }, {} as Record<PlatformType, PlatformMetrics>)

      const productsMap = new Map<string, { name: string; quantity: number; revenue: number; platform: string }>()

      for (const order of currentOrders) {
        for (const item of Array.isArray(order.items) ? order.items : []) {
          const key = item.name.trim().toLowerCase()
          const prev = productsMap.get(key)
          const quantity = Number(item.quantity || 0)
          const price = Number(item.price || 0)
          const revenue = price > 1000 ? (price / 100) * quantity : price * quantity

          if (!prev) {
            productsMap.set(key, {
              name: item.name || 'Producto',
              quantity,
              revenue,
              platform: PLATFORM_LABELS[(order.platform as PlatformType) || 'UBEREATS'] || 'Delivery'
            })
          } else {
            prev.quantity += quantity
            prev.revenue += revenue
          }
        }
      }

      const topProducts = Array.from(productsMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      const hoursMap = new Map<number, { ubereats: number; glovo: number; deliveroo: number; justeat: number }>()

      for (const order of currentOrders) {
        const received = toDate(order.receivedAt)
        if (!received) continue
        const hour = received.getHours()
        const row = hoursMap.get(hour) ?? { ubereats: 0, glovo: 0, deliveroo: 0, justeat: 0 }

        if (order.platform === 'UBEREATS') row.ubereats += 1
        if (order.platform === 'GLOVO') row.glovo += 1
        if (order.platform === 'DELIVEROO') row.deliveroo += 1
        if (order.platform === 'JUSTEAT') row.justeat += 1

        hoursMap.set(hour, row)
      }

      const hourlyDistribution = Array.from(hoursMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([hour, values]) => ({
          hour: `${String(hour).padStart(2, '0')}h`,
          ...values
        }))

      const statusCount = new Map<string, number>()
      for (const order of currentOrders) {
        const status = toTitleStatus(order.status)
        statusCount.set(status, (statusCount.get(status) || 0) + 1)
      }

      const statusDistribution = Array.from(statusCount.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: currentOrders.length > 0 ? (count / currentOrders.length) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count)

      setData({
        metrics,
        topProducts,
        hourlyDistribution,
        statusDistribution
      })
    } catch (error) {
      console.error('Error loading advanced analytics:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [periodDays])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  if (loading || !data) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const platforms = Object.values(data.metrics)
  const totalRevenue = platforms.reduce((sum, p) => sum + p.monthRevenue, 0)
  const totalOrders = platforms.reduce((sum, p) => sum + p.monthOrders, 0)
  const avgCompletionRate = platforms.length > 0
    ? platforms.reduce((sum, p) => sum + p.completionRate, 0) / platforms.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {(['today', 'week', 'month'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              timeframe === tf ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tf === 'today' ? 'Hoy' : tf === 'week' ? 'Esta semana' : 'Este mes'}
          </button>
        ))}

        <div className="flex-1" />

        {(['revenue', 'orders', 'performance'] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              selectedMetric === metric ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {metric === 'revenue' ? '💰 Ingresos' : metric === 'orders' ? '📦 Órdenes' : '⚡ Desempeño'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">€{totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-purple-600 mt-1">Período seleccionado</p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Órdenes</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalOrders}</p>
              <p className="text-xs text-blue-600 mt-1">Período seleccionado</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Tasa de Finalización</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{avgCompletionRate.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">Datos reales</p>
            </div>
            <div className="text-5xl opacity-20">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Ticket Promedio</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">€{(totalRevenue / Math.max(totalOrders, 1)).toFixed(2)}</p>
              <p className="text-xs text-amber-600 mt-1">Por orden</p>
            </div>
            <div className="text-5xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Comparativa de Plataformas</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const revenuePercent = totalRevenue > 0 ? (platform.monthRevenue / totalRevenue) * 100 : 0
            const ordersPercent = totalOrders > 0 ? (platform.monthOrders / totalOrders) * 100 : 0

            return (
              <div key={platform.platform} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">{platform.platform}</h4>
                  <div className={`text-xl font-bold ${platform.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {platform.growthRate > 0 ? '+' : ''}{platform.growthRate.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Ingresos del Período</span>
                    <span className="text-sm font-bold text-gray-900">€{platform.monthRevenue.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${revenuePercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{revenuePercent.toFixed(1)}% del total</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Órdenes del Período</span>
                    <span className="text-sm font-bold text-gray-900">{platform.monthOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${ordersPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{ordersPercent.toFixed(1)}% del total</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Ticket Promedio</p>
                    <p className="font-bold text-gray-900">€{platform.avgTicket.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Finalización</p>
                    <p className="font-bold text-green-600">{platform.completionRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Entrega Promedio</p>
                    <p className="font-bold text-gray-900">{platform.avgDeliveryTime}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Pedidos Hoy</p>
                    <p className="font-bold text-gray-900">{platform.todayOrders}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Distribución de Órdenes por Hora</h3>

        {data.hourlyDistribution.length === 0 ? (
          <p className="text-sm text-gray-500">Todavía no hay órdenes en el período seleccionado.</p>
        ) : (
          <>
            <div className="space-y-4">
              {data.hourlyDistribution.map((item) => {
                const maxOrders = Math.max(
                  ...data.hourlyDistribution.flatMap((h) => [h.ubereats, h.glovo, h.deliveroo, h.justeat]),
                  1
                )
                const totalHour = item.ubereats + item.glovo + item.deliveroo + item.justeat

                return (
                  <div key={item.hour} className="flex items-end gap-4">
                    <div className="w-10 font-bold text-gray-600">{item.hour}</div>

                    <div className="flex-1 flex gap-1 items-end h-16">
                      <div
                        className="bg-gradient-to-t from-black to-gray-700 rounded-t flex-1"
                        style={{ height: `${(item.ubereats / maxOrders) * 100}%` }}
                        title={`UberEats: ${item.ubereats}`}
                      />
                      <div
                        className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t flex-1"
                        style={{ height: `${(item.glovo / maxOrders) * 100}%` }}
                        title={`Glovo: ${item.glovo}`}
                      />
                      <div
                        className="bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t flex-1"
                        style={{ height: `${(item.deliveroo / maxOrders) * 100}%` }}
                        title={`Deliveroo: ${item.deliveroo}`}
                      />
                      <div
                        className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t flex-1"
                        style={{ height: `${(item.justeat / maxOrders) * 100}%` }}
                        title={`Just Eat: ${item.justeat}`}
                      />
                    </div>

                    <div className="w-8 text-right font-semibold text-gray-900">{totalHour}</div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-6 mt-6 pt-4 border-t flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded" />
                <span className="text-sm text-gray-600">UberEats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded" />
                <span className="text-sm text-gray-600">Glovo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-400 rounded" />
                <span className="text-sm text-gray-600">Deliveroo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-sm text-gray-600">Just Eat</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Estados de Pedido</h3>
        {data.statusDistribution.length === 0 ? (
          <p className="text-sm text-gray-500">Sin estados disponibles para el período seleccionado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.statusDistribution.map((status) => (
              <div key={status.status} className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600 text-sm font-medium">{status.status}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{status.count}</p>
                <p className="text-xs text-gray-500 mt-1">{status.percentage.toFixed(1)}% del total</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Top Productos del Período</h3>
        {data.topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">Sin ventas registradas para este período.</p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((product, idx) => (
              <div key={`${product.name}-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} vendidos</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">€{product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
