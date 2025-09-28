// api/videos/sign-upload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(request, response) {
    // !! IMPORTANT !! Add authentication check here later
    // For now, anyone can get a signature.
    // In Sprint 5, we'll lock this down.
    
    const timestamp = Math.round((new Date).getTime()/1000);
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'nexus-videos', // The folder we want to upload to
      },
      process.env.CLOUDINARY_API_SECRET
    );
    
    response.status(200).json({ signature, timestamp });
}