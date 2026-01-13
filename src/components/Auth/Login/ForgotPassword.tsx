/**
 * ForgotPassword Component
 * Handles forgot password recovery flow
 */

import { FC, FormEvent, useState, useEffect } from 'react';
import PhoneInput from './components/PhoneInput';
import FormButton from './components/FormButton';
import OTPInput from './components/OTPInput';
import PasswordInput from './components/PasswordInput';
import logoImage from '../../../assets/OneCode_Logo.png';
import styles from './Login.module.css';

export interface ForgotPasswordProps {
  onBackClick: () => void;
}

type ForgotPasswordStep = 'phone' | 'otp' | 'reset';

const ForgotPassword: FC<ForgotPasswordProps> = ({ onBackClick }) => {
  const [step, setStep] = useState<ForgotPasswordStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhone = (phoneNumber: string): boolean => {
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (phoneNumber.replace(/\D/g, '').length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateOTP = (otpValue: string): boolean => {
    if (!otpValue) {
      setOtpError('OTP is required');
      return false;
    }
    if (otpValue.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return false;
    }
    setOtpError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirm: string): boolean => {
    if (!confirm) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirm !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(phone)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`OTP sent to ${phone}. Use: 123456`);
      setStep('otp');
      setResendTimer(30);
      setOtp('');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateOTP(otp)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (otp !== '123456') {
        setOtpError('Invalid OTP. Try: 123456');
        return;
      }

      setSuccess('OTP verified! Now set your new password.');
      setStep('reset');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;
    if (!validateConfirmPassword(confirmPassword)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        onBackClick();
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`OTP resent to ${phone}. Use: 123456`);
      setResendTimer(30);
      setOtp('');
      setOtpError('');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setStep('phone');
    setOtp('');
    setOtpError('');
    setSuccess('');
  };

  return (
    <div>
      {/* Logo */}
      <div className={styles.formHeader}>
        <div className={styles.logoWrapper}>
          <img src={logoImage} alt="One Pay Payment Gate Way" className={styles.logo} />
        </div>
        <h1 className={styles.titleRed}>RESET PASSWORD</h1>
        <p className={styles.subtitle}>
          {step === 'phone' && 'Enter your registered phone number'}
          {step === 'otp' && 'Verify with OTP sent to your phone'}
          {step === 'reset' && 'Set your new password'}
        </p>
        
        {/* Context text explaining the process */}
        <p className={styles.contextText}>
          {step === 'phone' && 'We will send a 6-digit OTP to verify your identity'}
          {step === 'otp' && 'Enter the OTP sent to your registered phone number'}
          {step === 'reset' && 'Create a strong password with uppercase, lowercase, number & special character'}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <span className={styles.alertIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          <span className={styles.alertIcon}>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* STEP 1: Phone Input */}
      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className={styles.form}>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            error={phoneError}
            disabled={loading}
            label="Phone Number"
            placeholder="Enter 10-digit number"
            required
            autoFocus
          />

          <FormButton
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!phone || loading}
            type="submit"
          >
            Send OTP
          </FormButton>
        </form>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className={styles.form}>
          <OTPInput
            value={otp}
            onChange={setOtp}
            error={otpError}
            disabled={loading}
            label="Enter OTP"
            placeholder="000000"
            required
            autoFocus
          />

          <FormButton
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!otp || loading}
            type="submit"
          >
            Verify OTP
          </FormButton>

          {/* Resend OTP */}
          <div className={styles.resendOtpSection}>
            <p className={styles.resendText}>Didn't receive OTP?</p>
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || loading}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>

          {/* Change Phone */}
          <div className={styles.changePhoneSection}>
            <button
              type="button"
              className={styles.changePhoneLink}
              onClick={handleChangePhone}
              disabled={loading}
            >
              Change phone number
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className={styles.form}>
          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            error={passwordError}
            disabled={loading}
            label="New Password"
            placeholder="Enter new password"
            required
            visible={showNewPassword}
            onVisibilityChange={() => setShowNewPassword(!showNewPassword)}
            autoFocus={true}
          />

          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={confirmPasswordError}
            disabled={loading}
            label="Confirm Password"
            placeholder="Re-enter password"
            required
            visible={showConfirmPassword}
            onVisibilityChange={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <div className={styles.passwordRequirements}>
            <p className={styles.requirementsTitle}>Password must contain:</p>
            <ul className={styles.requirementsList}>
              <li className={newPassword.length >= 8 ? styles.requirementMet : ''}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(newPassword) ? styles.requirementMet : ''}>
                Uppercase letter (A-Z)
              </li>
              <li className={/[a-z]/.test(newPassword) ? styles.requirementMet : ''}>
                Lowercase letter (a-z)
              </li>
              <li className={/[0-9]/.test(newPassword) ? styles.requirementMet : ''}>
                Number (0-9)
              </li>
            </ul>
          </div>

          <FormButton
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!newPassword || !confirmPassword || loading}
            type="submit"
          >
            Reset Password
          </FormButton>
        </form>
      )}

      {/* Back to Login */}
      <div className={styles.backToLoginSection}>
        <button
          type="button"
          className={styles.backToLoginLink}
          onClick={onBackClick}
          disabled={loading}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
