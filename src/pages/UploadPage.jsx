import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Import our context
import axios from 'axios';

// Get these from your .env.local file
const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const VITE_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function UploadPage() {
    const { user, isLoggedIn } = useContext(UserContext); // Get the logged in user
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

        if (!VITE_CLOUD_NAME || !VITE_UPLOAD_PRESET) {
            console.error("Cloudinary environment variables are not set!");
            alert("Error: App is not configured for uploads. Please contact support.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', videoFile);
            formData.append('upload_preset', VITE_UPLOAD_PRESET);
            // THIS IS THE CRITICAL CHANGE: We add the userId to the context
            formData.append('context', `title=${title}|description=${description}|userId=${user.id}`);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/video/upload`;
            
            await axios.post(uploadUrl, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });

            alert('Video uploaded successfully! It will appear on the site once processed.');

            setTitle('');
            setDescription('');
            setVideoFile(null);
            e.target.reset();

        } catch (error) {
            console.error('Upload failed:', error.response?.data || error.message);
            alert('Upload failed. Please check the console and try again.');
        } finally {
            setUploading(false);
        }
    };
    
    // Protect the route client-side
    if (!isLoggedIn) {
        return (
            <div>
                <h2>Upload Video</h2>
                <p>Please log in to upload a video.</p>
            </div>
        );
    }
    
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