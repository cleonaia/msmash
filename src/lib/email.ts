'use server'

import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const useResend = !!process.env.RESEND_API_KEY
const resend = useResend ? new Resend(process.env.RESEND_API_KEY) : null

// Configurar Nodemailer como fallback
let transporter: nodemailer.Transporter | null = null

if (!useResend && process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number }>
  deliveryMethod: string
  notes?: string
}

/**
 * Envía email de confirmación de pedido
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
      <div style="background: #FFD700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #000; margin: 0; font-size: 28px;">🔥 SMASH BURGER</h1>
        <p style="color: #333; margin: 5px 0; font-size: 14px;">¡Tu pedido confirmado!</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">¡Hola ${data.customerName}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Tu pedido #<strong>${data.orderId.slice(-8)}</strong> ha sido confirmado y pagado correctamente.
        </p>

        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFD700; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #333;">📋 Resumen del pedido:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${data.items
              .map(
                item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #666;">${item.name} × ${item.quantity}</td>
                <td style="padding: 10px 0; text-align: right; color: #333; font-weight: bold;">€${(item.price / 100).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
            <tr style="border-top: 2px solid #FFD700; font-weight: bold;">
              <td style="padding: 10px 0; color: #333;">Total</td>
              <td style="padding: 10px 0; text-align: right; color: #FFD700; font-size: 18px;">€${(data.totalAmount / 100).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666;"><strong>🛵 Método de entrega:</strong> ${data.deliveryMethod}</p>
          <p style="margin: 0 0 10px 0; color: #666;"><strong>⏱️ Tiempo estimado:</strong> 15-20 minutos</p>
          ${data.notes ? `<p style="margin: 0; color: #666;"><strong>📝 Notas especiales:</strong> ${data.notes}</p>` : ''}
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <p style="margin: 0; color: #2e7d32; font-weight: bold;">✅ Pago procesado correctamente</p>
          <p style="margin: 5px 0 0 0; color: #558b2f; font-size: 14px;">También recibirás un mensaje por WhatsApp con la confirmación</p>
        </div>

        <p style="color: #666; line-height: 1.6; margin: 20px 0;">
          Si tienes alguna duda, no dudes en contactarnos:<br>
          📞 <strong>+34 XXX XXX XXX</strong><br>
          📧 <strong>orders@smashburger.com</strong>
        </p>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2026 Smash Burger. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
    `

    if (useResend && resend) {
      const result = await resend.emails.send({
        from: 'Smash Burger <orders@smashburger.com>',
        to: data.customerEmail,
        subject: `✅ Pedido confirmado #${data.orderId.slice(-8)}`,
        html: emailContent
      })

      console.log('✅ Email enviado con Resend:', result)
      return { success: true, messageId: result.data?.id }
    } else if (transporter) {
      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'orders@smashburger.com',
        to: data.customerEmail,
        subject: `✅ Pedido confirmado #${data.orderId.slice(-8)}`,
        html: emailContent
      })

      console.log('✅ Email enviado con SMTP:', result.messageId)
      return { success: true, messageId: result.messageId }
    } else {
      console.warn('⚠️ Email service no configurado (Resend o SMTP)')
      return { success: false, error: 'Email service no configurado' }
    }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

/**
 * Envía email de pago fallido
 */
export async function sendPaymentFailedEmail(
  customerEmail: string,
  customerName: string,
  orderId: string
) {
  try {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
      <div style="background: #ff6b6b; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Problema con tu pago</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hola ${customerName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          No pudimos procesar el pago de tu pedido #<strong>${orderId.slice(-8)}</strong>.
        </p>

        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ff6b6b; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #856404;">
            <strong>🔄 ¿Qué hacer ahora?</strong><br><br>
            1️⃣ Intenta de nuevo en nuestro sitio<br>
            2️⃣ Verifica los datos de tu tarjeta<br>
            3️⃣ Llámanos: +34 XXX XXX XXX<br>
            4️⃣ Envía un email a: orders@smashburger.com
          </p>
        </div>

        <p style="color: #666; line-height: 1.6; margin: 20px 0;">
          Estamos aquí para ayudarte. ¡No dudes en contactarnos! 🙌
        </p>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2026 Smash Burger. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
    `

    if (useResend && resend) {
      const result = await resend.emails.send({
        from: 'Smash Burger <orders@smashburger.com>',
        to: customerEmail,
        subject: `⚠️ Problema con tu pago - Orden #${orderId.slice(-8)}`,
        html: emailContent
      })

      return { success: true, messageId: result.data?.id }
    } else if (transporter) {
      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'orders@smashburger.com',
        to: customerEmail,
        subject: `⚠️ Problema con tu pago - Orden #${orderId.slice(-8)}`,
        html: emailContent
      })

      return { success: true, messageId: result.messageId }
    } else {
      return { success: false, error: 'Email service no configurado' }
    }
  } catch (error) {
    console.error('❌ Error enviando email de error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

/**
 * Envía email de reembolso procesado
 */
export async function sendRefundEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  refundAmount: number
) {
  try {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
      <div style="background: #4caf50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔄 Reembolso procesado</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hola ${customerName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Tu reembolso para el pedido #<strong>${orderId.slice(-8)}</strong> ha sido procesado correctamente.
        </p>

        <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>Cantidad reembolsada:</strong><br>
            <span style="font-size: 24px; font-weight: bold;">€${(refundAmount / 100).toFixed(2)}</span>
          </p>
          <p style="margin: 10px 0 0 0; color: #558b2f; font-size: 14px;">
            Este dinero debería aparecer en tu cuenta dentro de 3-5 días
          </p>
        </div>

        <p style="color: #666; line-height: 1.6; margin: 20px 0;">
          Si tienes cualquier pregunta, estamos aquí para ayudarte 😊<br>
          📧 <strong>orders@smashburger.com</strong>
        </p>

        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2026 Smash Burger. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
    `

    if (useResend && resend) {
      const result = await resend.emails.send({
        from: 'Smash Burger <orders@smashburger.com>',
        to: customerEmail,
        subject: `🔄 Reembolso procesado - Orden #${orderId.slice(-8)}`,
        html: emailContent
      })

      return { success: true, messageId: result.data?.id }
    } else if (transporter) {
      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'orders@smashburger.com',
        to: customerEmail,
        subject: `🔄 Reembolso procesado - Orden #${orderId.slice(-8)}`,
        html: emailContent
      })

      return { success: true, messageId: result.messageId }
    } else {
      return { success: false, error: 'Email service no configurado' }
    }
  } catch (error) {
    console.error('❌ Error enviando email de reembolso:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}
