// src/pages/UploadPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

// Get the required variables from your .env.local file
const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const VITE_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
    // Simple validation
    if (!VITE_CLOUD_NAME || !VITE_UPLOAD_PRESET) {
      console.error("Cloudinary environment variables are not set!");
      alert("Error: App is not configured for uploads. Please contact support.");
      return;
    }

    setUploading(true);
    setUploadProgress(0); // Reset progress

    try {
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('upload_preset', VITE_UPLOAD_PRESET); // This is the KEY
        formData.append('context', `title=${title}|description=${description}`);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/video/upload`;
        
        const uploadResponse = await axios.post(uploadUrl, formData, {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setUploadProgress(progress);
            },
        });

        console.log('Upload successful:', uploadResponse.data);
        alert('Video uploaded successfully! It will appear on the site once processed.');

        // Reset the form
        setTitle('');
        setDescription('');
        setVideoFile(null);
        e.target.reset(); // Resets the file input

    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        alert('Upload failed. Please check the console and try again.');
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
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{width: "300px", padding: "8px"}}/>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="description">Description</label><br />
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{width: "300px", height: "100px", padding: "8px"}} />
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="video">Video File</label><br />
          <input type="file" id="video" accept="video/*" onChange={handleFileChange} required />
        </div>

        {uploading && (
            <div style={{margin: '1rem 0', width: "300px"}}>
                <p>Uploading... {uploadProgress}%</p>
                <progress value={uploadProgress} max="100" style={{ width: '100%' }} />
            </div>
        )}

        <button type="submit" disabled={uploading} style={{padding: "10px 20px", cursor: "pointer"}}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;