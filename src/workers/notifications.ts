export interface Env {
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  SESSION_SECRET: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Running notification cron job...');

    try {
      const response = await fetch('https://renovio.app/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cron-Secret': env.SESSION_SECRET,
        },
      });

      if (response.ok) {
        console.log('Notification job completed successfully');
      } else {
        console.error('Notification job failed:', response.status);
      }
    } catch (error) {
      console.error('Notification job error:', error);
    }
  },
};