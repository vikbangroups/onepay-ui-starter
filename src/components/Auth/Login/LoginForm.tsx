/**
 * LoginForm Component (Left Column)
 * Main authentication form
 */

import { FC, FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLoginForm } from '../../../hooks/useLoginForm';
import PhoneInput from './components/PhoneInput';
import PasswordInput from './components/PasswordInput';
import FormButton from './components/FormButton';
import CheckboxField from './components/CheckboxField';
import OTPLogin from './OTPLogin';
import ForgotPassword from './ForgotPassword';
import logoImage from '../../../assets/OneCode_Logo.png';
import styles from './Login.module.css';

export interface LoginFormProps {
  onSignUpClick: () => void;
}

type LoginMode = 'password' | 'otp' | 'forgot';

const LoginForm: FC<LoginFormProps> = ({ onSignUpClick }) => {
  const { login: authLogin } = useAuth();
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const {
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
  } = useLoginForm();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await handleLogin();

    if (result.success) {
      // Use AuthContext to login (which will handle redirect)
      try {
        await authLogin(mobile, password);
      } catch (err) {
        console.error('Auth context login failed:', err);
        // Already redirected by AuthContext
      }
    }
  };

  const handleSwitchToOTP = () => {
    clearError();
    setLoginMode('otp');
  };

  const handleSwitchToForgot = () => {
    clearError();
    setLoginMode('forgot');
  };

  const handleBackToPassword = () => {
    clearError();
    setLoginMode('password');
  };

  useEffect(() => {
    clearError();
  }, [mobile, password]);

  return (
    <div>
      {/* PASSWORD LOGIN MODE */}
      {loginMode === 'password' && (
        <>
          {/* Logo */}
          <div className={styles.formHeader}>
            <div className={styles.logoWrapper}>
              <img src={logoImage} alt="One Pay Payment Gate Way" className={styles.logo} />
            </div>
            <h1 className={styles.titleRed}>WELCOME TO ONEPAY</h1>
            <p className={styles.subtitle}>Login to your One Pay account</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <PhoneInput
              value={mobile}
              onChange={setMobile}
              error={errors.phone}
              disabled={loading}
              label="Phone Number"
              placeholder="Enter 10-digit number"
              required
              autoFocus
            />

            <PasswordInput
              value={password}
              onChange={setPassword}
              error={errors.password}
              disabled={loading}
              label="Password"
              placeholder="Enter your password"
              required
              visible={showPassword}
              onVisibilityChange={toggleShowPassword}
            />

            <CheckboxField
              label="Remember me for 30 days"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />

            <FormButton
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!mobile || !password || loading}
              type="submit"
            >
              Login with Password
            </FormButton>
          </form>

          {/* Forgot Password */}
          <div className={styles.forgotPasswordSection}>
            <button
              type="button"
              className={styles.forgotPasswordLink}
              onClick={handleSwitchToForgot}
              disabled={loading}
            >
              Forgot your password?
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span>or</span>
          </div>

          {/* Alternative Login - OTP */}
          <FormButton
            variant="secondary"
            fullWidth
            disabled={loading}
            onClick={handleSwitchToOTP}
          >
            <span>📱</span>
            <span>Login with OTP</span>
          </FormButton>

          {/* Sign Up */}
          <div className={styles.signUpSection}>
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className={styles.signUpLink}
                onClick={onSignUpClick}
                disabled={loading}
              >
                Create Account
              </button>
            </p>
          </div>
        </>
      )}

      {/* OTP LOGIN MODE */}
      {loginMode === 'otp' && (
        <OTPLogin onBackClick={handleBackToPassword} />
      )}

      {/* FORGOT PASSWORD MODE */}
      {loginMode === 'forgot' && (
        <ForgotPassword onBackClick={handleBackToPassword} />
      )}
    </div>
  );
};

export default LoginForm;
