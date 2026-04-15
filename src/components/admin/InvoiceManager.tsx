'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  createInvoiceFromOrder,
  deleteInvoiceByAdmin,
  getAllInvoices,
  getPaidOrdersWithoutInvoice,
  markInvoiceAsPaid,
  sendInvoiceEmail
} from '@/actions/invoices'

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  customerTaxId?: string | null
  totalAmount: number
  status: string
  createdAt: string | Date
  orderId?: string | null
}

interface PaidOrder {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: number
  createdAt: string | Date
}

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [pendingOrders, setPendingOrders] = useState<PaidOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [taxIdByOrder, setTaxIdByOrder] = useState<Record<string, string>>({})

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [invoiceData, orderData] = await Promise.all([
        getAllInvoices(),
        getPaidOrdersWithoutInvoice()
      ])

      setInvoices(invoiceData as any)
      setPendingOrders(orderData as any)
    } catch (error) {
      console.error('Error loading invoices:', error)
      alert('No se pudieron cargar las facturas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateInvoice = async (orderId: string) => {
    try {
      setLoading(true)
      await createInvoiceFromOrder(orderId, taxIdByOrder[orderId] || undefined)
      await loadData()
      alert('Factura creada correctamente')
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('No se pudo crear la factura')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      setLoading(true)
      await sendInvoiceEmail(invoiceId)
      await loadData()
      alert('Factura marcada como enviada')
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('No se pudo enviar la factura')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      setLoading(true)
      await markInvoiceAsPaid(invoiceId)
      await loadData()
      alert('Factura marcada como pagada')
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      alert('No se pudo actualizar la factura')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string, invoiceNumber: string) => {
    const confirmed = window.confirm(`¿Eliminar la factura ${invoiceNumber}? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    try {
      setLoading(true)
      await deleteInvoiceByAdmin(invoiceId)
      await loadData()
      alert('Factura eliminada')
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('No se pudo eliminar la factura')
    } finally {
      setLoading(false)
    }
  }

  const formatMoney = (amount: number) => `EUR ${(amount / 100).toFixed(2)}`

  const statusClass = (status: string) => {
    if (status === 'PAID') return 'bg-green-100 text-green-700'
    if (status === 'SENT') return 'bg-blue-100 text-blue-700'
    return 'bg-amber-100 text-amber-700'
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Facturas totales</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Pedidos sin factura</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">{pendingOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Importe facturado</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {formatMoney(invoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pedidos listos para facturar</h3>

        {pendingOrders.length === 0 ? (
          <p className="text-sm text-gray-600">No hay órdenes pendientes de facturación.</p>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Orden #{order.id.slice(-8)} · {order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerEmail} · {formatMoney(order.totalAmount)}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="text"
                    placeholder="NIF/CIF cliente (opcional)"
                    value={taxIdByOrder[order.id] || ''}
                    onChange={(e) =>
                      setTaxIdByOrder((prev) => ({ ...prev, [order.id]: e.target.value }))
                    }
                    className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                  />
                  <button
                    onClick={() => handleCreateInvoice(order.id)}
                    disabled={loading}
                    className="min-h-[44px] rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Generar factura
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Listado de facturas</h3>

        {invoices.length === 0 ? (
          <p className="text-sm text-gray-600">Aún no hay facturas creadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-600">
                  <th className="py-2 pr-4">Nº Factura</th>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 text-sm">
                    <td className="py-3 pr-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="py-3 pr-4">
                      <p className="text-gray-900">{invoice.customerName}</p>
                      <p className="text-xs text-gray-500">{invoice.customerEmail}</p>
                      {invoice.customerTaxId ? (
                        <p className="text-xs text-gray-500">NIF/CIF: {invoice.customerTaxId}</p>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4">{formatMoney(invoice.totalAmount)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {new Date(invoice.createdAt).toLocaleString('es-ES')}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/api/invoices/${invoice.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[40px] rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                        >
                          Descargar PDF
                        </a>
                        {invoice.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSendInvoice(invoice.id)}
                            disabled={loading}
                            className="min-h-[40px] rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Marcar enviada
                          </button>
                        )}
                        {invoice.status !== 'PAID' && (
                          <button
                            onClick={() => handleMarkPaid(invoice.id)}
                            disabled={loading}
                            className="min-h-[40px] rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Marcar pagada
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id, invoice.invoiceNumber)}
                          disabled={loading}
                          className="min-h-[40px] rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
