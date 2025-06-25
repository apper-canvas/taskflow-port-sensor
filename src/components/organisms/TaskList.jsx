import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const TaskList = ({ 
  tasks = [], 
  projects = [],
  loading = false,
  error = null,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  onAddTask,
  emptyStateConfig = {},
  className = ''
}) => {
  const getProjectById = (projectId) => {
    return projects.find(project => project.Id.toString() === projectId);
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await onTaskUpdate(taskId, { status: completed ? 'completed' : 'active' });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (loading) {
    return <SkeletonLoader count={5} className={className} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
        className={className}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyStateConfig.title || 'No tasks found'}
        description={emptyStateConfig.description || 'Create your first task to get started'}
        actionLabel={emptyStateConfig.actionLabel || 'Create Task'}
        onAction={onAddTask}
        icon={emptyStateConfig.icon || 'CheckSquare'}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
          >
            <TaskCard
              task={task}
              project={getProjectById(task.projectId)}
              onToggleComplete={handleToggleComplete}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;