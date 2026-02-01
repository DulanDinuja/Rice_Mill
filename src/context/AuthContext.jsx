import { createContext, useContext, useState, useEffect } from 'react';

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
    // Mock login - accepts username or email
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: credentials.emailOrUsername,
      role: 'admin'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('access_token', mockToken);
    setUser(mockUser);
    return { success: true };
  };

  const register = async (userData) => {
    // Mock register
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      idNumber: userData.idNumber,
      mobileNumber: userData.mobileNumber,
      role: 'user'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('access_token', mockToken);
    setUser(mockUser);
    return { success: true };
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
