/**
 * OTPLogin Component
 * Handles OTP-based login flow
 */

import { FC, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from './components/PhoneInput';
import FormButton from './components/FormButton';
import OTPInput from './components/OTPInput';
import logoImage from '../../../assets/OneCode_Logo.png';
import styles from './Login.module.css';

export interface OTPLoginProps {
  onBackClick: () => void;
}

type OTPLoginStep = 'phone' | 'otp';

const OTPLogin: FC<OTPLoginProps> = ({ onBackClick }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OTPLoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
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

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to send OTP
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
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock verification - accept "123456" as valid OTP
      if (otp !== '123456') {
        setOtpError('Invalid OTP. Try: 123456');
        return;
      }

      setSuccess('OTP verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError('OTP verification failed. Please try again.');
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
        <h1 className={styles.titleRed}>WELCOME TO ONEPAY</h1>
        <p className={styles.subtitle}>
          {step === 'phone' ? 'Enter your phone number' : 'Enter the OTP sent to your phone'}
        </p>
        
        {/* Context text explaining the process */}
        <p className={styles.contextText}>
          {step === 'phone' && 'We will send a 6-digit OTP to verify your identity'}
          {step === 'otp' && 'Enter the OTP sent to your registered phone number'}
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

          {/* Resend OTP Section */}
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

      {/* Back to Password Login */}
      <div className={styles.backToLoginSection}>
        <button
          type="button"
          className={styles.backToLoginLink}
          onClick={onBackClick}
          disabled={loading}
        >
          Back to password login
        </button>
      </div>
    </div>
  );
};

export default OTPLogin;
