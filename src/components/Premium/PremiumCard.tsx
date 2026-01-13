import React from 'react';
import '../Premium/PremiumCard.css';

interface PremiumCardProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
}) => {
  return (
    <div className={`premium-card premium-card--${variant} ${hover ? 'premium-card--hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface PremiumCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const PremiumCardHeader: React.FC<PremiumCardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`premium-card-header ${className}`}>
      <div className="premium-card-header-content">
        {icon && <div className="premium-card-header-icon">{icon}</div>}
        <div className="premium-card-header-text">
          <h3 className="premium-card-header-title">{title}</h3>
          {subtitle && <p className="premium-card-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="premium-card-header-action">{action}</div>}
    </div>
  );
};

interface PremiumCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumCardBody: React.FC<PremiumCardBodyProps> = ({
  children,
  className = '',
}) => {
  return <div className={`premium-card-body ${className}`}>{children}</div>;
};

interface PremiumCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumCardFooter: React.FC<PremiumCardFooterProps> = ({
  children,
  className = '',
}) => {
  return <div className={`premium-card-footer ${className}`}>{children}</div>;
};
