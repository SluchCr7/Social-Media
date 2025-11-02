import React from 'react'

const MenuSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg p-6 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
    </div>
  )
}

export default MenuSkeleton