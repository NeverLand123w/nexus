// api/videos/cloudinary-webhook.js
import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

const dbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(request, response) {
  // TODO: Add webhook security verification in production!

  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  try {
    const data = request.body;

    // Check if it's a successful video upload notification
    if (data.notification_type === 'upload' && data.resource_type === 'video') {
      const {
        public_id,
        secure_url,
        playback_url,
        duration,
        width,
        height,
        context // this is where we get our custom metadata!
      } = data;
      
      const title = context?.custom?.title || 'Untitled Video';
      const description = context?.custom?.description || '';
      
      // We'll need the user's ID here. This is a challenge!
      // For now, we'll need to update our upload flow to pass it.
      // A good way is to add it to the 'context' as well.
      // const userId = context?.custom?.userId;

      // TODO: Replace with the actual userId
      const temporaryUserId = 'google-oauth2|...'; // Get a real user ID from your `users` table
      if(!temporaryUserId) {
        console.error("No user ID found in webhook context!");
        return response.status(400).send("Bad Request: Missing userId");
      }

      const videoId = uuidv4();

      await dbClient.execute({
        sql: `INSERT INTO videos (id, title, description, cloudinary_url, duration, user_id) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [videoId, title, description, secure_url, Math.round(duration), temporaryUserId],
      });
      
      console.log(`Successfully inserted video ${videoId} for user ${temporaryUserId}`);
    }
    
    return response.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    return response.status(500).send('Internal Server Error');
  }
}