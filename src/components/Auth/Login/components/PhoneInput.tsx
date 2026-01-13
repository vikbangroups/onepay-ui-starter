/**
 * PhoneInput Component (Login Page)
 * Specific to login form
 */

import React, { FC, useState } from 'react';
import { formatPhoneInput } from '../../../../utils/formatting';
import { COUNTRIES, DEFAULT_COUNTRY, CountryConfig, getCountryList } from '../../../../utils/countryConfig';
import styles from './LoginFormElements.module.css';

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryChange?: (countryCode: string) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode: initialCountry = DEFAULT_COUNTRY,
  onCountryChange,
  error,
  disabled = false,
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  required = false,
  autoFocus = false,
}) => {
  const [country, setCountry] = useState<CountryConfig>(COUNTRIES[initialCountry] || COUNTRIES[DEFAULT_COUNTRY]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const handleCountrySelect = (selectedCountry: CountryConfig) => {
    setCountry(selectedCountry);
    setShowCountryDropdown(false);
    onCountryChange?.(selectedCountry.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    onChange(formatted);
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.phoneInputWrapper}>
        {/* Country Dropdown */}
        <div className={styles.countryDropdown}>
          <button
            type="button"
            className={styles.countryButton}
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            disabled={disabled}
            aria-label={`Select country: ${country.name}`}
            title={`${country.name} ${country.dialCode}`}
          >
            <span className={styles.countryFlag}>{country.flag}</span>
            <span className={styles.countryCode}>{country.dialCode}</span>
          </button>
          {showCountryDropdown && !disabled && (
            <div className={styles.countryList}>
              {getCountryList().map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`${styles.countryOption} ${c.code === country.code ? styles.countryOptionActive : ''}`}
                  onClick={() => handleCountrySelect(c)}
                >
                  <span className={styles.countryFlag}>{c.flag}</span>
                  <span className={styles.countryOptionCode}>{c.dialCode}</span>
                  <span className={styles.countryOptionName}>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Input */}
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={country.phoneLength}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`${styles.formInput} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `phone-error` : undefined}
        />
      </div>
      {error && (
        <span className={styles.errorMessage} id="phone-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default PhoneInput;
