"use client";

import { motion } from 'framer-motion';
import { Loader2, Check, X, AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface FormLoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
}

interface SmartButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loadingState?: FormLoadingState;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const SmartButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loadingState,
  className = '',
  icon,
  fullWidth = false,
}: SmartButtonProps) => {
  const { isLoading, isSuccess, isError } = loadingState || {};
  const isDisabled = disabled || isLoading;

  const getVariantClasses = () => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-primary text-white hover:bg-primary/90 focus:ring-primary ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
        }`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
        }`;
      case 'outline':
        return `${baseClasses} border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
        }`;
      case 'ghost':
        return `${baseClasses} text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
        }`;
      default:
        return baseClasses;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isSuccess) {
      return <Check className="h-4 w-4" />;
    }
    if (isError) {
      return <X className="h-4 w-4" />;
    }
    return icon;
  };

  const getStatusColor = () => {
    if (isSuccess) return 'bg-green-500 hover:bg-green-600';
    if (isError) return 'bg-red-500 hover:bg-red-600';
    return '';
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getStatusColor()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
        flex items-center justify-center space-x-2
      `}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      initial={false}
      animate={{
        backgroundColor: isSuccess ? '#10b981' : isError ? '#ef4444' : undefined,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center space-x-2"
        initial={false}
        animate={{
          x: isLoading ? 0 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {getStatusIcon() && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getStatusIcon()}
          </motion.div>
        )}
        <span>{children}</span>
      </motion.div>
    </motion.button>
  );
};

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  helpText?: string;
  className?: string;
}

const FormField = ({
  label,
  error,
  required = false,
  children,
  helpText,
  className = '',
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center space-x-1 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

interface SmartInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

const SmartInput = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = false,
  className = '',
  icon,
  rightIcon,
  onRightIconClick,
}: SmartInputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors duration-200
          ${icon ? 'pl-10' : ''}
          ${rightIcon ? 'pr-10' : ''}
          ${error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary focus:border-primary'
          }
          ${disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-50'
            : 'bg-white hover:border-gray-400'
          }
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${className}
        `}
      />
        {rightIcon && (
        <button
          type={"button" as const}
          onClick={onRightIconClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

interface FormLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

const FormLoadingOverlay = ({
  isVisible,
  message = 'Processando...',
  progress,
}: FormLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
    >
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        
        {progress !== undefined && (
          <div className="w-48 mx-auto">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export {
  SmartButton,
  FormField,
  SmartInput,
  FormLoadingOverlay,
  type FormLoadingState,
};
