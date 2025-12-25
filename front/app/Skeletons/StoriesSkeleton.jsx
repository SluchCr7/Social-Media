import React from 'react';

const StoriesSkeleton = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      ))}

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

export default StoriesSkeleton;
