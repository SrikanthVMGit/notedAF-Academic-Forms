import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  className = '',
  icon,
  ...props 
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className} ${disabled ? 'btn-disabled' : ''} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="btn-spinner" />}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      <span className={loading ? 'btn-text-loading' : ''}>{children}</span>
    </button>
  );
};

export default Button;