import { z } from 'zod';

/**
 * 🔐 Mobile & OTP Validation Schema
 * Used for login form validation with Zod
 */

// Mobile number validation (India-style: 10 digits)
export const mobileSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .regex(/^\d+$/, 'Mobile number must contain only digits')
  .length(10, 'Mobile number must be exactly 10 digits');

// OTP validation (6 digits)
export const otpSchema = z
  .string()
  .min(1, 'OTP is required')
  .regex(/^\d+$/, 'OTP must contain only digits')
  .length(6, 'OTP must be exactly 6 digits');

// Password validation
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must not exceed 50 characters');

// Login with OTP schema
export const loginWithOtpSchema = z.object({
  mobile: mobileSchema,
  otp: otpSchema,
});

// Login with Password schema
export const loginWithPasswordSchema = z.object({
  mobile: mobileSchema,
  password: passwordSchema,
});

// Send OTP schema (just mobile)
export const sendOtpSchema = z.object({
  mobile: mobileSchema,
});

// Forgot Password schema
export const forgotPasswordSchema = z.object({
  mobile: mobileSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports
export type LoginWithOtp = z.infer<typeof loginWithOtpSchema>;
export type LoginWithPassword = z.infer<typeof loginWithPasswordSchema>;
export type SendOtp = z.infer<typeof sendOtpSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
