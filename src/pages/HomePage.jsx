// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/videos/latest');
                setVideos(response.data);
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    if (loading) return <p>Loading videos...</p>;
    if (videos.length === 0) return <p>No videos found. Be the first to upload!</p>;

    return (
        <div>
            <h2>Latest Videos</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;