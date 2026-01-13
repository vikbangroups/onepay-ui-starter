/**
 * Authentication Type Definitions
 * Global standard types for auth system
 */

/**
 * Login Credentials
 */
export interface LoginCredentials {
  mobile: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Sign Up Data
 */
export interface SignUpData {
  phone: string;
  email?: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

/**
 * Forgot Password Data
 */
export interface ForgotPasswordData {
  mobile: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Auth API Response
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message: string;
  code?: string;
}

/**
 * User Profile
 */
export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role?: 'user' | 'admin' | 'merchant';
  createdAt?: Date;
  lastLogin?: Date;
  verified?: boolean;
}

/**
 * Auth Context State
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  signup: (data: SignUpData) => Promise<void>;
  resetPassword: (data: ForgotPasswordData) => Promise<void>;
}

/**
 * OTP Response
 */
export interface OtpResponse {
  success: boolean;
  message: string;
  expiryTime?: number; // in seconds
  attempts?: number;
}

/**
 * OTP Verification
 */
export interface OtpVerification {
  phone: string;
  otp: string;
}

/**
 * Validation Error
 */
export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

/**
 * Form State
 */
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
