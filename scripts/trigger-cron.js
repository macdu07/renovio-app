import http from 'node:http';

// Configurar los parámetros basándonos en las variables de entorno
const port = process.env.PORT || process.env.HOST_PORT || 4321;
const secret = process.env.SESSION_SECRET;

if (!secret) {
  console.error('ERROR: SESSION_SECRET is not defined in environment variables.');
  process.exit(1);
}

const options = {
  hostname: '127.0.0.1',
  port: port,
  path: '/api/notify',
  method: 'POST',
  headers: {
    'X-Cron-Secret': secret,
    'Content-Type': 'application/json',
    'Content-Length': 0
  }
};

console.log(`Triggering cron job on http://127.0.0.1:${port}/api/notify...`);

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Cron job completed successfully!');
      console.log('Response:', data);
      process.exit(0);
    } else {
      console.error(`Cron job failed with status: ${res.statusCode}`);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.error('Make sure the Astro server is running.');
  process.exit(1);
});

req.end();
