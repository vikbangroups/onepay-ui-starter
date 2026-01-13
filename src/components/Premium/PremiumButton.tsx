import React from 'react';
import '../Premium/PremiumButton.css';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      className={`premium-btn premium-btn--${variant} premium-btn--${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading && <span className="premium-btn-loader"></span>}
      {icon && <span className="premium-btn-icon">{icon}</span>}
      <span className="premium-btn-text">{children}</span>
    </button>
  );
};
