import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid'; // Use npm install uuid

// Initialize Turso DB Client
const dbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});


// Helper function to safely parse context string: "key1=value1|key2=value2"
const parseContext = (contextString) => {
    const context = {};
    if (typeof contextString === 'string') {
        contextString.split('|').forEach(part => {
            const [key, ...valueParts] = part.split('=');
            if (key) {
                context[key] = valueParts.join('=');
            }
        });
    }
    return context;
};

export default async function handler(request, response) {
    // We only accept POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    console.log("Webhook received. Body:", JSON.stringify(request.body, null, 2));

    try {
        const data = request.body;

        // Verify it's a notification for a successful video upload
        if (data.resource_type !== 'video' || data.notification_type !== 'upload') {
            console.log("Skipping notification: Not a video upload.");
            return response.status(200).json({ message: 'Notification skipped.' });
        }

        const { secure_url, duration, context } = data;

        // Safely parse custom metadata we sent from the frontend
        const customContext = parseContext(context?.custom);

        const title = customContext.title || 'Untitled Video';
        const description = customContext.description || '';
        const userId = customContext.userId; // <-- We now get the userId!

        // VALIDATION: This is what was causing the 500 error before
        if (!userId) {
            console.error("CRITICAL: Webhook received without a userId in the context. Cannot save video.");
            // We return a 400 Bad Request because the uploader didn't provide required info
            return response.status(400).json({ message: 'Bad Request: Missing userId in upload context.' });
        }

        // Generate a new unique ID for our video record
        const videoId = uuidv4();

        await dbClient.execute({
            sql: `
                INSERT INTO videos (id, title, description, cloudinary_url, duration, user_id) 
                VALUES (:id, :title, :description, :cloudinary_url, :duration, :user_id);
            `,
            args: {
                id: videoId,
                title,
                description,
                cloudinary_url: secure_url,
                duration: Math.round(duration || 0),
                user_id: userId
            },
        });

        console.log(`Successfully saved video ${videoId} for user ${userId}`);

        return response.status(200).json({ message: 'Video saved successfully' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        // A 500 error indicates a problem on our end (e.g., DB connection)
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}