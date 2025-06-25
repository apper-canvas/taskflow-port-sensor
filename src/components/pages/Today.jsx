import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/organisms/TaskForm';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTodayTasks();
    loadProjects();
  }, []);

  const loadTodayTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getToday();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s tasks');
      toast.error('Failed to load today\'s tasks');
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
      setTasks(prev => 
        prev.map(task => task.Id === savedTask.Id ? savedTask : task)
      );
    } else {
      // Only add to today's list if it's due today
      const today = new Date().toISOString().split('T')[0];
      const taskDueDate = savedTask.dueDate ? savedTask.dueDate.split('T')[0] : null;
      
      if (taskDueDate === today) {
        setTasks(prev => [savedTask, ...prev]);
      }
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => 
        prev.map(task => task.Id === taskId ? updatedTask : task)
      );
      
      if (updates.status === 'completed') {
        toast.success('Great job! Task completed! 🎉');
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
        onAddTask={handleAddTask}
        onToggleView={() => {}}
        currentView="list"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-surface-900 mb-2">
            Today's Focus
          </h2>
          <p className="text-surface-600">
            Tasks due today - stay focused and get things done!
          </p>
        </div>

        <TaskList
          tasks={tasks}
          projects={projects}
          loading={loading}
          error={error}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskEdit={handleEditTask}
          onAddTask={handleAddTask}
          emptyStateConfig={{
            title: 'No tasks due today',
            description: 'Looks like you\'re all caught up! Take a moment to plan ahead or enjoy your free time.',
            actionLabel: 'Add Task for Today',
            icon: 'Sun'
          }}
        />
      </div>

      <TaskForm
        task={editingTask}
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};

export default Today;