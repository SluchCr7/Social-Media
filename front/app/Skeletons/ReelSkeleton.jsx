import React from 'react';

const ReelSkeleton = () => {
  return (
    <div className="w-full h-screen bg-gray-800 animate-pulse relative">
      <div className="absolute bottom-5 left-5 w-32 h-4 bg-gray-600 rounded"></div>
      <div className="absolute bottom-12 right-5 flex flex-col gap-4">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default ReelSkeleton;
