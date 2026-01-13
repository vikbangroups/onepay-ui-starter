/**
 * TextInput Component (SignUp Page)
 * Generic text input for various field types
 */

import React, { FC, InputHTMLAttributes } from 'react';
import styles from './SignUpFormElements.module.css';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const TextInput: FC<TextInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type="text"
        className={`${styles.formInput} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
        {...props}
      />
      {error && (
        <span className={styles.errorMessage} id={`${label}-error`}>
          {error}
        </span>
      )}
      {helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default TextInput;
