import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveAuth = (result: { accessToken: string; refreshToken: string; user: User }) => {
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user);
  };

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    saveAuth(result);
  };

  const register = async (email: string, name: string, password: string) => {
    const result = await authService.register(email, name, password);
    saveAuth(result);
  };

  const googleLogin = async (idToken: string) => {
    const result = await authService.googleLogin(idToken);
    saveAuth(result);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('accessToken');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
