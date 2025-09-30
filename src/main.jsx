import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext'; // Import the new provider

// IMPORTANT: This needs to be in your .env.local file
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);