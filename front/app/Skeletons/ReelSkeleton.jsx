import React from 'react';

const ReelSkeleton = () => {
  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50 animate-pulse" />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

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

export default ReelSkeleton;
