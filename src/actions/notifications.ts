'use server'

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Genera template de email para nueva orden
 */
export function generateNewOrderEmail(
  restaurantName: string,
  orderId: string,
  platform: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  estimatedTime: number
): EmailTemplate {
  const itemsList = items.map((item) => `<li>${item.quantity}x ${item.name} - €${item.price.toFixed(2)}</li>`).join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 24px; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 24px; }
          .order-status { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 12px; margin: 16px 0; border-radius: 4px; }
          .items { background: #f9fafb; padding: 16px; border-radius: 6px; margin: 16px 0; }
          .items-list { list-style: none; padding: 0; margin: 0; }
          .items-list li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .items-list li:last-child { border-bottom: none; }
          .total { font-size: 20px; font-weight: bold; color: #000; margin-top: 12px; padding-top: 12px; border-top: 2px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .badge { display: inline-block; background: #dbeafe; color: #0284c7; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
          .cta-button { display: inline-block; background: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍔 ${restaurantName}</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Nueva orden recibida</p>
          </div>
          <div class="content">
            <p>¡Hola! Has recibido una nueva orden en <span class="badge">${platform}</span></p>
            
            <div class="order-status">
              <strong>ID de Orden:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${orderId}</code><br>
              <strong>Cliente:</strong> ${customerName}<br>
              <strong>Estado:</strong> Recibida ✓
            </div>

            <h3 style="margin-top: 24px; margin-bottom: 12px; color: #1f2937;">Productos</h3>
            <div class="items">
              <ul class="items-list">${itemsList}</ul>
              <div class="total">Total: €${total.toFixed(2)}</div>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 16px 0; border-radius: 4px;">
              <strong>⏱️ Tiempo estimado:</strong> ${estimatedTime} minutos
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Por favor, prepara esta orden lo antes posible. El cliente está esperando.
            </p>

            <a href="#" class="cta-button">Ver detalles completos →</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${restaurantName}. Sistema de Gestión de Entregas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    subject: `🍔 Nueva orden #${orderId} desde ${platform}`,
    html,
    text: `Nueva orden #${orderId} de ${customerName} en ${platform}. Total: €${total.toFixed(2)}. Tiempo estimado: ${estimatedTime}min.`
  }
}

/**
 * Genera template de email para cambio de estado
 */
export function generateOrderStatusEmail(
  restaurantName: string,
  orderId: string,
  platform: string,
  customerName: string,
  previousStatus: string,
  newStatus: string,
  statusTranslations: Record<string, string> = {}
): EmailTemplate {
  const statusMap: Record<string, string> = {
    received: '📥 Recibida',
    accepted: '✅ Aceptada',
    prepared: '👨‍🍳 Preparando',
    collected: '📦 Lista para recoger',
    delivered: '✓ Entregada',
    cancelled: '❌ Cancelada',
    ...statusTranslations
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 24px; }
          .header h1 { margin: 0; font-size: 24px; }
          .status-timeline { padding: 24px; }
          .status-item { display: flex; margin-bottom: 20px; }
          .status-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0; }
          .status-content { margin-left: 16px; flex: 1; }
          .status-content h3 { margin: 0 0 4px; font-size: 16px; color: #1f2937; }
          .status-content p { margin: 0; color: #6b7280; font-size: 14px; }
          .current { background: #10b981 !important; }
          .past { background: #d1d5db !important; }
          .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍔 ${restaurantName}</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Actualización de orden</p>
          </div>
          <div class="status-timeline">
            <p><strong>Orden #${orderId}</strong> - ${customerName}</p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">desde <strong>${platform}</strong></p>

            <div class="status-item">
              <div class="status-icon current">📥</div>
              <div class="status-content">
                <h3>Recibida</h3>
                <p>Orden recibida</p>
              </div>
            </div>

            <div class="status-item">
              <div class="status-icon ${newStatus !== 'received' ? 'current' : 'past'}">✅</div>
              <div class="status-content">
                <h3>Aceptada</h3>
                <p>Restaurant aceptó la orden</p>
              </div>
            </div>

            <div class="status-item">
              <div class="status-icon ${newStatus === 'prepared' || newStatus === 'collected' || newStatus === 'delivered' ? 'current' : 'past'}">👨‍🍳</div>
              <div class="status-content">
                <h3>Preparando</h3>
                <p>Currently being prepared</p>
              </div>
            </div>

            <div class="status-item">
              <div class="status-icon ${newStatus === 'collected' || newStatus === 'delivered' ? 'current' : 'past'}">📦</div>
              <div class="status-content">
                <h3>Lista para recoger</h3>
                <p>Order is ready</p>
              </div>
            </div>

            <div class="status-item">
              <div class="status-icon ${newStatus === 'delivered' ? 'current' : 'past'}">✓</div>
              <div class="status-content">
                <h3>Entregada</h3>
                <p>Order delivered successfully</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${restaurantName}. Sistema de Gestión de Entregas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    subject: `🔔 Orden #${orderId}: ${statusMap[newStatus] || newStatus}`,
    html,
    text: `Tu orden #${orderId} ahora está ${statusMap[newStatus] || newStatus}.`
  }
}

/**
 * Simula envío de email (en producción usar servicio como SendGrid/Mailgun)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // En producción, integrar con SendGrid, Mailgun, o similar
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(...)
    // })

    // Por ahora: simular y loguear
    console.log(`📧 Email enviado a ${to}`)
    console.log(`   Asunto: ${subject}`)

    // Generar messageId
    const messageId = crypto.randomUUID()
    console.log(`   Message ID: ${messageId}`)

    // Nota: emailLog tabla opcional para auditoría en producción
    // Solo loguear por consola por ahora
    try {
      // Intentar guardar en BD si el modelo existe
      const emailLogModel = (prisma as any)?.emailLog
      if (emailLogModel) {
        await emailLogModel.create({
          data: {
            messageId,
            to,
            subject,
            status: 'sent',
            sentAt: new Date(),
            htmlContent: html,
            textContent: text
          }
        })
      }
    } catch (dbError) {
      // Si falla, solo continuar con logging por consola
      console.debug('emailLog unavailable, continuing with console logging')
    }

    return { success: true, messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Envía notificación de nueva orden
 */
export async function notifyNewOrder(
  restaurantEmail: string,
  restaurantName: string,
  orderId: string,
  platform: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  estimatedTime: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const emailTemplate = generateNewOrderEmail(
    restaurantName,
    orderId,
    platform,
    customerName,
    items,
    total,
    estimatedTime
  )

  return sendEmail(restaurantEmail, emailTemplate.subject, emailTemplate.html, emailTemplate.text)
}

/**
 * Envía notificación de cambio de estado
 */
export async function notifyOrderStatus(
  email: string,
  restaurantName: string,
  orderId: string,
  platform: string,
  customerName: string,
  previousStatus: string,
  newStatus: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const emailTemplate = generateOrderStatusEmail(
    restaurantName,
    orderId,
    platform,
    customerName,
    previousStatus,
    newStatus
  )

  return sendEmail(email, emailTemplate.subject, emailTemplate.html, emailTemplate.text)
}

/**
 * Guarda preferencias de notificación de usuario
 */
export async function setNotificationPreferences(
  userId: string,
  preferences: {
    notifyNewOrders?: boolean
    notifyStatusChanges?: boolean
    notifyDelivered?: boolean
    notifyCancelled?: boolean
    email?: string
  }
) {
  try {
    try {
      const notificationPrefModel = (prisma as any)?.notificationPreference
      if (notificationPrefModel) {
        await notificationPrefModel.upsert({
          where: { userId },
          update: {
            notifyNewOrders: preferences.notifyNewOrders,
            notifyStatusChanges: preferences.notifyStatusChanges,
            notifyDelivered: preferences.notifyDelivered,
            notifyCancelled: preferences.notifyCancelled,
            email: preferences.email,
            updatedAt: new Date()
          },
          create: {
            userId,
            notifyNewOrders: preferences.notifyNewOrders ?? true,
            notifyStatusChanges: preferences.notifyStatusChanges ?? true,
            notifyDelivered: preferences.notifyDelivered ?? true,
            notifyCancelled: preferences.notifyCancelled ?? true,
            email: preferences.email || '',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
    } catch (dbError) {
      console.debug('notificationPreference table unavailable')
    }

    return { success: true }
  } catch (error) {
    console.error('Error setting notification preferences:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Obtiene preferencias de notificación
 */
export async function getNotificationPreferences(userId: string) {
  try {
    try {
      const notificationPrefModel = (prisma as any)?.notificationPreference
      if (notificationPrefModel) {
        const prefs = await notificationPrefModel.findUnique({
          where: { userId }
        })

        if (prefs) {
          return prefs
        }
      }
    } catch (dbError) {
      console.debug('notificationPreference table unavailable')
    }

    return {
      notifyNewOrders: true,
      notifyStatusChanges: true,
      notifyDelivered: true,
      notifyCancelled: false
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error)
    return {
      notifyNewOrders: true,
      notifyStatusChanges: true,
      notifyDelivered: true,
      notifyCancelled: false
    }
  }
}
