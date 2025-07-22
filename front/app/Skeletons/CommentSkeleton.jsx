import React from 'react';

const CommentSkeleton = () => {
  return (
    <div className="animate-pulse bg-lightMode-menu dark:bg-darkMode-menu rounded-xl p-4 shadow w-full mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>

        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>

          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
