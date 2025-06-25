import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BulkActionToolbar from "@/components/organisms/BulkActionToolbar";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import TaskCard from "@/components/molecules/TaskCard";
import ErrorState from "@/components/molecules/ErrorState";
import Button from "@/components/atoms/Button";
const TaskList = ({ 
  tasks = [], 
  projects = [],
  loading = false,
  error = null,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  onAddTask,
  onBulkUpdate,
  onBulkDelete,
  emptyStateConfig = {},
  className = ''
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
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

  const handleSelectionChange = (taskId, selected) => {
    setSelectedTasks(prev => {
      if (selected) {
        return [...prev, taskId];
      } else {
        return prev.filter(id => id !== taskId);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(task => task.Id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setBulkSelectionMode(false);
  };

  const handleBulkMarkComplete = async () => {
    if (onBulkUpdate && selectedTasks.length > 0) {
      const updates = selectedTasks.map(taskId => ({
        Id: taskId,
        status: 'completed'
      }));
      await onBulkUpdate(updates);
      setSelectedTasks([]);
    }
  };

  const handleBulkDeleteTasks = async () => {
    if (onBulkDelete && selectedTasks.length > 0) {
      await onBulkDelete(selectedTasks);
      setSelectedTasks([]);
    }
  };

  const handleBulkMoveToProject = async (projectId) => {
    if (onBulkUpdate && selectedTasks.length > 0) {
      const updates = selectedTasks.map(taskId => ({
        Id: taskId,
        project_id: parseInt(projectId, 10)
      }));
      await onBulkUpdate(updates);
      setSelectedTasks([]);
    }
  };

  const toggleBulkSelectionMode = () => {
    setBulkSelectionMode(prev => !prev);
    if (bulkSelectionMode) {
      setSelectedTasks([]);
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
      {tasks.length > 0 && (
        <div className="flex items-center justify-between bg-surface-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <Button
              variant={bulkSelectionMode ? "primary" : "outline"}
              size="sm"
              onClick={toggleBulkSelectionMode}
              className="flex items-center gap-2"
            >
              <ApperIcon name={bulkSelectionMode ? "X" : "CheckSquare"} className="w-4 h-4" />
              {bulkSelectionMode ? 'Cancel Selection' : 'Select Tasks'}
            </Button>
            
            {bulkSelectionMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                <ApperIcon name="CheckSquare" className="w-4 h-4" />
                {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
          
          {bulkSelectionMode && selectedTasks.length > 0 && (
            <div className="text-sm text-surface-600">
              {selectedTasks.length} of {tasks.length} tasks selected
            </div>
          )}
        </div>
      )}

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
              selectable={bulkSelectionMode}
              selected={selectedTasks.includes(task.Id)}
              onSelectionChange={handleSelectionChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <BulkActionToolbar
        selectedCount={selectedTasks.length}
        onMarkComplete={handleBulkMarkComplete}
        onDelete={handleBulkDeleteTasks}
        onMoveToProject={handleBulkMoveToProject}
        onClearSelection={handleClearSelection}
        projects={projects}
/>
    </div>
  );
};

export default TaskList;