import type { APIRoute } from 'astro';
import { getDb } from '../../../db';
import { services, notificationLogs } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async (context) => {
  const { params, redirect } = context;
  const id = params.id;

  if (!id) {
    return new Response('Not found', { status: 404 });
  }

  const db = getDb(context);

  try {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    if (!service) {
      return new Response('Not found', { status: 404 });
    }

    await db.delete(notificationLogs).where(eq(notificationLogs.serviceId, id));
    await db.delete(services).where(eq(services.id, id));

    return redirect(`/clients/${service.clientId}`);
  } catch (e: any) {
    console.error('Error deleting service:', e);
    return new Response(e.message || 'Error deleting service', { status: 500 });
  }
};
