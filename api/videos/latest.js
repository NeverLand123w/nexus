// api/videos/latest.js
import { createClient } from '@libsql/client';

const dbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // A LEFT JOIN gets video data AND the uploader's name and avatar in one efficient query.
        const result = await dbClient.execute(`
            SELECT 
                v.id, 
                v.title,
                v.thumbnail_url, 
                v.created_at,
                u.name AS channel_name,
                u.avatar_url AS channel_avatar
            FROM 
                videos v
            LEFT JOIN 
                users u ON v.user_id = u.id
            ORDER BY 
                v.created_at DESC
            LIMIT 20;
        `);

        // LibSQL client returns data in a slightly different format than some other drivers.
        // We need to map the result into a simple array of objects.
        const videos = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            thumbnail_url: row.thumbnail_url, // This might be null for now
            created_at: row.created_at,
            channel_name: row.channel_name,
            channel_avatar: row.channel_avatar
        }));
        
        return response.status(200).json(videos);

    } catch (error) {
        console.error('Failed to fetch latest videos:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}