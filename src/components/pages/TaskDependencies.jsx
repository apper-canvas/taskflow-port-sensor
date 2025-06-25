import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { taskDependencyService } from "@/services/api/taskDependencyService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import Header from "@/components/organisms/Header";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskDependencies = () => {
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDependency, setNewDependency] = useState({
    Name: '',
    dependentTaskId: '',
    precedingTaskId: '',
    dependencyType: 'finish-to-start'
  });
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, dependenciesResult] = await Promise.all([
        taskService.getAll(),
        taskDependencyService.getAll()
      ]);
      setTasks(tasksResult);
      setDependencies(dependenciesResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load dependencies');
    } finally {
      setLoading(false);
    }
  };

const getTaskById = (taskId) => {
    if (!taskId) return null;
    
    // Handle both object and primitive ID inputs
    let searchId;
    if (typeof taskId === 'object' && taskId.Id) {
      searchId = taskId.Id.toString();
    } else {
      searchId = taskId.toString();
    }
    
    return tasks.find(task => task.Id.toString() === searchId);
  };

  const handleCreateDependency = async () => {
    if (!newDependency.dependentTaskId || !newDependency.precedingTaskId) {
      toast.error('Please select both dependent and preceding tasks');
      return;
    }

    if (newDependency.dependentTaskId === newDependency.precedingTaskId) {
      toast.error('A task cannot depend on itself');
      return;
    }

    // Check for circular dependencies
    if (wouldCreateCircularDependency(newDependency.dependentTaskId, newDependency.precedingTaskId)) {
      toast.error('This would create a circular dependency');
      return;
    }

    try {
const createdDependency = await taskDependencyService.create(newDependency);
      setDependencies(prev => [...prev, createdDependency]);
      setNewDependency({
        Name: '',
        dependentTaskId: '',
        precedingTaskId: '',
        dependencyType: 'finish-to-start'
      });
      setShowCreateForm(false);
      toast.success('Dependency created successfully');
    } catch (error) {
      toast.error('Failed to create dependency');
    }
  };

  const handleDeleteDependency = async (dependencyId) => {
    if (window.confirm('Are you sure you want to delete this dependency?')) {
      try {
        await taskDependencyService.delete(dependencyId);
        setDependencies(prev => prev.filter(dep => dep.Id !== dependencyId));
        toast.success('Dependency deleted successfully');
      } catch (error) {
        toast.error('Failed to delete dependency');
      }
    }
  };

  const wouldCreateCircularDependency = (dependentId, precedingId) => {
    // Simple circular dependency check - can be enhanced for complex scenarios
    const existingDependencies = dependencies.filter(dep => 
      dep.dependentTaskId === precedingId && dep.precedingTaskId === dependentId
    );
    return existingDependencies.length > 0;
  };

  const taskOptions = tasks.map(task => ({
    value: task.Id.toString(),
    label: task.title
  }));

  const dependencyTypeOptions = [
    { value: 'finish-to-start', label: 'Finish-to-Start' },
    { value: 'start-to-start', label: 'Start-to-Start' },
    { value: 'finish-to-finish', label: 'Finish-to-Finish' },
    { value: 'start-to-finish', label: 'Start-to-Finish' }
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <SkeletonLoader count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorState
            message={error}
            onRetry={loadData}
            className="h-full flex items-center justify-center"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-surface-900">Task Dependencies</h1>
            <p className="text-surface-600 mt-1">Manage relationships between tasks</p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowCreateForm(true)}
          >
            Add Dependency
          </Button>
        </div>

        {/* Create Dependency Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
>
            <h3 className="text-lg font-medium text-surface-900 mb-4">Create New Dependency</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={newDependency.Name}
                onChange={(e) => setNewDependency(prev => ({ ...prev, Name: e.target.value }))}
                placeholder="Enter a descriptive name for this dependency"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Dependent Task"
                value={newDependency.dependentTaskId}
                onChange={(value) => setNewDependency(prev => ({ ...prev, dependentTaskId: value }))}
                options={taskOptions}
                placeholder="Select task that depends on another"
              />
              <Select
                label="Preceding Task"
                value={newDependency.precedingTaskId}
                onChange={(value) => setNewDependency(prev => ({ ...prev, precedingTaskId: value }))}
                options={taskOptions}
                placeholder="Select task that must be completed first"
              />
              <Select
                label="Dependency Type"
                value={newDependency.dependencyType}
                onChange={(value) => setNewDependency(prev => ({ ...prev, dependencyType: value }))}
options={dependencyTypeOptions}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="primary"
                onClick={handleCreateDependency}
              >
                Create Dependency
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Dependencies List */}
        {dependencies.length === 0 ? (
          <EmptyState
            title="No dependencies found"
            description="Create task dependencies to define relationships between tasks"
            actionLabel="Add Dependency"
            onAction={() => setShowCreateForm(true)}
            icon="Link"
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-surface-200">
            <div className="px-6 py-4 border-b border-surface-200">
              <h3 className="text-lg font-medium text-surface-900">Dependencies ({dependencies.length})</h3>
            </div>
            <div className="divide-y divide-surface-200">
              {dependencies.map((dependency, index) => {
                const dependentTask = getTaskById(dependency.dependentTaskId);
                const precedingTask = getTaskById(dependency.precedingTaskId);
                
return (
                  <motion.div
                    key={dependency.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
<div className="mb-3">
                          <h4 className="font-semibold text-surface-900 text-lg truncate">
                            {dependency.name || dependency.Name || 'Unnamed Dependency'}
                          </h4>
                          <p className="text-sm text-surface-500">Dependency Relationship</p>
                        </div>
                        <div className="flex items-center gap-4">
<div className="flex-1 min-w-0">
                            <h5 className="font-medium text-surface-900 truncate">
                              {dependentTask?.title || dependentTask?.name || "Unknown Task"}
                            </h5>
                            <p className="text-sm text-surface-600">Dependent Task</p>
                          </div>
                          
                          <div className="flex items-center gap-2 px-3 py-1 bg-surface-100 rounded-lg">
                            <ApperIcon name="ArrowRight" className="w-4 h-4 text-surface-600" />
                            <span className="text-xs font-medium text-surface-700 uppercase">
                              {dependency.dependencyType.replace('-', ' ')}
                            </span>
                          </div>
                          
<div className="flex-1 min-w-0">
                            <h5 className="font-medium text-surface-900 truncate">
                              {precedingTask?.title || precedingTask?.name || "Unknown Task"}
                            </h5>
                            <p className="text-sm text-surface-600">Preceding Task</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteDependency(dependency.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDependencies;