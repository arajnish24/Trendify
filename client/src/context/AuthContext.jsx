import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('token');
        } catch (e) {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token && typeof token === 'string' && token.split('.').length === 3) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    
                    const decoded = JSON.parse(jsonPayload);
                    if (decoded && typeof decoded === 'object') {
                        setUser(decoded);
                        setLoading(false); // <--- Set loading false as soon as we have decoded user
                        
                        // Fetch full profile (addresses, cards) in background
                        try {
                            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (response.ok) {
                                const data = await response.json();
                                // Merge data to preserve isAdmin from token if server omits it
                                setUser(prev => ({ ...prev, ...data }));
                            }
                        } catch (err) {
                            console.error("Profile fetch error:", err);
                        }
                    } else {
                        setUser(null);
                        setLoading(false);
                    }
                } catch (e) {
                    console.error("JWT Decode error:", e);
                    setUser(null);
                    localStorage.removeItem('token');
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                return { success: false, message: `Server error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message || "Login failed" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Server connection failed. Please ensure the backend is running." };
        }
    };

    const register = async (name, email, mobile, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, mobile, password })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                return { success: false, message: `Server error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                // Return success without setting token or logging in automatically
                return { success: true };
            } else {
                return { success: false, message: data.message || "Registration failed" };
            }
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, message: "Server connection failed. Please ensure the backend is running." };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const fetchProfile = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, fetchProfile, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

