/**
 * Authentication Constants
 * Global standards and configuration
 */

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
    PATTERN: /^[0-9]{10}$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  },
  OTP: {
    LENGTH: 6,
    PATTERN: /^[0-9]{6}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  // Phone validation
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Enter a valid 10-digit phone number',
  PHONE_LENGTH: 'Phone number must be exactly 10 digits',

  // Password validation
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_INVALID: 'Password requires: uppercase (A-Z), lowercase (a-z), number (0-9), special character (@$!%*?&). Example: TestPass@123',
  PASSWORD_MISMATCH: 'Passwords do not match',

  // OTP validation
  OTP_REQUIRED: 'OTP is required',
  OTP_INVALID: 'Enter a valid 6-digit OTP',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',

  // Email validation
  EMAIL_INVALID: 'Enter a valid email address',

  // Auth errors
  LOGIN_FAILED: 'Invalid phone number or password',
  SIGNUP_FAILED: 'Account creation failed. Please try again.',
  OTP_VERIFICATION_FAILED: 'OTP verification failed. Please try again.',
  RESET_PASSWORD_FAILED: 'Password reset failed. Please try again.',

  // Generic
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An error occurred. Please try again.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  SIGNUP_SUCCESS: 'Account created successfully! Please login.',
  OTP_SENT: 'OTP sent to your phone number.',
  OTP_VERIFIED: 'OTP verified successfully!',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully! Please login with new password.',
};

/**
 * OTP Configuration
 */
export const OTP_CONFIG = {
  EXPIRY_TIME: 5 * 60, // 5 minutes in seconds
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN: 30, // 30 seconds
};

/**
 * API Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'one_code_auth_token',
  USER_DATA: 'one_code_user_data',
  REMEMBER_ME: 'one_code_remember_me',
  OTP_EXPIRY: 'one_code_otp_expiry',
};

/**
 * Route Paths
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  VERIFY_OTP: '/verify-otp',
};

/**
 * Regex Patterns
 */
export const PATTERNS = {
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  OTP: /^[0-9]{6}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
};

/**
 * Password Strength Levels
 */
export const PASSWORD_STRENGTH = {
  WEAK: { score: 1, label: 'Weak', color: '#dc2626' },
  FAIR: { score: 2, label: 'Fair', color: '#ff9800' },
  GOOD: { score: 3, label: 'Good', color: '#2196f3' },
  STRONG: { score: 4, label: 'Strong', color: '#00b383' },
};

/**
 * Demo Credentials (Development Only)
 */
export const DEMO_CREDENTIALS = {
  PHONE: '9876543210',
  PASSWORD: 'TestPass@123',
  OTP: '123456',
};

/**
 * Timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_CALL: 10000,
  REDIRECT: 1500,
  TOAST_NOTIFICATION: 3000,
};
