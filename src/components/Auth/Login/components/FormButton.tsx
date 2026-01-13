/**
 * FormButton Component (Login Page)
 * Specific to login form
 */

import React, { FC, ButtonHTMLAttributes } from 'react';
import styles from './LoginFormElements.module.css';

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const FormButton: FC<FormButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const variantClass = styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`] || styles.buttonPrimary;
  const sizeClass = styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`] || styles.buttonMd;
  
  const buttonClass = [
    styles.button,
    variantClass,
    sizeClass,
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={buttonClass}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default FormButton;
