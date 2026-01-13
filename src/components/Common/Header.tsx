/**
 * Header Component
 * Top navigation bar for authenticated pages
 */

import React, { FC } from 'react';
import styles from './Header.module.css';

export interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
  userName?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

const Header: FC<HeaderProps> = ({
  title = 'OnePay Dashboard',
  showUserMenu = false,
  userName = 'User',
  onLogout,
  onProfileClick,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Notifications */}
          <button className={styles.iconButton} title="Notifications" aria-label="Notifications">
            🔔
          </button>

          {/* User Menu */}
          {showUserMenu && (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={onProfileClick}
                title={`Profile: ${userName}`}
              >
                👤 {userName}
              </button>
              <button
                className={styles.logoutButton}
                onClick={onLogout}
                title="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
