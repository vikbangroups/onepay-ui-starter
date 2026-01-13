/**
 * SecurityBadges Component (Login Page)
 * Trust indicators for login page
 */

import React, { FC } from 'react';
import styles from './SecurityBadges.module.css';

interface BadgeItem {
  icon: string;
  title: string;
  description: string;
}

const SECURITY_BADGES: BadgeItem[] = [
  {
    icon: '🔒',
    title: 'Bank-Level Security',
    description: '256-bit SSL encryption',
  },
  {
    icon: '⚡',
    title: 'Instant Verification',
    description: '< 1 second processing',
  },
  {
    icon: '🛡️',
    title: 'Two-Factor Auth',
    description: 'OTP-based verification',
  },
  {
    icon: '🌐',
    title: 'Global Support',
    description: '24/7 customer service',
  },
];

const TRUST_INDICATORS = [
  { label: 'Trusted by', value: '500K+' },
  { label: 'Uptime', value: '99.99%' },
  { label: 'ISO', value: '27001' },
];

export interface SecurityBadgesProps {
  compact?: boolean;
}

const SecurityBadges: FC<SecurityBadgesProps> = ({ compact = false }) => {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {/* Main Badges */}
      <div className={styles.badgesGrid}>
        {SECURITY_BADGES.map((badge, index) => (
          <div key={index} className={styles.badge}>
            <span className={styles.badgeIcon}>{badge.icon}</span>
            <div className={styles.badgeContent}>
              <h4 className={styles.badgeTitle}>{badge.title}</h4>
              <p className={styles.badgeDescription}>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustIndicators}>
        {TRUST_INDICATORS.map((indicator, index) => (
          <div key={index} className={styles.trustItem}>
            <span className={styles.trustValue}>{indicator.value}</span>
            <span className={styles.trustLabel}>{indicator.label}</span>
          </div>
        ))}
      </div>

      {/* Compliance Info */}
      <div className={styles.compliance}>
        <p>
          <strong>Compliance:</strong> PCI DSS Level 1 • GDPR Compliant • RBI Approved
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;
