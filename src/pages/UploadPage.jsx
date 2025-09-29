// src/pages/UploadPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !title) {
      alert('Please select a video file and provide a title.');
      return;
    }
    setUploading(true);

    try {
      // Step 1: Request the simplified signature
      const { data: signatureData } = await axios.get('../../api/videos/sign-upload');
      const { signature, timestamp } = signatureData;

      // Step 2: Create a FormData object. ONLY include parameters that were signed.
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

      // --- CRITICAL CHANGE ---
      // Match the backend EXACTLY. We are only sending timestamp and signature now.
      // We REMOVED the 'folder' parameter for this test.
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      // Context is NOT part of the signature, so it's fine to keep.
      formData.append('context', `title=${title}|description=${description}`);

      // LOG THE FORM DATA WE ARE ABOUT TO SEND
      console.log("--- Sending to Cloudinary ---");
      for (let pair of formData.entries()) {
        // Don't log the file content itself
        if (pair[0] !== 'file') {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }
      console.log("----------------------------");

      // Step 3: Make the POST request to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`;

      const uploadResponse = await axios.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      console.log('Upload successful:', uploadResponse.data);
      alert('Video uploaded successfully! It will appear on the site once processed.');

      // Reset form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label><br />
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="description">Description</label><br />
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="video">Video File</label><br />
          <input type="file" id="video" accept="video/*" onChange={handleFileChange} required />
        </div>

        {uploading && (
          <div>
            <p>Uploading... {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" style={{ width: '100%' }} />
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;