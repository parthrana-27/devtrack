import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('access_token');
      // In a real app, you might want to redirect to login or handle refresh tokens here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
