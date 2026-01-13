/**
 * SignUpInfo Component
 * Right column information panel with features and trust indicators
 */

import React from 'react';
import styles from './SignUpInfo.module.css';

const SignUpInfo: React.FC = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Secure & Compliant',
      description: 'Bank-level encryption and regulatory compliance',
    },
    {
      icon: '⚡',
      title: 'Fast Settlement',
      description: 'Payments settled within 24 hours to your account',
    },
    {
      icon: '💰',
      title: 'Competitive Rates',
      description: 'Best rates in the industry with transparent pricing',
    },
    {
      icon: '📱',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your peace of mind',
    },
    {
      icon: '🌍',
      title: 'Pan-India Reach',
      description: 'Accept payments from customers across India',
    },
    {
      icon: '✅',
      title: 'Verified Merchants',
      description: 'Trusted by 10,000+ businesses nationwide',
    },
  ];

  return (
    <div className={styles.signUpInfo}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2 className={styles.title}>Why Choose One Pay</h2>
        <p className={styles.subtitle}>
          Join thousands of businesses already using One Pay for seamless payments
        </p>
      </div>

      {/* Features Grid */}
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Payment Illustration Section */}
      <div className={styles.illustrationContainer}>
        <div className={styles.illustration}>
          <div className={styles.paymentCard}>
            <div className={styles.cardChip}></div>
            <div className={styles.cardNumber}>•••• •••• •••• 4242</div>
            <div className={styles.cardHolder}>
              <span className={styles.cardName}>Your Business</span>
              <span className={styles.cardExpiry}>12/25</span>
            </div>
          </div>

          <div className={styles.paymentFlow}>
            <div className={styles.flowStep}>
              <span className={styles.stepNumber}>1</span>
              <p>Customer</p>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowStep}>
              <span className={styles.stepNumber}>2</span>
              <p>Payment</p>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowStep}>
              <span className={styles.stepNumber}>3</span>
              <p>Your Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className={styles.trustBadges}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>🛡️</span>
          <span className={styles.badgeText}>PCI DSS Level 1</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>✔️</span>
          <span className={styles.badgeText}>RBI Certified</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>🔐</span>
          <span className={styles.badgeText}>ISO 27001</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>10,000+</div>
          <div className={styles.statLabel}>Active Merchants</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>$500M+</div>
          <div className={styles.statLabel}>Transactions</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>99.9%</div>
          <div className={styles.statLabel}>Uptime</div>
        </div>
      </div>
    </div>
  );
};

export default SignUpInfo;
