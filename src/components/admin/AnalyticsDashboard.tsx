'use client'

import { useEffect, useState } from 'react'
import { getRevenueKPIs, getRevenueTrend, getTopProducts, getConversionMetrics, getOrdersByChannel } from '@/actions/analytics'

export interface KPIData {
  today: number
  month: number
  quarter?: number
  ordersToday: number
  avgTicket: number
}

export interface TrendData {
  date: string
  revenue: number
  orders: number
}

export interface ProductData {
  id: string
  name: string
  quantity: number
  revenue: number
}

export interface ConversionData {
  menuViews: number
  checkouts: number
  orders: number
  viewToCheckout: string
  checkoutToOrder: string
}

export interface ChannelData {
  channel: string
  count: number
  percentage: number
}

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [trend, setTrend] = useState<TrendData[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [conversion, setConversion] = useState<ConversionData | null>(null)
  const [channels, setChannels] = useState<ChannelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const [kpiData, trendData, productData, conversionData, channelData] = await Promise.all([
          getRevenueKPIs(),
          getRevenueTrend(7),
          getTopProducts(),
          getConversionMetrics(),
          getOrdersByChannel()
        ])

        setKpis(kpiData)
        setTrend(trendData)
        setProducts(productData)
        setConversion(conversionData)
        setChannels(channelData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
        console.error('Analytics load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()

    // Refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading analytics: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Today */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Ingresos Hoy</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{kpis.today.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{kpis.ordersToday} orders</p>
          </div>

          {/* Revenue Month */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Ingresos Este Mes</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{kpis.month.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(kpis.month / kpis.today)}% vs today</p>
          </div>

          {/* Average Ticket */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">Ticket Promedio</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{kpis.avgTicket.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Total {kpis.ordersToday} pedidos</p>
          </div>

          {/* Revenue Quarter */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium">Ingresos Trimestre</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{(kpis.quarter || 0).toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Últimos 90 días</p>
          </div>
        </div>
      )}

      {/* Trend Chart (simplified text representation) */}
      {trend.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tendencia Últimos 7 Días</h3>
          <div className="space-y-2">
            {trend.map((item) => (
              <div key={item.date} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.date}</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-blue-100 h-6 rounded relative">
                    <div
                      className="bg-blue-500 h-6 rounded"
                      style={{
                        width: `${Math.min((item.revenue / 5000) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <span className="font-semibold min-w-24">€{item.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Channels */}
      {channels.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Órdenes por Canal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div key={ch.channel} className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600 text-sm font-medium">{ch.channel}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{ch.count}</p>
                <p className="text-xs text-gray-500 mt-1">{ch.percentage}% del total</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {products.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top 5 Productos</h3>
          <div className="space-y-3">
            {products.map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
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
        </div>
      )}

      {/* Conversion Funnel */}
      {conversion && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Embudo de Conversión</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-gray-600">Vistas de Menú</p>
              <p className="text-2xl font-bold text-blue-600">{conversion.menuViews.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-gray-400">↓ {conversion.viewToCheckout}</div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-gray-600">Checkouts</p>
              <p className="text-2xl font-bold text-yellow-600">{conversion.checkouts.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-gray-400">↓ {conversion.checkoutToOrder}</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-gray-600">Órdenes</p>
              <p className="text-2xl font-bold text-green-600">{conversion.orders.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
