import { z } from 'zod';

/**
 * Auth Validation Schemas
 * All schemas follow OWASP validation standards
 */

export const SignupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[!@#$%^&*]/, 'Password must contain special character'),

  confirmPassword: z.string(),

  role: z.enum(['user', 'merchant']).refine(
    val => ['user', 'merchant'].includes(val),
    { message: 'Invalid role' }
  ),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),

  password: z.string()
    .min(1, 'Password is required'),
});

export const OTPSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must contain only numbers'),
});

/**
 * Payment Validation Schemas
 * Amount limits in INR (Rupees)
 */

export const AddMoneySchema = z.object({
  amount: z.number()
    .min(100, 'Minimum amount is ₹100')
    .max(100000, 'Maximum amount is ₹100,000'),

  paymentMethod: z.enum(['razorpay', 'card', 'upi']).refine(
    val => ['razorpay', 'card', 'upi'].includes(val),
    { message: 'Invalid payment method' }
  ),
});

export const PayoutSchema = z.object({
  beneficiaryId: z.string()
    .uuid('Invalid beneficiary ID'),

  amount: z.number()
    .min(100, 'Minimum payout is ₹100')
    .max(500000, 'Maximum payout is ₹500,000'),

  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

/**
 * Beneficiary Validation Schema
 */
export const BeneficiarySchema = z.object({
  accountNumber: z.string()
    .min(8, 'Account number must be at least 8 digits')
    .max(18, 'Account number must be less than 18 digits')
    .regex(/^[0-9]+$/, 'Account number can only contain digits'),

  ifscCode: z.string()
    .length(11, 'IFSC code must be 11 characters')
    .regex(/^[A-Z0-9]{11}$/, 'Invalid IFSC code format'),

  beneficiaryName: z.string()
    .min(2, 'Beneficiary name must be at least 2 characters')
    .max(60, 'Beneficiary name must be less than 60 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  bankName: z.string()
    .min(2, 'Bank name is required')
    .max(50, 'Bank name must be less than 50 characters'),
});

/**
 * Transaction Filter Schema
 */
export const TransactionFilterSchema = z.object({
  startDate: z.string().date('Invalid start date').optional(),
  endDate: z.string().date('Invalid end date').optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  type: z.enum(['send', 'receive', 'add_money']).optional(),
}).refine(
  data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

/**
 * Type exports for TypeScript support
 */
export type SignupFormData = z.infer<typeof SignupSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type OTPFormData = z.infer<typeof OTPSchema>;
export type AddMoneyFormData = z.infer<typeof AddMoneySchema>;
export type PayoutFormData = z.infer<typeof PayoutSchema>;
export type BeneficiaryFormData = z.infer<typeof BeneficiarySchema>;
export type TransactionFilterData = z.infer<typeof TransactionFilterSchema>;
