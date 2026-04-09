'use client'

import { useCallback, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'

interface StripeCheckoutProps {
  orderId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

const isStripeClientConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export default function StripeCheckout({
  orderId,
  onSuccess
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const createCheckoutSession = useCallback(async () => {
    setIsLoading(true)
    setCheckoutError(null)
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create checkout session')
      }

      if (!data.clientSecret) {
        throw new Error('Missing Stripe client secret')
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setClientSecret(null)
      setCheckoutError(error instanceof Error ? error.message : 'No se pudo iniciar el pago online')
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    setClientSecret(null)
    void createCheckoutSession()
  }, [createCheckoutSession])

  if (!isStripeClientConfigured) {
    return (
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
        El pago online no está disponible temporalmente. Configura Stripe en Vercel para activarlo.
      </div>
    )
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-smash-fire rounded-full" />
        </div>
      )}

      {checkoutError && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {checkoutError}
          <button
            type="button"
            onClick={() => void createCheckoutSession()}
            className="mt-3 inline-flex items-center rounded-md border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/10"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && clientSecret && (
        <EmbeddedCheckoutProvider
          key={orderId}
          stripe={stripePromise}
          options={{
            clientSecret,
            onComplete: onSuccess
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}
