import React from 'react'

export default function MusicSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Now Playing Skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48 md:w-40 md:h-40 bg-gray-300 dark:bg-gray-800 rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-40 bg-gray-300 dark:bg-gray-800 rounded" />
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-800 rounded" />
          <div className="flex gap-3 mt-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-300 dark:bg-gray-800 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Songs List Skeleton */}
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-800 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-800 rounded" />
              <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
