import React from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';

interface WhiteLabelButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

function WhiteLabelButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}: WhiteLabelButtonProps) {
  const { config } = useWhiteLabel();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `text-white hover:opacity-90 focus:ring-2`;
      case 'secondary':
        return `text-white hover:opacity-90 focus:ring-2`;
      case 'outline':
        return `border-2 bg-white hover:bg-gray-50 focus:ring-2`;
      case 'ghost':
        return `hover:bg-gray-100 focus:ring-2`;
      default:
        return `text-white hover:opacity-90 focus:ring-2`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'md': return 'px-4 py-2 text-sm';
      case 'lg': return 'px-6 py-3 text-base';
      default: return 'px-4 py-2 text-sm';
    }
  };

  const getCustomStyles = () => {
    const styles: React.CSSProperties = {};
    
    switch (variant) {
      case 'primary':
        styles.backgroundColor = config.primaryColor;
        styles.borderColor = config.primaryColor;
        break;
      case 'secondary':
        styles.backgroundColor = config.secondaryColor;
        styles.borderColor = config.secondaryColor;
        break;
      case 'outline':
        styles.borderColor = config.primaryColor;
        styles.color = config.primaryColor;
        break;
      case 'ghost':
        styles.color = config.primaryColor;
        break;
    }
    
    return styles;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      style={getCustomStyles()}
    >
      {children}
    </button>
  );
}

export default WhiteLabelButton;