import React, { createContext, useContext, useState, useEffect } from 'react';
import { authMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { userId, email, role }
  const [loading, setLoading] = useState(true); // checking existing session on mount

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      authMe()
        .then(res => setUser(res.data))
        .catch(() => {
          // Token invalid/expired, clear it
          localStorage.removeItem('sessionToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('sessionToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sessionToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
