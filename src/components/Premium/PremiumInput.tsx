import React from 'react';
import '../Premium/PremiumInput.css';

interface PremiumInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  helper?: string;
  className?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon,
  helper,
  className = '',
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`premium-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="premium-input-label">
          {label}
          {required && <span className="premium-input-required">*</span>}
        </label>
      )}

      <div className={`premium-input-container ${error ? 'premium-input-container--error' : ''} ${disabled ? 'premium-input-container--disabled' : ''}`}>
        {icon && <span className="premium-input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className="premium-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        />
      </div>

      {error && (
        <div id={`${inputId}-error`} className="premium-input-error">
          ✕ {error}
        </div>
      )}

      {helper && !error && (
        <div id={`${inputId}-helper`} className="premium-input-helper">
          {helper}
        </div>
      )}
    </div>
  );
};
