/**
 * LoginInfo Component (Right Column)
 * Security badges and information panel
 */

import { FC } from 'react';
import SecurityBadges from './components/SecurityBadges';
import styles from './Login.module.css';

const LoginInfo: FC = () => {
  return (
    <div>
      <div className={styles.infoHeader}>
        <h2>One Pay</h2>
        <p>Trusted payment solution for businesses</p>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>Secure & Encrypted Transactions</span>
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>Instant Payment Processing</span>
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>Multi-channel Support</span>
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>24/7 Customer Support</span>
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>Real-time Analytics</span>
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>✓</span>
          <span>Enterprise Security</span>
        </div>
      </div>

      {/* Security Badges */}
      <SecurityBadges compact />

      {/* Footer */}
      <div className={styles.infoFooter}>
        <p className={styles.legalText}>
          By logging in, you agree to our <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginInfo;
