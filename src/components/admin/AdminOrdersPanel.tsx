'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getAllOrders, updateOrderStatus } from '@/actions/orders'
import { processRefund } from '@/actions/refunds'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  DollarSign,
  Package,
  Zap,
  Loader
} from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  totalAmount: number
  items: Array<{ product: { name: string }; quantity: number }>
  createdAt: Date
  deliveryMethod: string
}

interface FilterState {
  status: string
  paymentStatus: string
  timeRange: string
}

function filterOrders(orderList: Order[], currentFilters: FilterState) {
  let filtered = [...orderList]

  if (currentFilters.status !== 'all') {
    filtered = filtered.filter(o => o.status === currentFilters.status)
  }

  if (currentFilters.paymentStatus !== 'all') {
    filtered = filtered.filter(o => o.paymentStatus === currentFilters.paymentStatus)
  }

  const now = new Date()
  if (currentFilters.timeRange === 'today') {
    filtered = filtered.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate.toDateString() === now.toDateString()
    })
  } else if (currentFilters.timeRange === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filtered = filtered.filter(o => new Date(o.createdAt) >= weekAgo)
  }

  return filtered
}

function getOrderStats(orderList: Order[]) {
  const completed = orderList.filter(o => o.status === 'COMPLETED').length
  const pending = orderList.filter(o => o.paymentStatus === 'PENDING').length
  const revenue = orderList
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return {
    totalOrders: orderList.length,
    completedOrders: completed,
    pendingPayment: pending,
    totalRevenue: revenue
  }
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refundLoading, setRefundLoading] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingPayment: 0,
    totalRevenue: 0
  })

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    paymentStatus: 'all',
    timeRange: 'today'
  })

  const filtersRef = useRef(filters)

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Cargar órdenes
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data)
      setFilteredOrders(filterOrders(data, filtersRef.current))
      setStats(getOrderStats(data))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    filtersRef.current = newFilters
    setFilteredOrders(filterOrders(orders, newFilters))
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any)
      setOpenDropdown(null)
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleRefund = async () => {
    if (!selectedOrder) return

    setRefundLoading(true)
    try {
      await processRefund({
        orderId: selectedOrder.id,
        reason: refundReason
      })
      setShowRefundModal(false)
      setRefundReason('')
      fetchOrders()
    } catch (error) {
      console.error('Error processing refund:', error)
      alert('Error al procesar el reembolso')
    } finally {
      setRefundLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY: 'bg-indigo-100 text-indigo-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === 'PENDING') return <Clock className="w-4 h-4 text-yellow-600" />
    if (status === 'FAILED') return <AlertCircle className="w-4 h-4 text-red-600" />
    return <RefreshCw className="w-4 h-4 text-gray-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />
      case 'PREPARING':
        return <Zap className="w-4 h-4" />
      case 'READY':
        return <Package className="w-4 h-4" />
      case 'COMPLETED':
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📊 Panel de Órdenes</h1>
            <p className="text-slate-400">Gestiona y monitorea todos los pedidos</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total de órdenes</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Órdenes completadas</p>
                <p className="text-3xl font-bold">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pendiente de pago</p>
                <p className="text-3xl font-bold">{stats.pendingPayment}</p>
              </div>
              <Clock className="w-12 h-12 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Revenue total</p>
                <p className="text-3xl font-bold">€{(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="PREPARING">Preparando</option>
              <option value="READY">Listo</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>

            <select
              value={filters.paymentStatus}
              onChange={e => handleFilterChange('paymentStatus', e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los pagos</option>
              <option value="PENDING">Pendiente de pago</option>
              <option value="COMPLETED">Pagado</option>
              <option value="FAILED">Pago fallido</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>

            <select
              value={filters.timeRange}
              onChange={e => handleFilterChange('timeRange', e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Pago</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Creado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No se encontraron órdenes
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                        {order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        €{(order.totalAmount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(order.paymentStatus)}
                          <span className="text-sm text-slate-300">{order.paymentStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>

                          {openDropdown === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg border border-slate-600 shadow-lg z-50">
                              <div className="py-2">
                                <select
                                  onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className="w-full px-4 py-2 text-sm text-white bg-slate-700 border-b border-slate-600"
                                >
                                  <option value="">Cambiar estado...</option>
                                  <option value="PREPARING">Preparando</option>
                                  <option value="READY">Listo</option>
                                  <option value="COMPLETED">Completado</option>
                                </select>

                                {order.paymentStatus === 'COMPLETED' && order.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setShowRefundModal(true)
                                      setOpenDropdown(null)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-600 text-left flex items-center gap-2 border-t border-slate-600"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Reembolsar
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    window.location.href = `mailto:${order.customerEmail}?subject=Tu pedido #${order.id.slice(-8)}`
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-blue-400 hover:bg-slate-600 text-left border-t border-slate-600"
                                >
                                  📧 Enviar email
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">🔄 Procesar Reembolso</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Orden: #{selectedOrder.id.slice(-8)}
                </label>
                <div className="bg-slate-700 px-4 py-2 rounded text-slate-300">
                  €{(selectedOrder.totalAmount / 100).toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Motivo (opcional)
                </label>
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Ej: Cliente solicitó cancelación"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRefundModal(false)
                    setRefundReason('')
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRefund}
                  disabled={refundLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {refundLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Confirmar Reembolso
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
