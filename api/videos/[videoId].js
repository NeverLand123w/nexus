// api/videos/[videoId].js
import { createClient } from '@libsql/client';

const dbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(request, response) {
    const { videoId } = request.query; // This extracts the ID from the URL

    try {
        const result = await dbClient.execute({
            sql: `
                SELECT 
                    v.id, v.title, v.description, v.cloudinary_url, v.created_at,
                    u.id AS channel_id, u.name AS channel_name, u.avatar_url AS channel_avatar
                FROM 
                    videos v
                LEFT JOIN 
                    users u ON v.user_id = u.id
                WHERE 
                    v.id = ?;
            `,
            args: [videoId],
        });
        
        if (result.rows.length === 0) {
            return response.status(404).json({ message: 'Video not found' });
        }

        const video = { ...result.rows[0] };

        return response.status(200).json(video);

    } catch (error) {
        console.error('Failed to fetch video:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}