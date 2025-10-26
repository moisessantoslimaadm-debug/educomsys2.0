import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { User } from './types';

export interface AuthResponse {
    authToken: string;
    user: User;
}

const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
                setTheme(mediaQuery.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, setTheme]);

    const handleLoginSuccess = useCallback((data: AuthResponse) => {
        localStorage.setItem('authToken', data.authToken);
        setUser(data.user);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
    }, []);


    useEffect(() => {
        const initializeApp = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Assumes a /auth/me endpoint that validates the token and returns the user
                    const userData = await api.get<User>('/auth/me');
                    setUser(userData);
                } catch (error) {
                    console.error("Token validation failed:", error);
                    handleLogout(); // Clear invalid token
                }
            }
            setLoading(false);
        };

        initializeApp();
    }, [handleLogout]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <Routes>
            {user ? (
                <>
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/*" element={<Dashboard user={user} onLogout={handleLogout} />} />
                </>
            ) : (
                <>
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            )}
        </Routes>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
);

export default App;
