import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for Axios
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'https://backend-production-5941.up.railway.app';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            fetchUser();
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/user');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout(); // Log out if fetching user fails
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken); // Update token in state
            setIsLoggedIn(true);
            await fetchUser();
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed'); // Propagate the error
        }
    };

    const register = async (name, username, password) => {
        try {
            await axios.post('/api/auth/register', { name, username, password }, { withCredentials: true });
            await login(username, password); 
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error('Registration failed'); // Propagate the error
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null); // Clear token from state
        delete axios.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
