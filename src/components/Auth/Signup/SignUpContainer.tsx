/**
 * SignUpContainer Component
 * Two-column layout container for SignUp page
 * LEFT: Info panel, RIGHT: Form
 */

import React from 'react';
import { SignUpFormData } from '../../../hooks/useSignUpForm';
import SignUpForm from './SignUpForm';
import SignUpInfo from './SignUpInfo';
import styles from './SignUpContainer.module.css';

interface SignUpContainerProps {
  onSubmitSuccess?: (data: SignUpFormData) => void;
  isLoading?: boolean;
}

const SignUpContainer: React.FC<SignUpContainerProps> = ({ onSubmitSuccess, isLoading }) => {
  return (
    <div className={styles.container}>
      {/* Left Column - Info Panel */}
      <div className={styles.infoColumn}>
        <SignUpInfo />
      </div>

      {/* Right Column - Form */}
      <div className={styles.formColumn}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create Your Account</h1>
            <p className={styles.formSubtitle}>
              Join One Pay and start accepting payments in minutes
            </p>
          </div>

          <SignUpForm onSubmitSuccess={onSubmitSuccess} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default SignUpContainer;
