import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('xaam_user')) || null; } catch { return null; }
  });

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    const token = data.token || data.accessToken;
    const account = data.user || data.utilisateur || data;
    if (token) localStorage.setItem('xaam_token', token);
    if (account) localStorage.setItem('xaam_user', JSON.stringify(account));
    setUser(account);
    return account;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('xaam_token');
    localStorage.removeItem('xaam_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout, isAuthenticated: !!localStorage.getItem('xaam_token') }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
