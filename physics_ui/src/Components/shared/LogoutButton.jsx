import React from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';

const LogoutButton = ({ 
  variant = 'default', 
  size = 'default',
  showIcon = true,
  showText = true,
  redirectTo = '/login',
  showConfirmation = true,
  className = '',
  onSuccess,
  onError,
  ...props 
}) => {
  const { handleLogout, isLoggingOut } = useLogout();

  const handleClick = () => {
    handleLogout({
      redirectTo,
      showConfirmation,
      onSuccess,
      onError,
    });
  };

  // Style variants
  const variants = {
    default: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50',
    ghost: 'text-red-600 hover:bg-red-50',
    minimal: 'text-slate-600 hover:text-red-600',
  };

  // Size variants
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    rounded-lg font-medium transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500/20
  `;

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={isLoggingOut}
      className={buttonClasses}
      {...props}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span>Déconnexion...</span>}
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-4 h-4" />}
          {showText && <span>Se déconnecter</span>}
        </>
      )}
    </button>
  );
};

// Dropdown menu item variant
export const LogoutMenuItem = ({ 
  className = '',
  onSuccess,
  onError,
  ...props 
}) => {
  const { handleLogout, isLoggingOut } = useLogout();

  const handleClick = () => {
    handleLogout({
      showConfirmation: true,
      onSuccess,
      onError,
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoggingOut}
      className={`
        w-full flex items-center gap-3 px-4 py-2 text-left text-sm
        text-red-600 hover:bg-red-50 transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Déconnexion...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;