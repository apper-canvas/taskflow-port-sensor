import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  icon = 'Package',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="inline-block"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      
      <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-2 text-surface-600 max-w-md mx-auto">{description}</p>
      
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Button
            onClick={onAction}
            variant="primary"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;