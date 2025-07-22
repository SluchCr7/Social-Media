'use client';
import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-darkMode-card rounded-xl p-4 shadow w-full mb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-[80%] h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-[60%] h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Image */}
      <div className="w-full h-60 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>

      {/* Actions */}
      <div className="flex justify-between items-center px-2">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
