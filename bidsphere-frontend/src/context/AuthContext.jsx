import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredUser, setStoredUser, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const saved = getStoredUser();
    // If the saved session is the Marcus demo session, clean it up so the visitor sees Login/Register
    if (saved && (saved.name?.includes('Marcus') || saved.email === 'seller@motors.com')) {
      setStoredUser(null);
      setAuthToken(null);
      setUser(null);
    } else if (saved && saved.token) {
      setUser(saved);
      setAuthToken(saved.token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      token: res.token
    };
    setAuthToken(res.token);
    setStoredUser(userData);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone, role) => {
    const cleanRole = (role || 'BIDDER').replace(/^ROLE_/, '').toUpperCase();
    const res = await api.register({ name, email, password, phone, role: cleanRole });
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      token: res.token
    };
    setAuthToken(res.token);
    setStoredUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
  };

  const switchDemoRole = (role) => {
    let demo;
    if (role === 'ADMIN') {
      demo = {
        id: 1,
        name: 'System Administrator',
        email: 'admin@bidsphere.com',
        role: 'ROLE_ADMIN',
        token: 'mock-jwt-admin-token'
      };
    } else if (role === 'SELLER') {
      demo = {
        id: 2,
        name: 'Heritage Consignment',
        email: 'seller@bidsphere.com',
        role: 'ROLE_SELLER',
        token: 'mock-jwt-seller-token'
      };
    } else {
      demo = {
        id: 3,
        name: 'David Henderson',
        email: 'bidder@bidsphere.com',
        role: 'ROLE_BIDDER',
        token: 'mock-jwt-bidder-token'
      };
    }
    setStoredUser(demo);
    setAuthToken(demo.token);
    setUser(demo);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isBidder: user?.role === 'ROLE_BIDDER' || user?.role === 'ROLE_ADMIN',
    isSeller: user?.role === 'ROLE_SELLER' || user?.role === 'ROLE_ADMIN',
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    register,
    logout,
    switchDemoRole,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
