// api/videos/sign-upload.js
import { v2 as cloudinary } from 'cloudinary';

// This configuration part should be correct if your .env file is being read
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(request, response) {
    try {
      const timestamp = Math.round((new Date).getTime()/1000);
      
      // LOG THE PARAMS YOU ARE SIGNING
      console.log('Signing parameters:', { timestamp });

      // Generate a signature using ONLY the timestamp
      const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp }, 
        process.env.CLOUDINARY_API_SECRET
      );

      console.log('Generated signature:', signature);
      
      response.status(200).json({ signature, timestamp });

    } catch (error) {
        console.error("Error signing upload:", error);
        response.status(500).json({ error: "Could not sign upload request." });
    }
}