import axios from 'axios';
import { ENV } from '../config/environment';
import { handleApiError } from '../lib/errorHandler';
import { logger } from '../lib/logger';

// 🔐 SECURITY: httpOnly cookie handled by backend (no client-side storage)

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  withCredentials: true, // 🔐 IMPORTANT: Send cookies with requests
});

// Request interceptor - log outgoing requests in development
api.interceptors.request.use(
  config => {
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: { ...config.headers },
    });
    return config;
  },
  error => {
    logger.error('Request interceptor error', error as Error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and 401
api.interceptors.response.use(
  response => {
    logger.debug('API Response', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  error => {
    // Handle API errors with error handler
    const apiError = handleApiError(error);

    // Special handling for 401 - session expired
    if (apiError.statusCode === 401) {
      logger.warn('Session expired - redirecting to login', {
        url: error.config?.url,
      });
      // Clear any cached auth data
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default api;