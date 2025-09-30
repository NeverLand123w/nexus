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
        // Join videos and users to get all needed info
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

        // Log raw result to inspect the structure
        console.log("Raw DB result:", JSON.stringify(result, null, 2));

        // Safer mapping: use column names
        const videos = result.rows.map(row => {
            const videoObj = {};
            result.columns.forEach((col, index) => {
                videoObj[col] = row[index];
            });
            return videoObj;
        });

        return response.status(200).json(videos);

    } catch (error) {
        console.error('Failed to fetch latest videos:', error);
        return response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}