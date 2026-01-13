/**
 * Footer Component - Enterprise Edition
 * Responsive footer matching login/signup theme
 * Mobile: Only "About OnePay" visible
 * Desktop: All sections visible
 */

import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyles.container}>
      {/* Desktop Footer - Full Layout */}
      <div style={footerStyles.desktopWrapper}>
        <div style={footerStyles.contentGrid}>
          {/* About OnePay Section */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>About OnePay</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="#about" style={footerStyles.link}>About Us</a></li>
              <li><a href="#careers" style={footerStyles.link}>Careers</a></li>
              <li><a href="#blog" style={footerStyles.link}>Blog</a></li>
              <li><a href="#press" style={footerStyles.link}>Press Kit</a></li>
            </ul>
          </div>

          {/* Products Section */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Products</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="#pay-in" style={footerStyles.link}>Pay-In Solutions</a></li>
              <li><a href="#pay-out" style={footerStyles.link}>Pay-Out Solutions</a></li>
              <li><a href="#wallet" style={footerStyles.link}>Wallet Services</a></li>
              <li><a href="#api" style={footerStyles.link}>API Documentation</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Support</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="#help" style={footerStyles.link}>Help Center</a></li>
              <li><a href="#contact" style={footerStyles.link}>Contact Us</a></li>
              <li><a href="#status" style={footerStyles.link}>System Status</a></li>
              <li><a href="#faq" style={footerStyles.link}>FAQ</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Legal</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="#privacy" style={footerStyles.link}>Privacy Policy</a></li>
              <li><a href="#terms" style={footerStyles.link}>Terms of Service</a></li>
              <li><a href="#security" style={footerStyles.link}>Security</a></li>
              <li><a href="#compliance" style={footerStyles.link}>Compliance</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Only About OnePay */}
      <div style={footerStyles.mobileWrapper}>
        <div style={footerStyles.mobileSection}>
          <h3 style={footerStyles.mobileSectionTitle}>About OnePay</h3>
          <ul style={footerStyles.mobileLinkList}>
            <li><a href="#about" style={footerStyles.mobileLink}>About Us</a></li>
            <li><a href="#careers" style={footerStyles.mobileLink}>Careers</a></li>
            <li><a href="#blog" style={footerStyles.mobileLink}>Blog</a></li>
            <li><a href="#press" style={footerStyles.mobileLink}>Press Kit</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div style={footerStyles.divider}></div>

      {/* Copyright */}
      <div style={footerStyles.copyright}>
        <p style={footerStyles.copyrightText}>
          © {currentYear} OnePay - One Code Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const footerStyles = {
  container: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    padding: '60px 20px 30px 20px',
    marginTop: '80px',
    borderTop: '2px solid #d4af37',
  } as React.CSSProperties,

  // Desktop Styles
  desktopWrapper: {
    display: 'none' as const,
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  } as React.CSSProperties,

  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  } as React.CSSProperties,

  // Mobile Styles
  mobileWrapper: {
    display: 'block',
  } as React.CSSProperties,

  mobileSection: {
    marginBottom: '30px',
  } as React.CSSProperties,

  mobileSectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  mobileLinkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  } as React.CSSProperties,

  mobileLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  } as React.CSSProperties,

  divider: {
    height: '1px',
    backgroundColor: '#3b82f6',
    margin: '30px 0',
    opacity: 0.3,
  } as React.CSSProperties,

  copyright: {
    textAlign: 'center' as const,
    marginTop: '20px',
  } as React.CSSProperties,

  copyrightText: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: 0,
  } as React.CSSProperties,
};

// Add media queries as inline styles with a helper
const addResponsiveStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 768px) {
      footer [data-desktop-footer] {
        display: block !important;
      }
      footer [data-mobile-footer] {
        display: none !important;
      }
    }

    @media (max-width: 767px) {
      footer [data-desktop-footer] {
        display: none !important;
      }
      footer [data-mobile-footer] {
        display: block !important;
      }
    }

    footer a {
      transition: color 0.3s ease;
    }

    footer a:hover {
      color: #d4af37;
    }

    @media (min-width: 768px) {
      footer a:hover {
        transform: translateX(4px);
      }
    }
  `;
  document.head.appendChild(style);
};

// Execute responsive styles on mount
if (typeof document !== 'undefined') {
  addResponsiveStyles();
}

export default Footer;
