/**
 * SignUpForm Component
 * Main form with all 12 fields for user registration
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpFormData, useSignUpForm } from '../../../hooks/useSignUpForm';
import PhoneInput from '../../Auth/Login/components/PhoneInput';
import PasswordInput from '../../Auth/Login/components/PasswordInput';
import CheckboxField from './components/CheckboxField';
import TextInput from './components/TextInput';
import SelectDropdown from './components/SelectDropdown';
import FormButton from '../../Auth/Login/components/FormButton';
import styles from './components/SignUpFormElements.module.css';
import formStyles from './SignUpForm.module.css';

interface SignUpFormProps {
  onSubmitSuccess?: (data: SignUpFormData) => void;
  isLoading?: boolean;
}

const BUSINESS_TYPE_OPTIONS = [
  { value: 'electronics', label: 'Electronics', description: 'Electronic goods retail' },
  { value: 'retail', label: 'Retail', description: 'General retail business' },
  { value: 'services', label: 'Services', description: 'Service provider' },
  { value: 'food', label: 'Food & Beverage', description: 'Food/restaurant business' },
  { value: 'fashion', label: 'Fashion', description: 'Fashion & apparel retail' },
  { value: 'other', label: 'Other', description: 'Other business type' },
];

const ROLE_OPTIONS = [
  { value: 'merchant', label: 'Merchant', description: 'Business owner' },
  { value: 'viewer', label: 'Viewer', description: 'View-only access' },
  { value: 'accountant', label: 'Accountant', description: 'Financial management' },
  { value: 'support', label: 'Support', description: 'Customer support staff' },
];

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmitSuccess, isLoading = false }) => {
  const navigate = useNavigate();
  const { formData, errors, isSubmitting, handleFieldChange, handleSubmit } = useSignUpForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(async (data) => {
      // Mock API call - replace with actual API
      console.log('SignUp data:', data);
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
    });
  };

  return (
    <form className={formStyles.signUpForm} onSubmit={handleFormSubmit}>
      <div className={formStyles.formContent}>
        {/* Phone Input */}
        <div className={styles.formGroup}>
          <PhoneInput
            value={formData.phone}
            onChange={(phone: string) => handleFieldChange('phone', phone)}
            countryCode={formData.countryCode}
            onCountryChange={(code: string) => handleFieldChange('countryCode', code)}
            error={errors.phone}
          />
        </div>

        {/* Full Name */}
        <div className={styles.formGroup}>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('fullName', e.target.value)}
            error={errors.fullName}
            helperText="3-50 characters, letters only"
            required
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <TextInput
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)}
            error={errors.email}
            helperText="We'll send confirmation to this address"
            required
          />
        </div>

        {/* Business Name */}
        <div className={styles.formGroup}>
          <TextInput
            label="Business Name"
            placeholder="Your Business Name"
            value={formData.businessName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('businessName', e.target.value)}
            error={errors.businessName}
            helperText="3-100 characters"
            required
          />
        </div>

        {/* Business Type */}
        <div className={styles.formGroup}>
          <SelectDropdown
            label="Business Type"
            options={BUSINESS_TYPE_OPTIONS}
            value={formData.businessType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('businessType', e.target.value)}
            error={errors.businessType}
            placeholder="Select your business type"
            required
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <PasswordInput
            value={formData.password}
            onChange={(password: string) => handleFieldChange('password', password)}
            error={errors.password}
          />
        </div>

        {/* Confirm Password */}
        <div className={styles.formGroup}>
          <TextInput
            label="Confirm Password"
            placeholder="Re-enter password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />
        </div>

        {/* Referral Code */}
        <div className={styles.formGroup}>
          <TextInput
            label="Referral Code"
            placeholder="Enter referral code (optional)"
            value={formData.referralCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('referralCode', e.target.value)}
            error={errors.referralCode}
            helperText="Optional - Get rewards if you have a referral code"
          />
        </div>

        {/* User Role */}
        <div className={styles.formGroup}>
          <SelectDropdown
            label="Your Role"
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('role', e.target.value)}
            error={errors.role}
            placeholder="Select your role"
            required
          />
        </div>

        {/* Checkboxes */}
        <div className={formStyles.checkboxGroup}>
          <CheckboxField
            label="I accept the Terms and Conditions"
            checked={formData.acceptedTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('acceptedTerms', e.target.checked)}
            error={errors.acceptedTerms}
            required
          />

          <CheckboxField
            label="I accept the Privacy Policy"
            checked={formData.acceptedPrivacy}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('acceptedPrivacy', e.target.checked)}
            error={errors.acceptedPrivacy}
            required
          />

          <CheckboxField
            label="Subscribe to newsletter for offers and updates"
            checked={formData.newsletterOptIn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('newsletterOptIn', e.target.checked)}
          />
        </div>

        {/* Submit Button */}
        <div className={formStyles.buttonContainer}>
          <FormButton
            type="submit"
            disabled={isSubmitting || isLoading}
            variant="primary"
          >
            {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
          </FormButton>
        </div>

        {/* Login Link */}
        <div className={formStyles.loginLink}>
          Already have an account?{' '}
          <button
            type="button"
            className={formStyles.loginLinkButton}
            onClick={() => navigate('/login')}
            disabled={isSubmitting || isLoading}
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
