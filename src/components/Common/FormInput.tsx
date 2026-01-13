import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  register: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
}

/**
 * Reusable form input component with validation
 * Integrates with react-hook-form for state management
 * Displays error messages and accessibility attributes
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  type = 'text',
  register,
  error,
  required,
  disabled,
  autoComplete,
  min,
  max,
}) => {
  const inputId = register.name;

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="form-required" aria-label="required">*</span>}
      </label>

      <input
        {...register}
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        max={max}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormInput;
