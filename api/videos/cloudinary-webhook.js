import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

// Initialize Turso DB Client
const dbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    console.log("Webhook received. Body:", JSON.stringify(request.body, null, 2));

    try {
        const data = request.body;
        if (data.resource_type !== 'video' || data.notification_type !== 'upload') {
            console.log("Skipping notification: Not a video upload.");
            return response.status(200).json({ message: 'Notification skipped.' });
        }
        
        // --- THIS IS THE FIX ---
        // The custom context is already an object, no parsing needed.
        // We use optional chaining (?.) for safety.
        const customContext = data.context?.custom || {};

        const { secure_url, duration } = data;
        const { title, description, userId } = customContext;

        // The validation logic is now correct
        if (!userId) {
            console.error("CRITICAL: userId not found in webhook context. `data.context.custom.userId` is missing.");
            return response.status(400).json({ message: 'Bad Request: userId is missing from upload context.' });
        }
        
        const videoId = uuidv4();
        
        await dbClient.execute({
            sql: `
                INSERT INTO videos (id, title, description, cloudinary_url, duration, user_id) 
                VALUES (:id, :title, :description, :cloudinary_url, :duration, :user_id);
            `,
            args: {
                id: videoId,
                title: title || 'Untitled Video',
                description: description || '',
                cloudinary_url: secure_url,
                duration: Math.round(duration || 0),
                user_id: userId
            },
        });
        
        console.log(`Successfully saved video ${videoId} for user ${userId}`);
        
        return response.status(200).json({ message: 'Video saved successfully' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}