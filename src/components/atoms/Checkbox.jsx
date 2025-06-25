import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`
            ${sizes[size]} border-2 rounded-md transition-all duration-200
            ${checked 
              ? 'bg-primary border-primary' 
              : 'bg-white border-surface-300 hover:border-surface-400'
            }
            ${disabled ? '' : 'hover:shadow-sm'}
          `}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center h-full"
          >
            <ApperIcon name="Check" className={`${iconSizes[size]} text-white`} />
          </motion.div>
        </motion.div>
      </div>
      
      {label && (
        <span className="ml-3 text-sm text-surface-900 select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;