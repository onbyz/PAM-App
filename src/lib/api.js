import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 20000
});

// Request interceptor: Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    // If token expired and not already trying to refresh
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/refresh-token`, {
          refreshToken
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = response.data?.data;

        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; 
    }

    return Promise.reject(error);
  }
);

export default api;
