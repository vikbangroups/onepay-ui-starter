/**
 * SelectDropdown Component (SignUp Page)
 * Generic select dropdown for role, business type, etc.
 */

import React, { FC, SelectHTMLAttributes } from 'react';
import styles from './SignUpFormElements.module.css';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const SelectDropdown: FC<SelectDropdownProps> = ({
  label,
  options,
  error,
  required = false,
  placeholder = 'Select an option',
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
      <select
        className={`${styles.formInput} ${styles.selectInput} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className={styles.errorMessage} id={`${label}-error`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectDropdown;
