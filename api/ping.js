// api/ping.js
import { createClient } from '@libsql/client';

export default async function handler(request, response) {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute('SELECT CURRENT_TIMESTAMP;');
    return response.status(200).json({
      status: 'ok',
      db_time: result.rows[0]['CURRENT_TIMESTAMP'],
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return response.status(500).json({
      status: 'error',
      message: 'Could not connect to the database.',
    });
  }
}