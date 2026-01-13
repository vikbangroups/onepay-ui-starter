/**
 * LoginContainer Component
 * Two-column layout wrapper for login page
 */

import React, { FC, ReactNode } from 'react';
import styles from './Login.module.css';

export interface LoginContainerProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

const LoginContainer: FC<LoginContainerProps> = ({ leftColumn, rightColumn }) => {
  return (
    <div className={styles.loginContainer}>
      {leftColumn}
      {rightColumn}
    </div>
  );
};

export default LoginContainer;
