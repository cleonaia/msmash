import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const isStripeConfigured = !!stripeSecretKey

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
