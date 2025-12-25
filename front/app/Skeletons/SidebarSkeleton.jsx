import React from 'react';

const SidebarSkeleton = () => {
  return (
    <div className="w-full space-y-4 p-6">
      {/* Logo */}
      <div className="relative h-12 w-32 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Menu Items */}
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="relative flex items-center gap-4 p-3 rounded-2xl overflow-hidden">
          <div className="relative w-6 h-6 rounded-lg overflow-hidden">
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

export default SidebarSkeleton;
