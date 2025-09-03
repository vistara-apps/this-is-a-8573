import React from 'react';
import { Loader2 } from 'lucide-react';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-70',
    secondary: 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-70',
    outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5 disabled:opacity-70',
    ghost: 'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white disabled:opacity-70',
    destructive: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-70',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClasses}
    ${disabled || loading ? 'cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
}

export default Button;

