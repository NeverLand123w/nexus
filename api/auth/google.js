// api/auth/google.js
import { createClient } from '@libsql/client';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const dbClient = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = request.body;

  try {
    // 1. VERIFY THE GOOGLE TOKEN
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return response.status(400).json({ message: 'Invalid token' });
    }
    
    const { sub: id, name, email, picture: avatar_url } = payload;
    
    // 2. UPSERT USER INTO THE DATABASE
    // Insert a new user or update their name/avatar if they already exist
    await dbClient.execute({
        sql: `
          INSERT INTO users (id, name, email, avatar_url)
          VALUES (:id, :name, :email, :avatar_url)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            avatar_url = excluded.avatar_url;
        `,
        args: { id, name, email, avatar_url },
    });

    // 3. FETCH THE USER RECORD TO RETURN
    const { rows: [user] } = await dbClient.execute({
        sql: 'SELECT id, name, email, avatar_url FROM users WHERE id = ?',
        args: [id]
    });

    // 4. SEND A SUCCESS RESPONSE
    return response.status(200).json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Authentication error:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}