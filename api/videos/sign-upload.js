// api/videos/sign-upload.js
import { v2 as cloudinary } from 'cloudinary';

// No need to configure here; Vercel does this via environment variables
// automatically if the names are CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME etc.
// But we'll do it manually to be explicit and safe.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default async function handler(request, response) {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const folder = 'nexus-videos'; // Define folder explicitly

        // This object is what we will sign
        const params_to_sign = {
            timestamp: timestamp,
            folder: folder,
        };

        // --- DEBUG LOGGING ---
        console.log("--- Generating Signature ---");
        console.log("Timestamp:", timestamp);
        console.log("Folder:", folder);
        console.log("Params to Sign:", params_to_sign);
        console.log("API Secret Used (last 4 chars):", `...${process.env.CLOUDINARY_API_SECRET.slice(-4)}`);
        // ---------------------

        const signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            process.env.CLOUDINARY_API_SECRET
        );

        console.log("Generated Signature:", signature);
        console.log("--------------------------");


        response.status(200).json({ signature, timestamp });

    } catch (error) {
        console.error('Error generating upload signature:', error);
        response.status(500).json({ error: 'Failed to generate signature' });
    }
}