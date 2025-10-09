// LoadingOverlay.jsx
'use client';
import React from 'react';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-white font-medium text-lg">Uploading post...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
