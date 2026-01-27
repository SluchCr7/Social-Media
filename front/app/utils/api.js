import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global handling for 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('loginState');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/Login')) {
          window.location.href = '/Pages/Login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
