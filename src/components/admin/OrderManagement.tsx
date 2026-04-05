'use client'

import { useState, useEffect, useMemo } from 'react'
import { getDeliveryIntegrations } from '@/actions/delivery'

interface DeliveryOrder {
  id: string
  platform: string
  externalOrderId: string
  merchantId: string
  status: string
  customerName: string
  customerPhone?: string | null
  deliveryAddress?: string | null
  items: Array<{ name: string; quantity: number; price: number }>
  totalPrice: number
  currency: string
  receivedAt: Date
  acceptedAt?: Date | null
  preparedAt?: Date | null
  collectedAt?: Date | null
  deliveredAt?: Date | null
  cancelledAt?: Date | null
}

type SortField = 'date' | 'price' | 'status' | 'platform'
type SortOrder = 'asc' | 'desc'

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  received: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '📥' },
  accepted: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '✅' },
  prepared: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '👨‍🍳' },
  collected: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '📦' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' }
}

const PLATFORM_COLORS: Record<string, string> = {
  UBEREATS: 'bg-black text-white',
  GLOVO: 'bg-yellow-400 text-black',
  DELIVEROO: 'bg-cyan-400 text-black'
}

export function OrderManagement() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      // En producción, implementar endpoint real
      // const response = await fetch('/api/orders')
      // const data = await response.json()
      // setOrders(data)

      // Por ahora: datos de ejemplo
      setOrders([
        {
          id: 'ord-001',
          platform: 'UBEREATS',
          externalOrderId: 'UBE-12345',
          merchantId: 'merchant-123',
          status: 'delivered',
          customerName: 'Juan García',
          customerPhone: '666123456',
          deliveryAddress: 'Calle Principal 123, Barcelona',
          items: [
            { name: 'Burger Clásica', quantity: 2, price: 12.5 },
            { name: 'Papas Fritas', quantity: 2, price: 3.5 }
          ],
          totalPrice: 31.5,
          currency: 'EUR',
          receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          acceptedAt: new Date(Date.now() - 110 * 60 * 1000),
          preparedAt: new Date(Date.now() - 65 * 60 * 1000),
          collectedAt: new Date(Date.now() - 45 * 60 * 1000),
          deliveredAt: new Date(Date.now() - 10 * 60 * 1000),
          cancelledAt: null
        },
        {
          id: 'ord-002',
          platform: 'GLOVO',
          externalOrderId: 'GLO-67890',
          merchantId: 'merchant-123',
          status: 'prepared',
          customerName: 'María López',
          customerPhone: '666654321',
          deliveryAddress: 'Avenida Diagonal 456, Barcelona',
          items: [
            { name: 'Focaccia Mari', quantity: 1, price: 8.9 },
            { name: 'Bebida', quantity: 1, price: 2.5 }
          ],
          totalPrice: 11.4,
          currency: 'EUR',
          receivedAt: new Date(Date.now() - 45 * 60 * 1000),
          acceptedAt: new Date(Date.now() - 40 * 60 * 1000),
          preparedAt: new Date(Date.now() - 15 * 60 * 1000),
          collectedAt: null,
          deliveredAt: null,
          cancelledAt: null
        },
        {
          id: 'ord-003',
          platform: 'DELIVEROO',
          externalOrderId: 'DEL-11111',
          merchantId: 'merchant-123',
          status: 'accepted',
          customerName: 'Carlos Ruiz',
          customerPhone: '666999888',
          deliveryAddress: 'Plaza Real 789, Barcelona',
          items: [
            { name: 'Burger Premium', quantity: 1, price: 15.0 },
            { name: 'Ensalada', quantity: 1, price: 7.5 }
          ],
          totalPrice: 22.5,
          currency: 'EUR',
          receivedAt: new Date(Date.now() - 20 * 60 * 1000),
          acceptedAt: new Date(Date.now() - 15 * 60 * 1000),
          preparedAt: null,
          collectedAt: null,
          deliveredAt: null,
          cancelledAt: null
        }
      ])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchLower) ||
        order.externalOrderId.toLowerCase().includes(searchLower) ||
        order.customerPhone?.includes(searchTerm)

      const matchesPlatform = selectedPlatform === 'all' || order.platform === selectedPlatform
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus

      const orderDate = new Date(order.receivedAt)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59)
      const matchesDate = orderDate >= startDate && orderDate <= endDate

      return matchesSearch && matchesPlatform && matchesStatus && matchesDate
    })
  }, [orders, searchTerm, selectedPlatform, selectedStatus, dateRange])

  // Ordenar órdenes
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders].sort((a, b) => {
      let aVal: any = a[sortField === 'date' ? 'receivedAt' : sortField === 'price' ? 'totalPrice' : sortField]
      let bVal: any = b[sortField === 'date' ? 'receivedAt' : sortField === 'price' ? 'totalPrice' : sortField]

      if (sortField === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredOrders, sortField, sortOrder])

  const stats = {
    total: orders.length,
    active: orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: '📊', color: 'bg-blue-50' },
          { label: 'Activas', value: stats.active, icon: '⚡', color: 'bg-amber-50' },
          { label: 'Completadas', value: stats.completed, icon: '✓', color: 'bg-green-50' },
          { label: 'Ingresos', value: `€${stats.revenue.toFixed(2)}`, icon: '💰', color: 'bg-purple-50' }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nombre, ID de orden, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Platform Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="UBEREATS">UberEats</option>
              <option value="GLOVO">Glovo</option>
              <option value="DELIVEROO">Deliveroo</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="received">📥 Recibida</option>
              <option value="accepted">✅ Aceptada</option>
              <option value="prepared">👨‍🍳 Preparando</option>
              <option value="collected">📦 Lista para recoger</option>
              <option value="delivered">✓ Entregada</option>
              <option value="cancelled">✗ Cancelada</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {(['table', 'cards'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg font-medium text-sm ${
                  viewMode === mode
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode === 'table' ? '📋' : '📇'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-bold">{sortedOrders.length}</span> de{' '}
        <span className="font-bold">{orders.length}</span> órdenes
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Plataforma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Productos</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'price') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('price')
                      setSortOrder('desc')
                    }
                  }}
                >
                  Precio {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'status') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('status')
                      setSortOrder('asc')
                    }
                  }}
                >
                  Estado {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'date') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('date')
                      setSortOrder('desc')
                    }
                  }}
                >
                  Fecha {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.map((order) => {
                const statusInfo = STATUS_COLORS[order.status]
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.externalOrderId}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${PLATFORM_COLORS[order.platform]}`}>
                        {order.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">€{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                        {statusInfo?.icon} {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.receivedAt).toLocaleString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => {
            const statusInfo = STATUS_COLORS[order.status]
            return (
              <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm text-gray-900">{order.externalOrderId}</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PLATFORM_COLORS[order.platform]}`}>
                      {order.platform}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Productos:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.name} - €{item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <p className="font-bold text-lg">€{order.totalPrice.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                      {statusInfo?.icon} {order.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {sortedOrders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No se encontraron órdenes con los filtros seleccionados</p>
        </div>
      )}
    </div>
  )
}
