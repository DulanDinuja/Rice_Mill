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
    
    if (response.data === 'Login successful') {
      const mockUser = {
        id: 1,
        name: credentials.emailOrUsername,
        email: credentials.emailOrUsername,
        role: 'admin'
      };
      const mockToken = 'jwt-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('access_token', mockToken);
      setUser(mockUser);
      return { success: true };
    }
    throw new Error('Login failed');
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
    
    if (response.data === 'User registered successfully') {
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        idNumber: userData.idNumber,
        mobileNumber: userData.mobileNumber,
        role: 'user'
      };
      const mockToken = 'jwt-token-' + Date.now();

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('access_token', mockToken);
      setUser(mockUser);
      return { success: true };
    }
    throw new Error(response.data || 'Registration failed');
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
