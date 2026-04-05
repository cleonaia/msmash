'use client'

import { useState } from 'react'
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

export default function StripeCheckout({
  orderId,
  onSuccess,
  onCancel
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const fetchClientSecret = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      if (!data.clientSecret) {
        throw new Error('Missing Stripe client secret')
      }

      return data.clientSecret
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-smash-fire rounded-full" />
        </div>
      ) : (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            fetchClientSecret,
            onComplete: onSuccess
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}
