/**
 * Footer Component
 * Shared footer for Login and SignUp pages
 * Includes copyright, links, and company info
 */

import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  minimal?: boolean; // Show minimal footer (just copyright) for Login page
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
  const currentYear = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className={styles.footerMinimal}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © {currentYear} One Pay. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Product</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#integrations">Integrations</a>
              </li>
              <li>
                <a href="#security">Security</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Company</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#cookies">Cookie Policy</a>
              </li>
              <li>
                <a href="#compliance">Compliance</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} One Pay. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a href="#twitter" className={styles.socialLink}>
              Twitter
            </a>
            <a href="#linkedin" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href="#facebook" className={styles.socialLink}>
              Facebook
            </a>
            <a href="#instagram" className={styles.socialLink}>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
