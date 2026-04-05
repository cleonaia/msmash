'use client'

import { useState, useEffect } from 'react'

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
  metrics: Record<string, PlatformMetrics>
  topProducts: Array<{ name: string; quantity: number; revenue: number; platform: string }>
  hourlyDistribution: Array<{ hour: string; ubereats: number; glovo: number; deliveroo: number }>
  statusDistribution: Array<{ status: string; count: number; percentage: number }>
}

export function AdvancedAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'performance'>('revenue')

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    setLoading(true)
    // En producción: await fetch('/api/analytics')
    // Por ahora: datos de ejemplo
    const mockData: AnalyticsData = {
      metrics: {
        UBEREATS: {
          platform: 'UberEats',
          todayOrders: 24,
          todayRevenue: 456.8,
          monthOrders: 480,
          monthRevenue: 9120.0,
          avgTicket: 19.0,
          completionRate: 98.5,
          avgDeliveryTime: 42,
          growthRate: 12.5
        },
        GLOVO: {
          platform: 'Glovo',
          todayOrders: 18,
          todayRevenue: 312.6,
          monthOrders: 360,
          monthRevenue: 6240.0,
          avgTicket: 17.33,
          completionRate: 96.8,
          avgDeliveryTime: 38,
          growthRate: 8.3
        },
        DELIVEROO: {
          platform: 'Deliveroo',
          todayOrders: 22,
          todayRevenue: 418.4,
          monthOrders: 440,
          monthRevenue: 8360.0,
          avgTicket: 19.0,
          completionRate: 97.2,
          avgDeliveryTime: 45,
          growthRate: 15.2
        }
      },
      topProducts: [
        { name: 'Burger Clásica', quantity: 156, revenue: 1872, platform: 'UBEREATS' },
        { name: 'Focaccia Mari', quantity: 134, revenue: 1206, platform: 'GLOVO' },
        { name: 'Burger Premium', quantity: 128, revenue: 1920, platform: 'DELIVEROO' },
        { name: 'Papas Fritas', quantity: 312, revenue: 936, platform: 'All' },
        { name: 'Ensalada', quantity: 98, revenue: 735, platform: 'DELIVEROO' }
      ],
      hourlyDistribution: [
        { hour: '11h', ubereats: 2, glovo: 1, deliveroo: 2 },
        { hour: '12h', ubereats: 5, glovo: 4, deliveroo: 5 },
        { hour: '13h', ubereats: 8, glovo: 6, deliveroo: 7 },
        { hour: '14h', ubereats: 6, glovo: 5, deliveroo: 6 },
        { hour: '19h', ubereats: 7, glovo: 5, deliveroo: 6 },
        { hour: '20h', ubereats: 10, glovo: 8, deliveroo: 9 },
        { hour: '21h', ubereats: 9, glovo: 7, deliveroo: 8 }
      ],
      statusDistribution: [
        { status: 'delivered', count: 1220, percentage: 92.5 },
        { status: 'prepared', count: 68, percentage: 5.1 },
        { status: 'accepted', count: 28, percentage: 2.1 },
        { status: 'cancelled', count: 4, percentage: 0.3 }
      ]
    }

    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 600)
  }

  if (loading || !data) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const platforms = Object.values(data.metrics)
  const totalRevenue = platforms.reduce((sum, p) => sum + p.monthRevenue, 0)
  const totalOrders = platforms.reduce((sum, p) => sum + p.monthOrders, 0)
  const avgCompletionRate = platforms.reduce((sum, p) => sum + p.completionRate, 0) / platforms.length

  return (
    <div className="space-y-6">
      {/* Timeframe & Metric Selection */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">€{totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-purple-600 mt-1">+18.5% mes anterior</p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Órdenes</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalOrders}</p>
              <p className="text-xs text-blue-600 mt-1">+12.3% mes anterior</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Tasa de Finalización</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{avgCompletionRate?.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">Excelente desempeño</p>
            </div>
            <div className="text-5xl opacity-20">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Ticket Promedio</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">€{(totalRevenue / totalOrders).toFixed(2)}</p>
              <p className="text-xs text-amber-600 mt-1">Por orden</p>
            </div>
            <div className="text-5xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      {/* Platform Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Comparativa de Plataformas</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const revenuePercent = (platform.monthRevenue / totalRevenue) * 100
            const ordersPercent = (platform.monthOrders / totalOrders) * 100

            return (
              <div key={platform.platform} className="border border-gray-200 rounded-lg p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">{platform.platform}</h4>
                  <div className={`text-xl font-bold ${platform.growthRate > 10 ? 'text-green-600' : 'text-blue-600'}`}>
                    {platform.growthRate > 0 ? '+' : ''}{platform.growthRate.toFixed(1)}%
                  </div>
                </div>

                {/* Revenue Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Ingresos del Mes</span>
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

                {/* Orders Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Órdenes del Mes</span>
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Ticket Promedio</p>
                    <p className="font-bold text-gray-900">€{platform.avgTicket.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Finalización</p>
                    <p className="font-bold text-green-600">{platform.completionRate}%</p>
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

      {/* Hourly Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-6">Distribución de Órdenes por Hora</h3>

        <div className="space-y-4">
          {data.hourlyDistribution.map((item) => {
            const maxOrders = Math.max(...data.hourlyDistribution.flatMap((h) => [h.ubereats, h.glovo, h.deliveroo]))
            const totalHour = item.ubereats + item.glovo + item.deliveroo

            return (
              <div key={item.hour} className="flex items-end gap-4">
                <div className="w-8 font-bold text-gray-600">{item.hour}</div>

                <div className="flex-1 flex gap-1 items-end h-16">
                  {/* UberEats */}
                  <div
                    className="bg-gradient-to-t from-black to-gray-700 rounded-t flex-1"
                    style={{ height: `${(item.ubereats / maxOrders) * 100}%` }}
                    title={`UberEats: ${item.ubereats}`}
                  />
                  {/* Glovo */}
                  <div
                    className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t flex-1"
                    style={{ height: `${(item.glovo / maxOrders) * 100}%` }}
                    title={`Glovo: ${item.glovo}`}
                  />
                  {/* Deliveroo */}
                  <div
                    className="bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t flex-1"
                    style={{ height: `${(item.deliveroo / maxOrders) * 100}%` }}
                    title={`Deliveroo: ${item.deliveroo}`}
                  />
                </div>

                <div className="w-8 text-right font-semibold text-gray-900">{totalHour}</div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t">
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
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6">Top Productos</h3>

          <div className="space-y-4">
            {data.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">€{product.revenue}</p>
                  <p className="text-xs text-gray-500">{product.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6">Distribución de Estados</h3>

          <div className="space-y-4">
            {data.statusDistribution.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium text-gray-900">{item.status}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      item.status === 'delivered'
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : item.status === 'prepared'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : item.status === 'accepted'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.percentage}% del total</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
