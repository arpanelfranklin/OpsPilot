import axios from 'axios';

/**
 * Base Axios instance for the Spring Boot backend.
 *
 * Resolution order:
 *  1. VITE_API_BASE_URL env variable (set explicitly in .env or Docker build arg)
 *  2. /api/v1  — works in both:
 *     - Dev: Vite dev-server proxy forwards /api → http://localhost:8080
 *     - Docker: nginx proxy forwards /api → http://backend:8080
 */
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (for future JWT or API keys)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
