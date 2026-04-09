import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeRestrictedKey = process.env.STRIPE_RESTRICTED_KEY
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

function looksLikePlaceholder(value?: string) {
	if (!value) return true
	const normalized = value.toLowerCase()
	return (
		normalized.includes('your_') ||
		normalized.includes('placeholder') ||
		normalized.includes('tu_clave')
	)
}

const hasValidSecretKeyPrefix = !!stripeSecretKey && /^sk_(test|live)_/.test(stripeSecretKey)
const hasValidRestrictedKeyPrefix = !!stripeRestrictedKey && /^rk_(test|live)_/.test(stripeRestrictedKey)
const hasValidPublishableKeyPrefix = !!stripePublicKey && /^pk_(test|live)_/.test(stripePublicKey)

const publishableMode = stripePublicKey?.startsWith('pk_live_')
	? 'live'
	: stripePublicKey?.startsWith('pk_test_')
		? 'test'
		: null

const secretMode = stripeSecretKey?.startsWith('sk_live_')
	? 'live'
	: stripeSecretKey?.startsWith('sk_test_')
		? 'test'
		: null

const restrictedMode = stripeRestrictedKey?.startsWith('rk_live_')
	? 'live'
	: stripeRestrictedKey?.startsWith('rk_test_')
		? 'test'
		: null

const canUseSecretKey =
	hasValidSecretKeyPrefix &&
	!looksLikePlaceholder(stripeSecretKey) &&
	!!publishableMode &&
	secretMode === publishableMode

const canUseRestrictedKey =
	hasValidRestrictedKeyPrefix &&
	!looksLikePlaceholder(stripeRestrictedKey) &&
	!!publishableMode &&
	restrictedMode === publishableMode

const serverStripeKey = canUseSecretKey
	? stripeSecretKey
	: canUseRestrictedKey
		? stripeRestrictedKey
		: undefined

const hasUsableKeys =
	hasValidPublishableKeyPrefix &&
	!looksLikePlaceholder(stripePublicKey) &&
	!!serverStripeKey

export const isStripeConfigured = hasUsableKeys

export const stripe = hasUsableKeys && serverStripeKey ? new Stripe(serverStripeKey) : null

export const STRIPE_PUBLIC_KEY = hasUsableKeys ? stripePublicKey : undefined
