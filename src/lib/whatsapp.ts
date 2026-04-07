'use server'

import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_WHATSAPP_PHONE

if (!accountSid || !authToken || !twilioPhone) {
  console.warn('⚠️ Twilio not configured. WhatsApp notifications disabled.')
}

let client: ReturnType<typeof twilio> | null = null
try {
  client = accountSid && authToken && accountSid.startsWith('AC') ? twilio(accountSid, authToken) : null
} catch (error) {
  console.warn('⚠️ Failed to initialize Twilio:', error)
}

/**
 * Envía un mensaje de WhatsApp con la confirmación de pedido
 */
export async function sendWhatsAppOrderConfirmation(
  phoneNumber: string,
  orderData: {
    orderId: string
    customerName: string
    totalAmount: number
    items: Array<{ name: string; quantity: number }>
    deliveryMethod: string
  }
) {
  if (!client || !twilioPhone) {
    console.warn('⚠️ WhatsApp not configured')
    return { success: false, error: 'WhatsApp no configurado' }
  }

  try {
    // Hacer phone internacional
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+34${phoneNumber.replace(/\D/g, '')}`

    const message = `
🔥 *¡Tu pedido #${orderData.orderId.slice(-8)} ha sido confirmado!*

👤 *Cliente:* ${orderData.customerName}
💰 *Total:* €${(orderData.totalAmount / 100).toFixed(2)}
🛵 *Entrega:* ${orderData.deliveryMethod}

📋 *Artículos:*
${orderData.items.map(item => `  • ${item.name} × ${item.quantity}`).join('\n')}

⏱️ *Tiempo estimado:* 15-20 minutos

Gracias por tu pedido 🙌
    `.trim()

    const result = await client.messages.create({
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    })

    console.log(`✅ WhatsApp enviado a ${formattedPhone}:`, result.sid)
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error('❌ Error enviando WhatsApp:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

/**
 * Envía notificación de pago rechazado
 */
export async function sendWhatsAppPaymentFailed(
  phoneNumber: string,
  orderData: { orderId: string; customerName: string }
) {
  if (!client || !twilioPhone) {
    return { success: false, error: 'WhatsApp no configurado' }
  }

  try {
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+34${phoneNumber.replace(/\D/g, '')}`

    const message = `
⚠️ *Pago no procesado - Orden #${orderData.orderId.slice(-8)}*

${orderData.customerName}, parece que hubo un problema con tu pago.

🔄 *Por favor:*
1. Intenta de nuevo en nuestro sitio
2. O llámanos: +34 XXX XXX XXX
3. O envía un email a: msmashburguer2026@gmail.com

Estamos aquí para ayudarte 🙌
    `.trim()

    const result = await client.messages.create({
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    })

    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error('❌ Error enviando WhatsApp de error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}
