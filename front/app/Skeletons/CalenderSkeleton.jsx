'use client';

import React from 'react';

const CalendarSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* ✨ Header */}
      <div className="flex justify-between items-center px-2">
        <div className="h-6 w-24 rounded-lg bg-gradient-to-r from-gray-700/40 to-gray-600/40" />
        <div className="h-6 w-32 rounded-lg bg-gradient-to-r from-gray-700/40 to-gray-600/40" />
        <div className="h-6 w-24 rounded-lg bg-gradient-to-r from-gray-700/40 to-gray-600/40" />
      </div>

      {/* 📅 Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-5 rounded-md bg-gradient-to-r from-gray-700/30 to-gray-600/30 shadow-sm"
          />
        ))}
      </div>

      {/* 🗓️ Days Grid */}
      <div className="grid grid-cols-7 gap-2 mt-3">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-20 sm:h-24 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-700/40 border border-gray-700/40 shadow-inner relative overflow-hidden"
          >
            {/* shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent animate-[shimmer_1.8s_infinite]" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarSkeleton;
