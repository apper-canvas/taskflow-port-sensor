import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isPast, isToday, format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import StatsCards from '@/components/organisms/StatsCards';
import ProgressRing from '@/components/organisms/ProgressRing';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/organisms/TaskForm';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, projectsResult] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksResult);
      setProjects(projectsResult);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const activeTasks = tasks.filter(task => task.status === 'active').length;
    const overdueTasks = tasks.filter(task => 
      task.status === 'active' && task.dueDate && isPast(new Date(task.dueDate))
    ).length;

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      overdueTasks
    };
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getProjectById = (projectId) => {
    return projects.find(project => project.Id.toString() === projectId);
  };

  const getCompletionPercentage = () => {
    const stats = getStats();
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
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
      setTasks(prev => [savedTask, ...prev]);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => 
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
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-8">
        <StatsCards stats={{}} loading={true} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonLoader count={3} />
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadDashboardData}
        className="h-full flex items-center justify-center"
      />
    );
  }

  const stats = getStats();
  const upcomingTasks = getUpcomingTasks();
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">
            Dashboard
          </h1>
          <p className="text-surface-600 mt-1">
            Your productivity overview and upcoming tasks
          </p>
        </div>
        
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Quick Add
        </button>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Progress and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
            Overall Progress
          </h3>
          
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={completionPercentage}
              size={140}
              strokeWidth={10}
            />
          </div>
          
          <div className="text-center mt-6">
            <p className="text-surface-600">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
            <p className="text-sm text-surface-500 mt-1">
              {stats.activeTasks} active tasks remaining
            </p>
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Upcoming Tasks
            </h3>
            <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getProjectById(task.projectId)?.color || '#5B21B6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs ${
                        isToday(new Date(task.dueDate)) ? 'text-accent font-medium' : 'text-surface-500'
                      }`}>
                        {isToday(new Date(task.dueDate)) 
                          ? 'Today' 
                          : format(new Date(task.dueDate), 'MMM d')
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-600">No upcoming tasks</p>
                <p className="text-sm text-surface-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
          Recent Tasks
        </h3>
        
        <div className="space-y-4">
          {tasks.slice(0, 3).map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard
                task={task}
                project={getProjectById(task.projectId)}
                onToggleComplete={(taskId, completed) => 
                  handleTaskUpdate(taskId, { status: completed ? 'completed' : 'active' })
                }
                onEdit={handleEditTask}
                onDelete={handleTaskDelete}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

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

export default Dashboard;