import React from 'react';

const CommunitySkeleton = () => {
  return (
    <div className="relative p-6 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />

      <div className="relative space-y-4">
        {/* Cover Image */}
        <div className="relative h-32 w-full rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Avatar */}
        <div className="relative -mt-12 ml-6 w-20 h-20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse border-4 border-white dark:border-gray-900" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Title */}
        <div className="relative h-6 w-48 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="relative h-4 w-full rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="relative h-4 w-3/4 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="relative h-5 w-16 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
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

export default CommunitySkeleton;