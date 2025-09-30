import React, { createContext, useState, useEffect } from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import axios from 'axios';
// CORRECT
import { jwtDecode } from 'jwt-decode'; 

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs on initial load to check for existing session
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('nexus_token');
            if (token) {
                try {
                    // You might want to verify token with backend here
                    // For now, we decode to get user info for quick UI update
                    const decoded = jwtDecode(token);
                    // Check if token is expired
                    if (decoded.exp * 1000 > Date.now()) {
                        // In a real app, you would fetch the full user profile from your DB
                        // For now, we re-construct a partial user object.
                        const storedUser = JSON.parse(localStorage.getItem('nexus_user'));
                         if (storedUser) {
                           setUser(storedUser);
                         }
                    } else {
                        // Token is expired
                        localStorage.removeItem('nexus_token');
                        localStorage.removeItem('nexus_user');
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                    localStorage.removeItem('nexus_token');
                    localStorage.removeItem('nexus_user');
                }
            }
            setLoading(false);
        };
        checkUserSession();
    }, []);

    const login = async (accessToken) => {
        try {
            const response = await axios.post('/api/auth/google', { token: accessToken });
            const user = response.data.user;
            setUser(user);
            // Store token and user for session persistence
            localStorage.setItem('nexus_token', accessToken);
            localStorage.setItem('nexus_user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
    };

    return (
        <UserContext.Provider value={{ user, setUser: login, logout, loading, isLoggedIn: !!user }}>
            {children}
        </UserContext.Provider>
    );
};