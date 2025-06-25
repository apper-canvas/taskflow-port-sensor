import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-purple-700 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-purple-600 focus:ring-secondary shadow-sm hover:shadow-md',
    accent: 'bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-surface-700 hover:bg-surface-100 hover:text-surface-900 focus:ring-surface-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  const motionProps = {
    whileHover: disabled || loading ? {} : { scale: 1.02 },
    whileTap: disabled || loading ? {} : { scale: 0.98 }
  };

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      {...motionProps}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  );
};

export default Button;