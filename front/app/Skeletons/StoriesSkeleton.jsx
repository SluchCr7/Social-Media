'use client';
import React from 'react';

const StorySkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-2 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

export default StorySkeleton;
