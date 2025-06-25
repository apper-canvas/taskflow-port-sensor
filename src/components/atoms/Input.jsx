import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const showFloatingLabel = focused || hasValue;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-0 bg-white
            ${icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : focused 
                ? 'border-primary focus:border-primary' 
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-50 text-surface-500 cursor-not-allowed' : ''}
            ${showFloatingLabel ? 'pt-6 pb-2' : ''}
          `}
          placeholder={showFloatingLabel ? '' : placeholder}
          {...props}
        />

        {label && (
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${icon ? 'left-12' : 'left-4'}
              ${showFloatingLabel
                ? 'top-2 text-xs text-surface-600 font-medium'
                : 'top-1/2 transform -translate-y-1/2 text-surface-500'
              }
              ${error ? 'text-red-500' : focused ? 'text-primary' : ''}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
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

export default Input;