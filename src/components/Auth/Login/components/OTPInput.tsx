/**
 * OTPInput Component
 * 6-digit OTP input field
 */

import React, { FC } from 'react';
import styles from './LoginFormElements.module.css';

export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}

const OTPInput: FC<OTPInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  label = 'OTP',
  placeholder = '000000',
  required = false,
  autoFocus = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and max 6 characters
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow number keys
    if (!/[\d]/.test(e.key) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={6}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <span id={`${label}-error`} className={styles.errorText}>
          {error}
        </span>
      )}
      {!error && (
        <span className={styles.helperText}>
          Enter 6-digit OTP sent to your phone
        </span>
      )}
    </div>
  );
};

export default OTPInput;
