import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/tasks');
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="inline-block mb-6"
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-300" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-medium text-surface-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleGoHome}
            variant="primary"
            icon="Home"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;