import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/organisms/TaskForm';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { projectService } from '@/services/api/projectService';
import { taskService } from '@/services/api/taskService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectTasks(selectedProject.Id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getAll();
      setProjects(result);
      
      // Select first project by default if available
      if (result.length > 0 && !selectedProject) {
        setSelectedProject(result[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (projectId) => {
    setTasksLoading(true);
    try {
      const result = await taskService.getByProject(projectId.toString());
      setProjectTasks(result);
    } catch (err) {
      toast.error('Failed to load project tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSaved = (savedTask) => {
    if (editingTask) {
      setProjectTasks(prev => 
        prev.map(task => task.Id === savedTask.Id ? savedTask : task)
      );
    } else {
      // Only add if it belongs to the selected project
      if (savedTask.projectId === selectedProject?.Id.toString()) {
        setProjectTasks(prev => [savedTask, ...prev]);
      }
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setProjectTasks(prev => 
        prev.map(task => task.Id === taskId ? updatedTask : task)
      );
      
      if (updates.status === 'completed') {
        toast.success('Task completed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        setProjectTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getProgressPercentage = (project) => {
    if (project.taskCount === 0) return 0;
    return Math.round((project.completedCount / project.taskCount) * 100);
  };

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-80 border-r border-surface-200 p-6">
          <SkeletonLoader count={4} />
        </div>
        <div className="flex-1 p-6">
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadProjects}
        className="h-full flex items-center justify-center"
      />
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Create your first project to organize your tasks"
        actionLabel="Create Project"
        onAction={() => {/* TODO: Implement project creation */}}
        icon="Folder"
        className="h-full flex items-center justify-center"
      />
    );
  }

  return (
    <div className="h-full flex">
      {/* Projects Sidebar */}
      <div className="w-80 border-r border-surface-200 bg-surface-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-surface-900">Projects</h2>
            {/* TODO: Add create project button */}
          </div>

          <div className="space-y-3">
            {projects.map((project, index) => (
              <motion.button
                key={project.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProjectSelect(project)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  selectedProject?.Id === project.Id
                    ? 'bg-white shadow-sm border border-primary/20'
                    : 'bg-white/50 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-surface-900 truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-surface-600">
                        {project.completedCount}/{project.taskCount} tasks
                      </span>
                      <div className="flex-1 bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(project)}%` }}
                        />
                      </div>
                      <span className="text-xs text-surface-500">
                        {getProgressPercentage(project)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Tasks */}
      <div className="flex-1 flex flex-col">
        {selectedProject && (
          <>
            {/* Project Header */}
            <div className="bg-white border-b border-surface-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedProject.color }}
                  >
                    <ApperIcon name="Folder" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-heading font-semibold text-surface-900">
                      {selectedProject.name}
                    </h1>
                    <p className="text-sm text-surface-600">
                      {selectedProject.completedCount} of {selectedProject.taskCount} tasks completed
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  icon="Plus"
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              </div>
            </div>

            {/* Project Tasks List */}
            <div className="flex-1 overflow-y-auto p-6">
              <TaskList
                tasks={projectTasks}
                projects={projects}
                loading={tasksLoading}
                error={null}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleEditTask}
                onAddTask={handleAddTask}
                emptyStateConfig={{
                  title: 'No tasks in this project',
                  description: 'Add your first task to get started with this project',
                  actionLabel: 'Add Task',
                  icon: 'Plus'
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};

export default Projects;