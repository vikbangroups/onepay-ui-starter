/**
 * Login Page Component
 * Main entry point for login page
 */

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTelegramPlane } from 'react-icons/fa';
import LoginForm from './LoginForm';
import LoginInfo from './LoginInfo';
import Footer from '../Footer';
import logoImage from '../../../assets/OneCode_Logo.png';
import styles from './Login.module.css';

export interface LoginProps {
  /**
   * Show login info panel on mobile
   * @default false - Only show form on mobile (single column)
   * @true - Show both form and info on mobile (stacked)
   */
  showMobileInfo?: boolean;
}

const Login: FC<LoginProps> = ({ showMobileInfo = false }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.loginPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <img src={logoImage} alt="OnePay" className={styles.headerLogo} />
            <h1 className={styles.appName}>OnePay</h1>
          </div>
          
          {/* Contact Info - Center */}
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.phoneIcon}>☎️</span>
              <span>040-40991234</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.mailIcon} style={{color: '#10b981', fontSize: '16px'}}>✉️</span>
              <span>info@vikban.com</span>
            </div>
          </div>

          {/* Social Icons & Tagline - Right */}
          <div className={styles.headerRight}>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com/onepay" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.facebook}`} title="Facebook">
                <FaFacebook size={14} />
              </a>
              <a href="https://twitter.com/onepay" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.twitter}`} title="Twitter">
                <FaTwitter size={14} />
              </a>
              <a href="https://instagram.com/onepay" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.instagram}`} title="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="https://youtube.com/@onepay" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.youtube}`} title="YouTube">
                <FaYoutube size={14} />
              </a>
              <a href="https://t.me/onepay" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.telegram}`} title="Telegram">
                <FaTelegramPlane size={14} />
              </a>
            </div>
            <p className={styles.headerTagline}>Secure Payment Gateway for Businesses</p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column - Login Form */}
        <div className={styles.loginForm}>
          <LoginForm onSignUpClick={handleSignUp} />
        </div>

        {/* Right Column - Login Info */}
        <div className={`${styles.loginInfo} ${showMobileInfo ? styles.showMobileInfo : styles.hideMobileInfo}`}>
          <LoginInfo />
        </div>
      </div>
      <div className={styles.footerContainer}>
        <Footer minimal={true} />
      </div>
    </div>
  );
};

export default Login;
