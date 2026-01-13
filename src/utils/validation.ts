/**
 * Validation Utilities
 * Enterprise-grade form validation
 */

import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  PATTERNS,
} from './authConstants';

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) {
    return { valid: false, error: ERROR_MESSAGES.PHONE_REQUIRED };
  }

  if (phone.length !== VALIDATION_RULES.PHONE.MIN_LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.PHONE_LENGTH };
  }

  if (!PATTERNS.PHONE.test(phone)) {
    return { valid: false, error: ERROR_MESSAGES.PHONE_INVALID };
  }

  return { valid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: ERROR_MESSAGES.PASSWORD_REQUIRED };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.PASSWORD_MIN_LENGTH };
  }

  if (!PATTERNS.PASSWORD.test(password)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.PASSWORD_INVALID,
    };
  }

  return { valid: true };
};

/**
 * Validate OTP
 */
export const validateOtp = (otp: string): { valid: boolean; error?: string } => {
  if (!otp) {
    return { valid: false, error: ERROR_MESSAGES.OTP_REQUIRED };
  }

  if (otp.length !== VALIDATION_RULES.OTP.LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.OTP_INVALID };
  }

  if (!PATTERNS.OTP.test(otp)) {
    return { valid: false, error: ERROR_MESSAGES.OTP_INVALID };
  }

  return { valid: true };
};

/**
 * Validate email
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!PATTERNS.EMAIL.test(email)) {
    return { valid: false, error: ERROR_MESSAGES.EMAIL_INVALID };
  }

  return { valid: true };
};

/**
 * Validate password match
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { valid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH };
  }

  return { valid: true };
};

/**
 * Calculate password strength
 */
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
  requirements: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasMinLength: boolean;
  };
} => {
  let score = 0;
  const requirements = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
    hasMinLength: password.length >= 8,
  };

  if (requirements.hasLowercase) score++;
  if (requirements.hasUppercase) score++;
  if (requirements.hasNumber) score++;
  if (requirements.hasSpecial) score++;
  if (requirements.hasMinLength) score++;

  const strengthLevels = [
    { score: 0, label: 'Very Weak', color: '#dc2626' },
    { score: 1, label: 'Weak', color: '#f97316' },
    { score: 2, label: 'Fair', color: '#ff9800' },
    { score: 3, label: 'Good', color: '#2196f3' },
    { score: 4, label: 'Strong', color: '#00b383' },
    { score: 5, label: 'Very Strong', color: '#16a34a' },
  ];

  const strength = strengthLevels[score] || strengthLevels[0];

  return {
    score,
    label: strength.label,
    color: strength.color,
    requirements,
  };
};

/**
 * Validate login credentials
 */
export const validateLoginCredentials = (
  phone: string,
  password: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error || '';
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error || '';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signup data
 */
export const validateSignupData = (
  phone: string,
  email: string | undefined,
  password: string,
  confirmPassword: string,
  agreedToTerms: boolean
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error || '';
  }

  if (email) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || '';
    }
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error || '';
  }

  const matchValidation = validatePasswordMatch(password, confirmPassword);
  if (!matchValidation.valid) {
    errors.confirmPassword = matchValidation.error || '';
  }

  if (!agreedToTerms) {
    errors.terms = 'You must agree to the terms and conditions';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate forgot password data
 */
export const validateForgotPasswordData = (
  mobile: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const phoneValidation = validatePhone(mobile);
  if (!phoneValidation.valid) {
    errors.mobile = phoneValidation.error || '';
  }

  const otpValidation = validateOtp(otp);
  if (!otpValidation.valid) {
    errors.otp = otpValidation.error || '';
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    errors.newPassword = passwordValidation.error || '';
  }

  const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
  if (!matchValidation.valid) {
    errors.confirmPassword = matchValidation.error || '';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
