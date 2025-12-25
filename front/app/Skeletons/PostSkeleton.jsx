'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PostSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 w-full mb-6 overflow-hidden"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-32 h-4 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
          <div className="w-20 h-3 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 mb-6">
        <div className="w-full h-3 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        <div className="w-[85%] h-3 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        <div className="w-[70%] h-3 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
      </div>

      {/* Image */}
      <div className="w-full h-64 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl mb-6 animate-pulse" />

      {/* Actions */}
      <div className="flex justify-between items-center px-2">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PostSkeleton;
