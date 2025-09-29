// api/videos/sign-upload.js
import { v2 as cloudinary } from 'cloudinary';

// First, log your credentials to make sure they're loaded
console.log('Backend Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  // Be careful logging the secret in public logs, but it's okay for vercel dev
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED', 
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(request, response) {
    const timestamp = Math.round((new Date).getTime()/1000);

    // Explicitly define the parameters we are signing
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'nexus-videos',
    };
    
    // Log them! This is the most important log.
    console.log('Signing these params on the BACKEND:', paramsToSign);

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign, // Use the object here
      process.env.CLOUDINARY_API_SECRET
    );
    
    response.status(200).json({ signature, timestamp });
}