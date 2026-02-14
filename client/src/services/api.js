import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling, e.g., 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401: e.g., redirect to login
      localStorage.removeItem('token');
      // You might want to use a global state manager or context to trigger a redirect
      // For now, we'll just log and let the component handle navigation if needed.
      console.error('Unauthorized, redirecting to login...');
      window.location.href = '/login'; // Simple redirect, can be improved with useNavigate
    }
    return Promise.reject(error);
  },
);

export default api;