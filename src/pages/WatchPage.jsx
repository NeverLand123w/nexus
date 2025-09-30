// src/pages/WatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WatchPage = () => {
    const { videoId } = useParams(); // Gets the videoId from the URL
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!videoId) return;

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/videos/${videoId}`);
                setVideo(response.data);
            } catch (error) {
                console.error("Failed to fetch video", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [videoId]);

    if (loading) return <p>Loading video...</p>;
    if (!video) return <p>Video not found.</p>;

    return (
        <div>
            <video 
                src={video.cloudinary_url} 
                controls 
                autoPlay 
                style={{ width: '100%', maxWidth: '800px', backgroundColor: 'black' }}
            />
            <h1 style={{ marginTop: '1rem' }}>{video.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                <img 
                    src={video.channel_avatar || 'https://via.placeholder.com/48'} 
                    alt={video.channel_name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '1rem' }}
                />
                <div>
                    <h3 style={{ margin: 0 }}>{video.channel_name}</h3>
                    {/* Subscriber count will go here later */}
                </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                <p>{video.description}</p>
            </div>
        </div>
    );
};

export default WatchPage;