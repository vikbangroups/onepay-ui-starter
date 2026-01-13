import { api } from './api';
// Logger module - TODO: implement
// import { logger } from '../lib/logger';

let csrfToken: string | null = null;

/**
 * Fetches CSRF token from backend
 * Caches token in memory to avoid redundant API calls
 * @returns Promise<string> - The CSRF token
 */
export async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    // logger.debug('CSRF token retrieved from cache');
    return csrfToken;
  }

  try {
    // logger.info('Fetching CSRF token from backend');
    const response = await api.get('/auth/csrf-token');
    csrfToken = response.data.token;
    if (csrfToken) {
      // logger.info('CSRF token obtained successfully', { tokenLength: csrfToken.length });
    }
    return csrfToken || '';
  } catch (err) {
    // logger.error('Failed to get CSRF token', err as Error, {
    //   endpoint: '/auth/csrf-token',
    // });
    throw err;
  }
}

/**
 * Request interceptor that adds CSRF token to protected endpoints
 * Automatically injects X-CSRF-Token header for POST, PUT, DELETE requests
 */
export function setupCsrfInterceptor(): void {
  api.interceptors.request.use(
    async (config) => {
      // Only add CSRF token to state-changing requests
      const method = config.method?.toLowerCase();
      if (['post', 'put', 'delete'].includes(method || '')) {
        try {
          const token = await getCsrfToken();
          config.headers['X-CSRF-Token'] = token;
          // logger.debug('CSRF token injected', { method, endpoint: config.url });
        } catch (err) {
          // logger.error('Failed to inject CSRF token', err as Error, {
          //   method,
          //   endpoint: config.url,
          // });
          // Don't throw - allow request to proceed without CSRF token
          // Backend will reject if token is required
        }
      }
      return config;
    },
    (error) => {
      // logger.error('CSRF interceptor request error', error as Error);
      return Promise.reject(error);
    }
  );
}

/**
 * Resets cached CSRF token
 * Call this after logout or on token expiry
 */
export function resetCsrfToken(): void {
  csrfToken = null;
  // logger.info('CSRF token cache cleared');
}

/**
 * Gets cached token without fetching (returns null if not cached)
 * Useful for testing or checking if token is available
 */
export function getCachedCsrfToken(): string | null {
  return csrfToken;
}
