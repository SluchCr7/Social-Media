import React from 'react';

const CalendarSkeleton = () => {
  return (
    <div className="relative p-6 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="relative h-8 w-32 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="flex gap-2">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="relative w-8 h-8 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, idx) => (
            <div key={idx} className="relative h-8 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, idx) => (
            <div key={idx} className="relative h-12 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarSkeleton;
