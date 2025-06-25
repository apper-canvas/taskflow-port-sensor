import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { routeArray } from '@/config/routes';

const Header = ({ onAddTask, onToggleView, currentView = 'list' }) => {
  const location = useLocation();
  
  const currentRoute = routeArray.find(route => route.path === location.pathname);
  const pageTitle = currentRoute ? currentRoute.label : 'Tasks';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-surface-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ApperIcon 
            name={currentRoute?.icon || 'List'} 
            className="w-6 h-6 text-primary" 
          />
          <h1 className="text-2xl font-heading font-semibold text-surface-900">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden md:flex items-center bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => onToggleView('list')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'list' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleView('grid')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'grid' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
          </div>

          {/* Add Task Button */}
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAddTask}
            className="shadow-sm"
          >
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;