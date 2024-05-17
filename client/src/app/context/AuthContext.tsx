import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AuthContextProps {
  user: { token: string };
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({token: ''});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, { username, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    setUser(data);
    router.push('/');
  };

  const register = async (username: string, password: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, { username, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    setUser(data);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser({ token: '' });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
