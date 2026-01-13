/**
 * Signup Page
 * Main SignUp page component with two-column layout
 */

import React from 'react';
import { SignUpFormData } from '../../hooks/useSignUpForm';
import SignUpContainer from './SignUpContainer';
import Footer from '../Footer';
import logoImage from '../../../assets/OneCode_Logo.png';
import styles from './Signup.module.css';

interface SignupPageProps {
  onSubmitSuccess?: (data: SignUpFormData) => void;
}

const Signup: React.FC<SignupPageProps> = ({ onSubmitSuccess }) => {
  const handleSubmitSuccess = (data: SignUpFormData) => {
    console.log('SignUp successful:', data);
    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    }
    // In production, redirect to dashboard or confirmation page
  };

  return (
    <div className={styles.signupPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <img src={logoImage} alt="OnePay" className={styles.headerLogo} />
            <h1 className={styles.appName}>OnePay</h1>
          </div>
          <p className={styles.headerTagline}>Secure Payment Gateway for Businesses</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <SignUpContainer onSubmitSuccess={handleSubmitSuccess} />
      </div>
      <div className={styles.footerContainer}>
        <Footer minimal={true} />
      </div>
    </div>
  );
};

export default Signup;
