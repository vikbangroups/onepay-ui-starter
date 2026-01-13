/**
 * useSignUpForm Hook
 * State management and validation for SignUp form
 */

import { useState } from 'react';

export interface SignUpFormData {
  phone: string;
  countryCode: string;
  fullName: string;
  email: string;
  businessName: string;
  businessType: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  role: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  newsletterOptIn: boolean;
}

export interface SignUpErrors {
  phone?: string;
  fullName?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;
  role?: string;
  acceptedTerms?: string;
  acceptedPrivacy?: string;
}

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    phone: '',
    countryCode: '+91',
    fullName: '',
    email: '',
    businessName: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    role: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
    newsletterOptIn: false,
  });

  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field changes
   */
  const handleFieldChange = (field: keyof SignUpFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof SignUpErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Validate phone number (10 digits)
   */
  const validatePhone = (phone: string): string | undefined => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly) {
      return 'Phone number is required';
    }
    if (digitsOnly.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    return undefined;
  };

  /**
   * Validate full name (3-50 chars, letters/spaces/hyphens)
   */
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 3) {
      return 'Full name must be at least 3 characters';
    }
    if (name.trim().length > 50) {
      return 'Full name cannot exceed 50 characters';
    }
    if (!/^[a-zA-Z\s\-]+$/.test(name)) {
      return 'Full name can only contain letters, spaces, and hyphens';
    }
    return undefined;
  };

  /**
   * Validate email format
   */
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  /**
   * Validate business name (3-100 chars)
   */
  const validateBusinessName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Business name is required';
    }
    if (name.trim().length < 3) {
      return 'Business name must be at least 3 characters';
    }
    if (name.trim().length > 100) {
      return 'Business name cannot exceed 100 characters';
    }
    return undefined;
  };

  /**
   * Validate business type (required selection)
   */
  const validateBusinessType = (type: string): string | undefined => {
    if (!type) {
      return 'Please select a business type';
    }
    return undefined;
  };

  /**
   * Validate password strength (8+ chars, uppercase, lowercase, number, special)
   */
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return undefined;
  };

  /**
   * Validate password match
   */
  const validateConfirmPassword = (confirm: string, password: string): string | undefined => {
    if (!confirm) {
      return 'Please confirm your password';
    }
    if (confirm !== password) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  /**
   * Validate referral code (optional, but if provided must be valid format)
   */
  const validateReferralCode = (code: string): string | undefined => {
    if (!code) {
      return undefined; // Optional field
    }
    if (code.length < 3 || code.length > 20) {
      return 'Referral code must be between 3 and 20 characters';
    }
    return undefined;
  };

  /**
   * Validate role selection
   */
  const validateRole = (role: string): string | undefined => {
    if (!role) {
      return 'Please select a user role';
    }
    const validRoles = ['merchant', 'viewer', 'accountant', 'support'];
    if (!validRoles.includes(role)) {
      return 'Invalid role selected';
    }
    return undefined;
  };

  /**
   * Validate terms acceptance
   */
  const validateTerms = (accepted: boolean): string | undefined => {
    if (!accepted) {
      return 'You must accept the terms and conditions';
    }
    return undefined;
  };

  /**
   * Validate privacy acceptance
   */
  const validatePrivacy = (accepted: boolean): string | undefined => {
    if (!accepted) {
      return 'You must accept the privacy policy';
    }
    return undefined;
  };

  /**
   * Validate entire form
   */
  const validateForm = (): boolean => {
    const newErrors: SignUpErrors = {};

    newErrors.phone = validatePhone(formData.phone);
    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.email = validateEmail(formData.email);
    newErrors.businessName = validateBusinessName(formData.businessName);
    newErrors.businessType = validateBusinessType(formData.businessType);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    newErrors.referralCode = validateReferralCode(formData.referralCode);
    newErrors.role = validateRole(formData.role);
    newErrors.acceptedTerms = validateTerms(formData.acceptedTerms);
    newErrors.acceptedPrivacy = validatePrivacy(formData.acceptedPrivacy);

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== undefined)
    );

    setErrors(filteredErrors as SignUpErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (callback?: (data: SignUpFormData) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      if (callback) {
        await callback(formData);
      }
    } catch (error) {
      console.error('SignUp error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      phone: '',
      countryCode: '+91',
      fullName: '',
      email: '',
      businessName: '',
      businessType: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
      role: '',
      acceptedTerms: false,
      acceptedPrivacy: false,
      newsletterOptIn: false,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
};
