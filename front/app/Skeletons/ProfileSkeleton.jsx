import React from 'react';
import { motion } from 'framer-motion';

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center lg:items-start gap-8 w-full pt-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-36 h-36 rounded-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Username */}
      <div className="relative h-8 w-48 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Display Name */}
      <div className="relative h-5 w-32 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-3 mt-2 w-full max-w-md">
        {[100, 75, 50].map((width, idx) => (
          <div key={idx} className="relative h-4 rounded-full overflow-hidden" style={{ width: `${width}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center lg:justify-start gap-10 mt-6 w-full max-w-md">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className="relative h-6 w-12 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="relative h-4 w-16 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        ))}
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

export default ProfileSkeleton;