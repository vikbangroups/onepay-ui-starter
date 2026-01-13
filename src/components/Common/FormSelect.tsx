import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  options: Option[];
  register: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Reusable form select component with validation
 * Integrates with react-hook-form for state management
 * Displays error messages and accessibility attributes
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  register,
  error,
  required,
  disabled,
  placeholder = 'Select an option',
}) => {
  const selectId = register.name;

  return (
    <div className="form-group">
      <label htmlFor={selectId} className="form-label">
        {label}
        {required && <span className="form-required" aria-label="required">*</span>}
      </label>

      <select
        {...register}
        id={selectId}
        disabled={disabled}
        className={`form-input form-select ${error ? 'form-input--error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span id={`${selectId}-error`} className="form-error" role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormSelect;
