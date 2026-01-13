/**
 * useLoginForm Hook
 * Manages login form state and logic
 * 🔐 SECURITY: Uses AuthContext for login (httpOnly cookie handling)
 * NOT using localStorage - token managed by backend
 */

import { useState, useCallback } from 'react';
import { validateLoginCredentials } from '../utils/validation';
import { formatPhoneInput } from '../utils/formatting';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/authConstants';
import { useAuth } from '../context/AuthContext';
import { RateLimiter } from '../lib/rateLimiter';
import { logger } from '../lib/logger';

// 🔐 SECURITY: Rate limiter - 5 login attempts per minute
const loginLimiter = new RateLimiter(5, 60000);

export interface UseLoginFormReturn {
  mobile: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  loading: boolean;
  error: string;
  success: string;
  errors: Record<string, string>;
  setMobile: (value: string) => void;
  setPassword: (value: string) => void;
  setRememberMe: (value: boolean) => void;
  toggleShowPassword: () => void;
  handleLogin: () => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { login: authLogin } = useAuth();
  const [mobile, setMobileState] = useState('');
  const [password, setPasswordState] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setMobile = useCallback((value: string) => {
    setMobileState(formatPhoneInput(value));
    setErrors((prev) => ({ ...prev, mobile: '' }));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors((prev) => ({ ...prev, password: '' }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setError('');
    setSuccess('');

    // 🔐 SECURITY: Check rate limit (5 attempts per minute)
    if (!loginLimiter.isAllowed('login')) {
      const rateLimitError = 'Too many login attempts. Please wait 1 minute.';
      setError(rateLimitError);
      logger.warn('Login rate limit exceeded', { phone: mobile });
      return { success: false, message: rateLimitError };
    }

    // Validate form fields
    const validation = validateLoginCredentials(mobile, password);
    if (!validation.valid) {
      setErrors(validation.errors);
      setError('Please fix the errors above');
      logger.debug('Login validation failed', { errors: validation.errors });
      return { success: false, message: ERROR_MESSAGES.LOGIN_FAILED };
    }

    setLoading(true);
    logger.info('Login attempt', { phone: mobile });

    try {
      // 🔐 SECURITY: Call AuthContext login (handles httpOnly cookie + API call)
      // No localStorage manipulation - backend manages token lifecycle
      await authLogin(mobile, password);

      setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      logger.info('Login successful', { phone: mobile });
      return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.LOGIN_FAILED;
      setError(errorMessage);
      logger.error('Login failed', err instanceof Error ? err : new Error(String(err)));
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [mobile, password, authLogin]);

  const clearError = useCallback(() => {
    setError('');
    setErrors({});
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess('');
  }, []);

  const reset = useCallback(() => {
    setMobileState('');
    setPasswordState('');
    setRememberMe(false);
    setShowPassword(false);
    setError('');
    setSuccess('');
    setErrors({});
  }, []);

  return {
    mobile,
    password,
    rememberMe,
    showPassword,
    loading,
    error,
    success,
    errors,
    setMobile,
    setPassword,
    setRememberMe,
    toggleShowPassword,
    handleLogin,
    clearError,
    clearSuccess,
    reset,
  };
};
