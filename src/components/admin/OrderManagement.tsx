'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { getDeliveryOrders } from '@/actions/delivery'
import { getAllOrders } from '@/actions/orders'

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
  receivedAt: Date | string
  acceptedAt?: Date | string | null
  preparedAt?: Date | string | null
  collectedAt?: Date | string | null
  deliveredAt?: Date | string | null
  cancelledAt?: Date | string | null
}

interface LocalOrder {
  id: string
  status: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  paymentStatus: string
  totalAmount: number
  createdAt: Date | string
  items: Array<{ product?: { name: string }; quantity: number; unitPrice: number }>
}

type SortField = 'date' | 'price' | 'status' | 'platform'
type SortOrder = 'asc' | 'desc'

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  received: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '📥' },
  accepted: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '✅' },
  prepared: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '👨‍🍳' },
  collected: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '📦' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' },
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏳' },
  CONFIRMED: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✅' },
  PREPARING: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '👨‍🍳' },
  READY: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '📦' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  CANCELED: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '↩' }
}

const PLATFORM_COLORS: Record<string, string> = {
  UBEREATS: 'bg-black text-white',
  GLOVO: 'bg-yellow-400 text-black',
  DELIVEROO: 'bg-cyan-400 text-black',
  WEB: 'bg-emerald-600 text-white'
}

function isCompletedStatus(status: string) {
  return status === 'delivered' || status === 'COMPLETED'
}

function isClosedStatus(status: string) {
  return ['delivered', 'cancelled', 'COMPLETED', 'CANCELED', 'REFUNDED'].includes(status)
}

export function OrderManagement() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(false)
  const [printQueue, setPrintQueue] = useState<string[]>([])
  const [activePrintOrderId, setActivePrintOrderId] = useState<string | null>(null)
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
  const autoPrintEnabledRef = useRef(false)
  const knownOrderIdsRef = useRef<Set<string>>(new Set())
  const initializedOrdersRef = useRef(false)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const [deliveryData, localData] = await Promise.all([
        getDeliveryOrders(30),
        getAllOrders()
      ])

      const deliveryOrders = (deliveryData as DeliveryOrder[]) || []
      const websiteOrders: DeliveryOrder[] = ((localData as LocalOrder[]) || []).map((order) => ({
        id: order.id,
        platform: 'WEB',
        externalOrderId: `WEB-${order.id.slice(-8).toUpperCase()}`,
        merchantId: 'WEB',
        status: order.status,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryAddress: null,
        items: order.items.map((item) => ({
          name: item.product?.name || 'Producto',
          quantity: item.quantity,
          price: (item.unitPrice || 0) / 100
        })),
        totalPrice: order.totalAmount / 100,
        currency: 'EUR',
        receivedAt: order.createdAt,
        acceptedAt: null,
        preparedAt: null,
        collectedAt: null,
        deliveredAt: null,
        cancelledAt: null
      }))

      const nextOrders = [...websiteOrders, ...deliveryOrders]
      const currentIds = new Set(nextOrders.map((o) => o.id))

      if (initializedOrdersRef.current && autoPrintEnabledRef.current) {
        const newOrders = nextOrders.filter((o) => !knownOrderIdsRef.current.has(o.id))

        if (newOrders.length > 0) {
          setPrintQueue((prev) => {
            const dedup = new Set(prev)
            for (const order of newOrders) dedup.add(order.id)
            return Array.from(dedup)
          })
        }
      }

      knownOrderIdsRef.current = currentIds
      initializedOrdersRef.current = true
      setOrders(nextOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    autoPrintEnabledRef.current = autoPrintEnabled
  }, [autoPrintEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedEnabled = window.localStorage.getItem('deliveryAutoPrintEnabled')
    if (storedEnabled === 'true') {
      setAutoPrintEnabled(true)
      autoPrintEnabledRef.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('deliveryAutoPrintEnabled', String(autoPrintEnabled))
  }, [autoPrintEnabled])

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadOrders()
    }, 15000)

    return () => {
      window.clearInterval(interval)
    }
  }, [loadOrders])

  useEffect(() => {
    if (activePrintOrderId || printQueue.length === 0) return

    const [nextOrderId, ...rest] = printQueue
    setActivePrintOrderId(nextOrderId)
    setPrintQueue(rest)

    const releaseTimer = window.setTimeout(() => {
      setActivePrintOrderId(null)
    }, 2500)

    return () => {
      window.clearTimeout(releaseTimer)
    }
  }, [activePrintOrderId, printQueue])

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
    active: orders.filter((o) => !isClosedStatus(o.status)).length,
    completed: orders.filter((o) => isCompletedStatus(o.status)).length,
    revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  }

  const activePrintOrder = orders.find((o) => o.id === activePrintOrderId)
  const activePrintSrc = activePrintOrderId
    ? activePrintOrder?.platform === 'WEB'
      ? `/admin/orders/print/${activePrintOrderId}?autoprint=1&ts=${Date.now()}`
      : `/admin/delivery/print/${activePrintOrderId}?autoprint=1&ts=${Date.now()}`
    : null

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
              <option value="WEB">Web</option>
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
              <option value="PENDING">⏳ Pendiente</option>
              <option value="CONFIRMED">✅ Confirmado</option>
              <option value="PREPARING">👨‍🍳 Preparando</option>
              <option value="READY">📦 Listo</option>
              <option value="COMPLETED">✓ Completado</option>
              <option value="CANCELED">✗ Cancelado</option>
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

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Impresión automática TPV</p>
              <p className="text-xs text-gray-600">
                Detecta pedidos nuevos y lanza impresión en este equipo.
              </p>
            </div>

            <button
              onClick={() => setAutoPrintEnabled((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                autoPrintEnabled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {autoPrintEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
            </button>
          </div>

          {printQueue.length > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Cola de impresión: {printQueue.length} pedido(s) pendiente(s).
            </p>
          )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Acciones</th>
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => {
                          const printUrl =
                            order.platform === 'WEB'
                              ? `/admin/orders/print/${order.id}`
                              : `/admin/delivery/print/${order.id}`
                          window.open(printUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="rounded bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        Imprimir
                      </button>
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

                  <button
                    onClick={() => {
                      const printUrl =
                        order.platform === 'WEB'
                          ? `/admin/orders/print/${order.id}`
                          : `/admin/delivery/print/${order.id}`
                      window.open(printUrl, '_blank', 'noopener,noreferrer')
                    }}
                    className="w-full rounded bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Imprimir ticket
                  </button>
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

      {activePrintOrderId && (
        <iframe
          title="auto-print-delivery-ticket"
          src={activePrintSrc ?? ''}
          className="hidden"
        />
      )}
    </div>
  )
}
