import axios from 'axios';

// Build base URL from env and append /api safely
const rawBase = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000';
const baseOrigin = String(rawBase).replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${baseOrigin}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


