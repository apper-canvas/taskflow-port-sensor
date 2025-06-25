import React from 'react';

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border-l-4 border-surface-200 shadow-sm p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-surface-200 rounded-md flex-shrink-0 mt-1" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-surface-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-surface-200 rounded w-full mb-1" />
                  <div className="h-4 bg-surface-200 rounded w-2/3 mb-3" />
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-surface-200 rounded-full" />
                      <div className="h-3 bg-surface-200 rounded w-16" />
                    </div>
                    <div className="h-5 bg-surface-200 rounded-full w-12" />
                    <div className="h-3 bg-surface-200 rounded w-20" />
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-surface-200 rounded" />
                  <div className="w-6 h-6 bg-surface-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;