import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Default 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT and timeout adjustments
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Increase timeout for endpoints that send emails (registration/verification)
    if (config.url?.includes('/auth/register') || config.url?.includes('/auth/verify')) {
      config.timeout = 60000; // 60 seconds for email operations
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
