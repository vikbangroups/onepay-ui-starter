/**
 * CheckboxField Component (Login Page)
 * Specific to login form
 */

import React, { FC, InputHTMLAttributes } from 'react';
import styles from './LoginFormElements.module.css';

export interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const CheckboxField: FC<CheckboxFieldProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.checkboxGroup}>
      <label className={`${styles.checkboxLabel} ${error ? styles.error : ''}`}>
        <input
          type="checkbox"
          className={styles.checkbox}
          {...props}
        />
        <span className={styles.checkboxText}>{label}</span>
      </label>
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
      {helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default CheckboxField;
