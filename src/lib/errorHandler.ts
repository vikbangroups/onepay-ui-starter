import { AxiosError } from 'axios';
import { logger } from './logger';

/**
 * API Error Interface
 * Standardized error response format
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Handles API errors from Axios
 * Converts HTTP errors to user-friendly messages
 * Follows OWASP error handling standards (CWE-209, CWE-211)
 * 
 * @param error - Axios error or unknown error
 * @returns Standardized ApiError object
 */
export function handleApiError(error: unknown): ApiError {
  const timestamp = new Date().toISOString();

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 0;
    const data = error.response?.data as Record<string, unknown> | undefined;

    logger.error('API Error', error, {
      statusCode,
      url: error.config?.url,
      method: error.config?.method,
      timestamp,
    });

    // Map HTTP status codes to user-friendly messages
    const statusMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Your session has expired. Please sign in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      408: 'Request timeout. Please try again.',
      429: 'Too many requests. Please wait a moment and try again.',
      500: 'Server error. Please try again later.',
      502: 'Service unavailable. Please try again later.',
      503: 'Service maintenance in progress. Please try again soon.',
      504: 'Gateway timeout. Please try again later.',
    };

    return {
      code: (data?.code as string) || `HTTP_${statusCode}`,
      message:
        (data?.message as string) ||
        statusMessages[statusCode] ||
        'An unexpected error occurred. Please try again.',
      statusCode,
      details: data?.details as Record<string, unknown> | undefined,
      timestamp,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    logger.error('Application Error', error, {
      timestamp,
    });

    return {
      code: 'APPLICATION_ERROR',
      message: import.meta.env.DEV ? error.message : 'An unexpected error occurred.',
      statusCode: 0,
      timestamp,
    };
  }

  // Handle unknown errors
  logger.error('Unknown Error', new Error('Unknown error type'), {
    error: String(error),
    timestamp,
  });

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    statusCode: 0,
    timestamp,
  };
}

/**
 * Validates error object
 * Useful for type guards
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'statusCode' in value
  );
}

/**
 * Creates a standardized error response
 * Used for consistent error formatting throughout app
 */
export function createError(
  code: string,
  message: string,
  statusCode: number = 0,
  details?: Record<string, unknown>
): ApiError {
  return {
    code,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Gets user-friendly error message
 * Hides sensitive information in production
 */
export function getUserFriendlyMessage(error: ApiError | Error): string {
  if (error instanceof Error) {
    return import.meta.env.DEV ? error.message : 'An unexpected error occurred.';
  }

  return isApiError(error) ? error.message : 'An unexpected error occurred.';
}

/**
 * Retry logic for transient errors
 * Returns true if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    // Retry on 408, 429, 5xx
    return status === 408 || status === 429 || (status >= 500 && status < 600);
  }

  return false;
}

/**
 * Exponential backoff retry
 * Waits before retrying with increasing delays
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts || !isRetryableError(error)) {
        throw error;
      }

      // Calculate delay: 1s, 2s, 4s with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      logger.info(`Retry attempt ${attempt}/${maxAttempts}, waiting ${delay}ms`, {
        error: error instanceof Error ? error.message : String(error),
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retry attempts reached');
}
