import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsSkeleton = () => (
  <div className="space-y-8 w-full p-6">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="space-y-3">
        <div className="relative h-8 w-48 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        <div className="relative h-5 w-64 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        {[36, 28].map((w, idx) => (
          <div key={idx} className={`relative h-12 w-${w} rounded-2xl overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        ))}
      </div>
    </motion.div>

    {/* Overview Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative p-6 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />
          <div className="relative space-y-3">
            <div className="relative h-5 w-20 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="relative h-8 w-16 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/50 to-gray-300/50 dark:from-gray-600/50 dark:to-gray-500/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart */}
      <div className="lg:col-span-2 relative p-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />
        <div className="relative space-y-4">
          <div className="relative h-6 w-40 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="relative h-80 w-full rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="relative p-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />
        <div className="relative space-y-4">
          <div className="relative h-6 w-32 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
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

export default AnalyticsSkeleton;