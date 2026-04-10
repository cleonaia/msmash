'use client'

import { useState } from 'react'
import { ShoppingBag, Check, AlertCircle, Loader, CreditCard, Banknote } from 'lucide-react'
import StripeCheckout from '@/components/stripe/StripeCheckout'
import { createOrder, confirmCashOrder } from '@/actions/orders'

interface OrderFormStepProps {
  title: string
  description: string
  children: React.ReactNode
  isActive: boolean
  isCompleted: boolean
  stepNumber: number
}

function OrderFormStep({
  title,
  description,
  children,
  isActive,
  isCompleted,
  stepNumber
}: OrderFormStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-smash-sky text-white'
              : isActive
                ? 'bg-smash-fire text-white'
                : 'bg-smash-border text-smash-cream/50'
          }`}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-smash-cream">{title}</h3>
          <p className="text-sm text-smash-cream/60">{description}</p>
        </div>
      </div>
      {isActive && <div className="ml-0 sm:ml-14">{children}</div>}
    </div>
  )
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderCheckoutProps {
  cartItems: CartItem[]
  totalAmount: number
  onOrderComplete?: (orderId: string) => void
}

export default function OrderCheckout({
  cartItems,
  totalAmount,
  onOrderComplete
}: OrderCheckoutProps) {
  const [currentStep, setCurrentStep] = useState<'customer' | 'payment' | 'complete'>(
    'customer'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH'>('CARD')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    deliveryMethod: 'Retiro en local'
  })

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validar datos
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Por favor, completa todos los campos requeridos')
      }

      // Validar email básicamente
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor, ingresa un email válido')
      }

      // Crear orden
      const result = await createOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        notes: formData.notes,
        deliveryMethod: formData.deliveryMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        totalAmount
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setOrderId(result.order.id)
      setCurrentStep('payment')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la orden'
      setError(message)
      console.error('Error placing order:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setCurrentStep('complete')
    if (orderId && onOrderComplete) {
      onOrderComplete(orderId)
    }
  }

  const handleCashPayment = async () => {
    if (!orderId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await confirmCashOrder(orderId)

      if (!result.success) {
        throw new Error(result.error)
      }

      setCurrentStep('complete')
      if (onOrderComplete) {
        onOrderComplete(orderId)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo confirmar el pedido en efectivo'
      setError(message)
      console.error('Error confirming cash order:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-smash-smoke rounded-2xl border border-smash-border p-4 sm:p-8 space-y-8">
      {/* Progress indicator */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {['customer', 'payment', 'complete'].map((step, idx) => (
          <div
            key={step}
            className={`h-1 rounded-full transition-all ${
              ['customer', 'payment', 'complete']
                .slice(0, idx + 1)
                .includes(currentStep)
                ? 'bg-smash-fire'
                : 'bg-smash-border'
            }`}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1: Customer Info */}
        <OrderFormStep
          stepNumber={1}
          title="Tus datos"
          description="Información de contacto para tu pedido"
          isActive={currentStep === 'customer'}
          isCompleted={['payment', 'complete'].includes(currentStep)}
        >
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-smash-cream mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Tu nombre"
                required
                className="w-full px-4 py-2 bg-smash-black border border-smash-border rounded-lg text-smash-cream placeholder:text-smash-cream/40 focus:ring-2 focus:ring-smash-fire focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-smash-cream mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-2 bg-smash-black border border-smash-border rounded-lg text-smash-cream placeholder:text-smash-cream/40 focus:ring-2 focus:ring-smash-fire focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-smash-cream mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+34 600 123 456"
                  required
                  className="w-full px-4 py-2 bg-smash-black border border-smash-border rounded-lg text-smash-cream placeholder:text-smash-cream/40 focus:ring-2 focus:ring-smash-fire focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-smash-cream mb-2">
                Método de entrega
              </label>
              <select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-smash-black border border-smash-border rounded-lg text-smash-cream focus:ring-2 focus:ring-smash-fire focus:border-transparent transition-all"
              >
                <option value="Retiro en local">Retiro en local</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-smash-cream mb-2">
                Notas (opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Ej: Sin cebolla, si tienes..."
                rows={3}
                className="w-full px-4 py-2 bg-smash-black border border-smash-border rounded-lg text-smash-cream placeholder:text-smash-cream/40 focus:ring-2 focus:ring-smash-fire focus:border-transparent transition-all resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-smash-fire/10 border border-smash-fire/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-smash-fire flex-shrink-0 mt-0.5" />
                <p className="text-smash-fire text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-smash-fire text-white font-semibold rounded-lg hover:bg-smash-fire/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creando pedido...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Continuar al pago
                </>
              )}
            </button>
          </form>
        </OrderFormStep>

        {/* Step 2: Payment */}
        <OrderFormStep
          stepNumber={2}
          title="Pago seguro"
          description="Elige cómo quieres pagar tu pedido"
          isActive={currentStep === 'payment'}
          isCompleted={currentStep === 'complete'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`rounded-lg border px-4 py-3 text-left transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-smash-fire bg-smash-fire/10 text-smash-cream'
                    : 'border-smash-border bg-smash-black text-smash-cream/80 hover:border-smash-fire/50'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <CreditCard className="w-4 h-4" />
                  Tarjeta
                </div>
                <p className="mt-1 text-xs text-smash-cream/60">Visa, Mastercard, débito o crédito</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`rounded-lg border px-4 py-3 text-left transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-smash-fire bg-smash-fire/10 text-smash-cream'
                    : 'border-smash-border bg-smash-black text-smash-cream/80 hover:border-smash-fire/50'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Banknote className="w-4 h-4" />
                  Efectivo
                </div>
                <p className="mt-1 text-xs text-smash-cream/60">Pagas al retirar o al recibir tu pedido</p>
              </button>
            </div>

            {paymentMethod === 'CARD' && orderId && (
              <StripeCheckout
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
              />
            )}

            {paymentMethod === 'CASH' && (
              <div className="rounded-lg border border-smash-border bg-smash-black p-4 space-y-3">
                <p className="text-sm text-smash-cream/80">
                  Has elegido pago en efectivo. Confirmaremos el pedido para que puedas pagarlo cuando lo recibas.
                </p>
                <button
                  type="button"
                  onClick={handleCashPayment}
                  disabled={isLoading}
                  className="w-full py-3 bg-smash-fire text-white font-semibold rounded-lg hover:bg-smash-fire/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Confirmando pedido...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmar pedido en efectivo
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-smash-fire/10 border border-smash-fire/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-smash-fire flex-shrink-0 mt-0.5" />
                <p className="text-smash-fire text-sm">{error}</p>
              </div>
            )}
          </div>
        </OrderFormStep>

        {/* Step 3: Complete */}
        <OrderFormStep
          stepNumber={3}
          title="¡Pedido confirmado!"
          description={`Tu pedido #${orderId?.slice(-8)} ha sido confirmado${paymentMethod === 'CARD' ? ' y pagado' : ''}`}
          isActive={currentStep === 'complete'}
          isCompleted={currentStep === 'complete'}
        >
          <div className="p-6 bg-smash-black border border-smash-sky/30 rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-smash-sky">
              <Check className="w-6 h-6" />
              <span className="font-semibold">
                {paymentMethod === 'CARD' ? 'Pago procesado exitosamente' : 'Pago en efectivo seleccionado'}
              </span>
            </div>

            <p className="text-smash-cream/70 text-sm">
              Recibirás en breve un mensaje de confirmación a tu WhatsApp (+{formData.phone})
              con los detalles de tu pedido.
            </p>

            <p className="text-smash-cream/70 text-sm">
              <strong>Tiempo estimado:</strong> 15-20 minutos
            </p>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 bg-smash-fire text-white font-semibold rounded-lg hover:bg-smash-fire/90 transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </OrderFormStep>
      </div>

      {/* Order Summary */}
      <div className="border-t border-smash-border pt-6 space-y-3">
        <h4 className="font-semibold text-smash-cream">Resumen del pedido:</h4>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm text-smash-cream/70">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-smash-cream pt-3 border-t border-smash-border">
          <span>Total:</span>
          <span className="text-smash-fire">€{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
