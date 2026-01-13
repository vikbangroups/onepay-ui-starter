/**
 * PasswordInput Component (Login Page)
 * Specific to login form
 */

import { FC } from 'react';
import { calculatePasswordStrength } from '../../../../utils/validation';
import styles from './LoginFormElements.module.css';

export interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showStrengthIndicator?: boolean;
  showToggle?: boolean;
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  autoFocus?: boolean;
}

const PasswordInput: FC<PasswordInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  label = 'Password',
  placeholder = 'Enter password',
  required = false,
  showStrengthIndicator = false,
  showToggle = true,
  visible = false,
  onVisibilityChange,
  autoFocus = false,
}) => {
  const handleToggleVisibility = () => {
    onVisibilityChange?.(!visible);
  };

  const strength = showStrengthIndicator ? calculatePasswordStrength(value) : null;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.passwordInputOuterWrapper}>
        <div className={styles.passwordInputWrapper}>
          <input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`${styles.formInput} ${error ? styles.inputError : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `password-error` : undefined}
          />
        </div>
        {showToggle && (
          <button
            type="button"
            className={styles.passwordToggleOutside}
            onClick={handleToggleVisibility}
            disabled={disabled}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>

      {strength && (
        <div className={styles.strengthIndicator}>
          <div className={styles.strengthBar}>
            <div
              className={styles.strengthFill}
              style={{
                width: `${(strength.score / 5) * 100}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>
          <span
            className={styles.strengthLabel}
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>
      )}

      {error && (
        <span className={styles.errorMessage} id="password-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
