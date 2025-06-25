import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  availableProjects = [],
  className = '' 
}) => {
  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value !== '' && value !== null && value !== undefined
  );

  const handlePriorityFilter = (priority) => {
    onFilterChange('priority', filters.priority === priority ? '' : priority);
  };

  const handleProjectFilter = (projectId) => {
    onFilterChange('project', filters.project === projectId ? '' : projectId);
  };

  const handleStatusFilter = (status) => {
    onFilterChange('status', filters.status === status ? '' : status);
  };

  const removeFilter = (key) => {
    onFilterChange(key, '');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Priority Filters */}
        <div className="flex gap-1">
          {['high', 'medium', 'low'].map((priority) => (
            <Button
              key={priority}
              variant={filters.priority === priority ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePriorityFilter(priority)}
              className="capitalize"
            >
              {priority}
            </Button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex gap-1">
          <Button
            variant={filters.status === 'active' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'completed' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Project Filters */}
        {availableProjects.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {availableProjects.map((project) => (
              <Button
                key={project.Id}
                variant={filters.project === project.Id.toString() ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleProjectFilter(project.Id.toString())}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </Button>
            ))}
          </div>
        )}

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon="X"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map(([key, value]) => {
              let label = value;
              if (key === 'project') {
                const project = availableProjects.find(p => p.Id.toString() === value);
                label = project ? project.name : value;
              }

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="primary" className="flex items-center gap-1">
                    <span className="capitalize">{key}: {label}</span>
                    <button
                      onClick={() => removeFilter(key)}
                      className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;