import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

const BulkActionToolbar = ({ 
  selectedCount, 
  onMarkComplete, 
  onDelete, 
  onMoveToProject,
  onClearSelection,
  projects = []
}) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    try {
      setLoading(true);
      await onMarkComplete();
      toast.success(`${selectedCount} tasks marked as complete`);
    } catch (error) {
      toast.error('Failed to mark tasks as complete');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected tasks? This action cannot be undone.`)) {
      try {
        setLoading(true);
        await onDelete();
        toast.success(`${selectedCount} tasks deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete tasks');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoveToProject = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    try {
      setLoading(true);
      await onMoveToProject(selectedProjectId);
      setShowMoveDialog(false);
      setSelectedProjectId('');
      toast.success(`${selectedCount} tasks moved to project`);
    } catch (error) {
      toast.error('Failed to move tasks to project');
    } finally {
      setLoading(false);
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.name
  }));

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg border border-surface-200 p-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <span className="font-medium text-primary">{selectedCount}</span>
                task{selectedCount !== 1 ? 's' : ''} selected
              </div>

              <div className="h-6 w-px bg-surface-200" />

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkComplete}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="Check" className="w-4 h-4" />
                  Mark Complete
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoveDialog(true)}
                  disabled={loading || projects.length === 0}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="FolderOpen" className="w-4 h-4" />
                  Move to Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                  Delete
                </Button>
              </div>

              <div className="h-6 w-px bg-surface-200" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </motion.div>

          {/* Move to Project Dialog */}
          {showMoveDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4"
              onClick={() => setShowMoveDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900">
                    Move Tasks to Project
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoveDialog(false)}
                    className="p-1"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-surface-600 mb-4">
                  Select a project to move {selectedCount} selected task{selectedCount !== 1 ? 's' : ''} to:
                </p>

                <div className="space-y-4">
                  <Select
                    value={selectedProjectId}
                    onChange={setSelectedProjectId}
                    options={projectOptions}
                    placeholder="Select a project..."
                    className="w-full"
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowMoveDialog(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleMoveToProject}
                      disabled={loading || !selectedProjectId}
                      className="flex items-center gap-2"
                    >
                      {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                      Move Tasks
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default BulkActionToolbar;