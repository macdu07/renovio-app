import { neon } from '@neondatabase/serverless';
process.loadEnvFile('.env');

async function resetLogs() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está definida.');
    process.exit(1);
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM notification_logs`;
    console.log('✅ Registros de prueba eliminados correctamente de la base de datos.');
  } catch (err) {
    console.error('Error limpiando los logs:', err);
  }
}

resetLogs();
