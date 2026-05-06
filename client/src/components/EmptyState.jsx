
import React from 'react';

const EmptyState = ({ 
  icon = '📭', 
  title = 'No data found', 
  description = 'There is nothing to show right now.',
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-6 animate-float">{icon}</div>
      <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-surface-500 dark:text-surface-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;