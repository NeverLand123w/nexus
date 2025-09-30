// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// A simple placeholder image for thumbnails
const THUMBNAIL_PLACEHOLDER = 'https://via.placeholder.com/320x180.png?text=Nexus';

const VideoCard = ({ video }) => {
    const { id, title, thumbnail_url, channel_name, channel_avatar } = video;
    
    return (
        <Link to={`/watch/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '320px', marginBottom: '2rem' }}>
                <img 
                    src={thumbnail_url || THUMBNAIL_PLACEHOLDER} 
                    alt={title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ display: 'flex', marginTop: '0.5rem' }}>
                    <img 
                        src={channel_avatar || 'https://via.placeholder.com/40'} 
                        alt={channel_name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.5rem' }} 
                    />
                    <div>
                        <h4 style={{ margin: 0, padding: 0 }}>{title}</h4>
                        <p style={{ margin: '0.25rem 0 0', color: '#606060' }}>{channel_name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;