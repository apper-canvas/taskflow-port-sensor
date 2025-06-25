import React from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ 
  task, 
  project, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  selectable = false,
  selected = false,
  onSelectionChange,
  className = '' 
}) => {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isCompleted;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.Id, !isCompleted);
  };

  const handleEdit = () => {
    onEdit(task);
  };

const handleDelete = () => {
    onDelete(task.Id);
  };

  const handleSelectionChange = (checked) => {
    if (onSelectionChange) {
      onSelectionChange(task.Id, checked);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 
        border-l-4 ${isCompleted ? 'opacity-75' : ''}
        ${selected ? 'ring-2 ring-primary' : ''}
        ${className}
      `}
      style={{ borderLeftColor: priorityColors[task.priority] }}
    >
<div className="p-4">
        <div className="flex items-start gap-3">
          {selectable && (
            <div className="flex-shrink-0 mt-1">
              <Checkbox
                checked={selected}
                onChange={handleSelectionChange}
                size="md"
              />
            </div>
          )}
          
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={isCompleted}
              onChange={handleToggleComplete}
              size="md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 
                  className={`font-medium ${
                    isCompleted 
                      ? 'text-surface-500 line-through' 
                      : 'text-surface-900'
                  }`}
                >
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    isCompleted 
                      ? 'text-surface-400' 
                      : 'text-surface-600'
                  } line-clamp-2`}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-3">
                  {project && (
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-xs text-surface-600">{project.name}</span>
                    </div>
                  )}

                  <Badge variant={task.priority} size="sm">
                    {task.priority}
                  </Badge>

                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${
                      isOverdue 
                        ? 'text-red-600' 
                        : isDueToday 
                          ? 'text-accent' 
                          : 'text-surface-500'
                    }`}>
                      <ApperIcon name="Calendar" className="w-3 h-3" />
                      <span>
                        {isToday(new Date(task.dueDate)) 
                          ? 'Today' 
                          : format(new Date(task.dueDate), 'MMM d')
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEdit}
                  className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;