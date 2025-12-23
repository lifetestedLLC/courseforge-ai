import React from 'react';

  interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
  }

  export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
    ...props
  }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-s
  m font-medium transition-colors focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled
  :pointer-events-none ring-offset-background';

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
    };

    const sizeClasses = {
      small: 'h-8 px-3 text-xs',
      medium: 'h-10 px-4 py-2',
      large: 'h-12 px-6 py-3 text-base'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]
  } ${className}`;

    return (
      <button
        className={classes}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };
