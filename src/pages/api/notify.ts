import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { services, clients, contacts, notificationLogs } from '../../db/schema';
import { sql } from 'drizzle-orm';
import { DATABASE_URL, SESSION_SECRET, RESEND_API_KEY } from 'astro:env/server';

export const POST: APIRoute = async ({ request }) => {
  const secret = request.headers.get('X-Cron-Secret');
  if (secret !== SESSION_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sqlConnection = neon(DATABASE_URL);
    const db = drizzle(sqlConnection);

    const now = new Date();

    const allServicesResult = await db.select({
      id: services.id,
      expiryDate: services.expiryDate,
      clientId: services.clientId,
      serviceType: services.serviceType,
      clientName: clients.companyName,
      contactEmail: contacts.email,
      contactName: contacts.name,
    }).from(services)
    .leftJoin(clients, sql`${services.clientId} = ${clients.id}`)
    .leftJoin(contacts, sql`${clients.contactId} = ${contacts.id}`);

    const notifications: Array<{
      serviceId: string;
      type: string;
      toEmail: string;
      toName: string;
      serviceType: string;
      clientName: string;
      expiryDate: string;
      daysUntil: number;
    }> = [];

    for (const svc of allServicesResult) {
      if (!svc.expiryDate || !svc.contactEmail) continue;

      const daysUntil = Math.round(
        (new Date(svc.expiryDate).getTime() - now.getTime()) / 86400000
      );

      let notificationType: string | null = null;

      if (daysUntil < 0) {
        notificationType = 'expired';
      } else if (daysUntil <= 7) {
        notificationType = '7d';
      } else if (daysUntil <= 15) {
        notificationType = '15d';
      } else if (daysUntil <= 30) {
        notificationType = '30d';
      }

      if (notificationType) {
        notifications.push({
          serviceId: svc.id,
          type: notificationType,
          toEmail: svc.contactEmail,
          toName: svc.contactName || 'Cliente',
          serviceType: svc.serviceType,
          clientName: svc.clientName || 'Cliente',
          expiryDate: svc.expiryDate,
          daysUntil,
        });
      }
    }

    const sentResults: Array<{ email: string; type: string; success: boolean }> = [];

    for (const notif of notifications) {
      const emailBody = `Renovio - Notificación de Renovación

Hola ${notif.toName},

El servicio de ${notif.serviceType} para ${notif.clientName} vence en ${notif.daysUntil} días (${notif.expiryDate}).

Por favor tome las medidas necesarias para la renovación.

--
Renovio - Control de Renovaciones Web
`;

      try {
        let success = false;
        if (RESEND_API_KEY) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Renovio <notifications@renovio.app>',
              to: notif.toEmail,
              subject: `[Renovio] Renovación de ${notif.serviceType} en ${notif.daysUntil} días`,
              text: emailBody,
            }),
          });
          success = resendResponse.ok;
        } else {
          console.log(`[DEMO] Would send email to ${notif.toEmail}: ${notif.type}`);
          success = true;
        }

        await db.insert(notificationLogs).values({
          serviceId: notif.serviceId,
          type: notif.type,
          status: success ? 'sent' : 'failed',
        });

        sentResults.push({ email: notif.toEmail, type: notif.type, success });
      } catch (emailError) {
        console.error(`Failed to send email to ${notif.toEmail}:`, emailError);
        sentResults.push({ email: notif.toEmail, type: notif.type, success: false });
      }
    }

    return new Response(JSON.stringify({
      processed: notifications.length,
      results: sentResults,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Notification processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};