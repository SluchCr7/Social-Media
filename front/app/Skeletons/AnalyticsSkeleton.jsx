import React from 'react'

const AnalyticsSkeleton = () => {
  return (
    <div className="w-full p-6 space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      ))}
      </div>
  )
}

export default AnalyticsSkeleton