'use client'

import { useMemo, useState } from 'react'
import { categories, menuItems } from '@/features/menu/data/menu'
import { createCounterOrder } from '@/actions/orders'

type CartMap = Record<string, number>

function formatPrice(value: number) {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
}

export function AdminComandero() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartMap>({})
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'DATAPHONE' | 'CASH'>('DATAPHONE')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return byCategory

    return byCategory.filter((item) => {
      return item.name.toLowerCase().includes(normalizedSearch) || item.description.toLowerCase().includes(normalizedSearch)
    })
  }, [activeCategory, search])

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = menuItems.find((item) => item.id === id)
        if (!product) return null
        return {
          id,
          name: product.name,
          qty,
          price: product.price,
          subtotal: product.price * qty
        }
      })
      .filter(Boolean) as Array<{ id: string; name: string; qty: number; price: number; subtotal: number }>
  }, [cart])

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems])
  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems])
  const normalizedPhone = customerPhone.replace(/\D/g, '')
  const isCustomerDataValid = customerName.trim().length >= 2 && normalizedPhone.length >= 9

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menuItems.length }
    for (const category of categories) {
      counts[category.id] = menuItems.filter((item) => item.category === category.id).length
    }
    return counts
  }, [])

  const setQty = (id: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: qty }
    })
  }

  const submitOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return

    if (!isCustomerDataValid) {
      alert('Introduce un nombre y teléfono válidos para crear el pedido.')
      return
    }

    setIsSubmitting(true)
    setCreatedOrderId(null)

    try {
      const result = await createCounterOrder({
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        notes: notes.trim(),
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty
        })),
        totalAmount: total
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setCreatedOrderId(result.order.id)
      setCart({})
      setNotes('')
      window.open(`/admin/orders/print/${result.order.id}`, '_blank', 'noopener,noreferrer')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el pedido'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-bold text-gray-900">Comandero de Mostrador</h3>
        <p className="mt-1 text-sm text-gray-600">
          Catálogo completo con precios actualizados. Crea pedidos de mostrador y lanza ticket al instante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                activeCategory === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Todo ({categoryCounts.all})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  activeCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.label} ({categoryCounts[category.id]})
              </button>
            ))}
          </div>

          <div className="mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto por nombre o descripción"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const qty = cart[item.id] || 0
              return (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="min-w-0 pr-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="line-clamp-1 text-xs text-gray-500">{item.description}</p>
                    <p className="mt-1 text-sm text-gray-600">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(item.id, qty - 1)}
                      className="h-7 w-7 rounded-full border border-gray-300 text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(item.id, qty + 1)}
                      className="h-7 w-7 rounded-full border border-gray-300 text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredItems.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                No hay productos para ese filtro.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h4 className="text-base font-bold text-gray-900">Pedido actual</h4>

          <div className="mt-4 space-y-3">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Teléfono (ej: 612598899)"
              inputMode="tel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (sin cebolla, etc.)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'DATAPHONE' | 'CASH')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="DATAPHONE">Datáfono</option>
              <option value="CASH">Efectivo</option>
            </select>
            <p className={`text-xs ${isCustomerDataValid ? 'text-green-700' : 'text-amber-700'}`}>
              {isCustomerDataValid
                ? 'Datos del cliente correctos'
                : 'Nombre (min 2 caracteres) y teléfono válido (min 9 dígitos)'}
            </p>
          </div>

          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto border-y border-gray-200 py-3">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Sin productos añadidos.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.qty}x {item.name}</span>
                  <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total ({totalItems} uds)</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
          </div>

          <button
            onClick={submitOrder}
            disabled={isSubmitting || cartItems.length === 0 || !isCustomerDataValid}
            className="mt-4 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creando pedido...' : 'Crear pedido e imprimir ticket'}
          </button>

          {createdOrderId && (
            <p className="mt-3 rounded bg-green-50 px-3 py-2 text-xs text-green-700">
              Pedido creado: #{createdOrderId.slice(-8)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
