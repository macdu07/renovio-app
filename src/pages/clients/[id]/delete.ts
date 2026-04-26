import type { APIRoute } from 'astro';
import { getDb } from '../../../db';
import { clients, services, notificationLogs, contacts } from '../../../db/schema';
import { eq, inArray } from 'drizzle-orm';

export const POST: APIRoute = async (context) => {
  const { params, redirect } = context;
  const id = params.id;

  if (!id) {
    return new Response('Not found', { status: 404 });
  }

  const db = getDb(context);

  try {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    if (!client) {
      return new Response('Not found', { status: 404 });
    }

    const clientServices = await db.select().from(services).where(eq(services.clientId, id));
    const serviceIds = clientServices.map(s => s.id);

    if (serviceIds.length > 0) {
      await db.delete(notificationLogs).where(inArray(notificationLogs.serviceId, serviceIds));
    }

    await db.delete(services).where(eq(services.clientId, id));
    await db.delete(clients).where(eq(clients.id, id));

    if (client.contactId) {
       const otherClientsWithContact = await db.select().from(clients).where(eq(clients.contactId, client.contactId));
       if (otherClientsWithContact.length === 0) {
          await db.delete(contacts).where(eq(contacts.id, client.contactId));
       }
    }

    return redirect('/clients');
  } catch (e: any) {
    console.error('Error deleting client:', e);
    return new Response(e.message || 'Error deleting client', { status: 500 });
  }
};
