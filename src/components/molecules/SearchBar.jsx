import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search tasks...', 
  onSearch, 
  debounceMs = 300,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.div
      className={`relative ${className}`}
      whileFocus={{ scale: 1.02 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" 
        />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 border-2 rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-0 bg-white
            ${focused 
              ? 'border-primary focus:border-primary' 
              : 'border-surface-300 hover:border-surface-400'
            }
          `}
        />

        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;