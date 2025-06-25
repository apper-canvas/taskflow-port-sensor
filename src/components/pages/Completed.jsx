import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const Completed = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletedTasks();
    loadProjects();
  }, []);

  const loadCompletedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getByStatus('completed');
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks');
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      
      if (updates.status === 'active') {
        // Remove from completed list if marked as active
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success('Task reactivated');
      } else {
        // Update in place
        setTasks(prev => 
          prev.map(task => task.Id === taskId ? updatedTask : task)
        );
      }
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this completed task?')) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Header
        onAddTask={() => {}}
        onToggleView={() => {}}
        currentView="list"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-surface-900 mb-2">
            Completed Tasks
          </h2>
          <p className="text-surface-600">
            Great job! Here are all your completed tasks. You can reactivate them if needed.
          </p>
        </div>

        <TaskList
          tasks={tasks}
          projects={projects}
          loading={loading}
          error={error}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskEdit={() => {}} // Disable editing for completed tasks
          onAddTask={() => {}}
          emptyStateConfig={{
            title: 'No completed tasks yet',
            description: 'Complete some tasks to see them here. Keep up the great work!',
            actionLabel: 'View All Tasks',
            icon: 'CheckCircle'
          }}
        />
      </div>
    </div>
  );
};

export default Completed;