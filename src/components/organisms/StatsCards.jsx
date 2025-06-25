import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatsCards = ({ stats, loading = false, className = '' }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 0,
      icon: 'List',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completedTasks || 0,
      icon: 'CheckCircle',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: stats.activeTasks || 0,
      icon: 'Clock',
      color: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 0,
      icon: 'AlertCircle',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {cards.map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-surface-200 rounded w-20 mb-2" />
                <div className="h-8 bg-surface-200 rounded w-12" />
              </div>
              <div className="w-12 h-12 bg-surface-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 mb-1">
                {card.title}
              </p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
              <ApperIcon name={card.icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;