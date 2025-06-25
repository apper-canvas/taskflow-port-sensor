import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const hasValue = value !== undefined && value !== null && value !== '';
  const showFloatingLabel = focused || hasValue || isOpen;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocused(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-0 bg-white text-left
            ${showFloatingLabel ? 'pt-6 pb-2' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : focused || isOpen
                ? 'border-primary focus:border-primary' 
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-50 text-surface-500 cursor-not-allowed' : ''}
          `}
        >
          <span className={selectedOption ? 'text-surface-900' : 'text-surface-500'}>
            {selectedOption ? selectedOption.label : (!showFloatingLabel ? placeholder : '')}
          </span>
          <ApperIcon 
            name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" 
          />
        </button>

        {label && (
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${showFloatingLabel
                ? 'top-2 text-xs text-surface-600 font-medium'
                : 'top-1/2 transform -translate-y-1/2 text-surface-500'
              }
              ${error ? 'text-red-500' : focused || isOpen ? 'text-primary' : ''}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white border border-surface-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-surface-50 transition-colors
                    ${value === option.value ? 'bg-primary text-white' : 'text-surface-900'}
                    ${options.indexOf(option) === 0 ? 'rounded-t-lg' : ''}
                    ${options.indexOf(option) === options.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;