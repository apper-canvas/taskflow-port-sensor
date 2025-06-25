import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const TaskForm = ({ 
  task = null, 
  isOpen, 
  onClose, 
  onTaskSaved 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [projectsLoading, setProjectsLoading] = useState(false);

  const isEditMode = task !== null;

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      if (isEditMode) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          projectId: task.projectId || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          projectId: '',
          priority: 'medium',
          dueDate: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, task, isEditMode]);

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      let savedTask;
      if (isEditMode) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        savedTask = await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onTaskSaved(savedTask);
      onClose();
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.name
  }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="Enter task title"
              required
              disabled={loading}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-surface-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Add task description (optional)"
                disabled={loading}
              />
            </div>

            <Select
              label="Project"
              value={formData.projectId}
              onChange={(value) => handleInputChange('projectId', value)}
              options={projectOptions}
              error={errors.projectId}
              placeholder={projectsLoading ? 'Loading projects...' : 'Select a project'}
              required
              disabled={loading || projectsLoading}
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
              options={priorityOptions}
              disabled={loading}
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              disabled={loading}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                {isEditMode ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskForm;