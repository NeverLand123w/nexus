// api/videos/sign-upload.js
import { v2 as cloudinary } from 'cloudinary';

// This configuration is critical. It uses the SECURE credentials.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(request, response) {
    // !! SECURITY !! We'll add a user session check here later.
    // For now, this endpoint is open.
    
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);

        // Parameters to be signed
        const params_to_sign = {
            timestamp: timestamp,
            folder: 'nexus-videos',
            // IMPORTANT: 'context' will carry our metadata
            // We can pre-fill it here. This assumes we'll pass 'title'
            // and 'description' from the frontend to THIS endpoint.
        };

        const signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            process.env.CLOUDINARY_API_SECRET
        );

        response.status(200).json({ signature, timestamp });

    } catch (error) {
        console.error('Error generating upload signature:', error);
        response.status(500).json({ error: 'Failed to generate signature' });
    }
}