import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/organisms/TaskForm';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    project: '',
    status: ''
  });
  const [currentView, setCurrentView] = useState('list');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchTerm, filters]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
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

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply project filter
    if (filters.project) {
      filtered = filtered.filter(task => task.projectId === filters.project);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    setFilteredTasks(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      priority: '',
      project: '',
      status: ''
    });
    setSearchTerm('');
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
      // Update existing task
      setTasks(prev => 
        prev.map(task => task.Id === savedTask.Id ? savedTask : task)
      );
    } else {
      // Add new task
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

  return (
    <div className="h-full flex flex-col">
      <Header
        onAddTask={handleAddTask}
        onToggleView={setCurrentView}
        currentView={currentView}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            placeholder="Search tasks..."
            onSearch={handleSearch}
            debounceMs={300}
          />
          
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableProjects={projects}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          projects={projects}
          loading={loading}
          error={error}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskEdit={handleEditTask}
          onAddTask={handleAddTask}
          emptyStateConfig={{
            title: 'No tasks found',
            description: 'Create your first task to get started with TaskFlow',
            actionLabel: 'Create Task',
            icon: 'CheckSquare'
          }}
        />
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

export default AllTasks;