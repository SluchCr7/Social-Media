import React from 'react';

const MenuSkeleton = () => {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="relative flex items-center gap-4 p-3 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/30" />
          <div className="relative w-10 h-10 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="relative flex-1 h-5 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
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

export default MenuSkeleton;