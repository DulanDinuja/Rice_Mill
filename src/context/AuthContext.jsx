import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', {
      username: credentials.emailOrUsername,
      password: credentials.password
    });

    if (response.data?.access_token && response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('access_token', response.data.access_token);
      setUser(response.data.user);
      return { success: true };
    }

    throw new Error(response.data || 'Login failed');
  };

  const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', {
      username: userData.name,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      nic: userData.idNumber,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    });

    if (typeof response.data === 'string' && response.data === 'User registered successfully') {
      return { success: true };
    }

    if (response.data?.access_token && response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('access_token', response.data.access_token);
      setUser(response.data.user);
      return { success: true };
    }

    throw new Error(typeof response.data === 'string' ? response.data : response.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
