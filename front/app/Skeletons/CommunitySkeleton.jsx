'use client'

import React from 'react'
import { motion } from 'framer-motion'

const SkeletonPulse = "animate-pulse bg-gray-300 dark:bg-gray-700"

// ===============================
// Community Header Skeleton
// ===============================
export const CommunityHeaderSkeleton = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 mb-6">
      {/* Cover */}
      <div className={`w-full h-48 ${SkeletonPulse}`}></div>

      {/* Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          <div className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 ${SkeletonPulse}`}></div>
        </div>

        {/* Text */}
        <div className="mt-16 flex flex-col gap-2">
          <div className={`w-1/3 h-5 rounded-md ${SkeletonPulse}`}></div>
          <div className={`w-1/2 h-4 rounded-md ${SkeletonPulse}`}></div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <div className={`w-24 h-9 rounded-xl ${SkeletonPulse}`}></div>
          <div className={`w-24 h-9 rounded-xl ${SkeletonPulse}`}></div>
        </div>
      </div>
    </div>
  )
}