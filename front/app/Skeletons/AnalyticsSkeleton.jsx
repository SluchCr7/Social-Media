import React from 'react'
// ✨ Improved Skeleton Loader ✨
const AnalyticsSkeleton = () => (
  <div className="space-y-8 animate-pulse w-full">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-6 w-40 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md" />
        <div className="h-4 w-64 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md" />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <div className="h-10 w-36 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg" />
        <div className="h-10 w-28 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg" />
      </div>
    </div>

    {/* Overview cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800 shadow-[0_4px_20px_rgba(2,6,23,0.6)]"
        >
          <div className="h-4 w-20 bg-gray-700 rounded mb-2" />
          <div className="h-6 w-16 bg-gray-600 rounded" />
        </div>
      ))}
    </div>

    {/* Charts section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line chart */}
      <div className="lg:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-700 rounded" />
        </div>
        <div className="h-72 w-full bg-gray-800/40 rounded-xl" />
      </div>

      {/* Pie chart */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800 space-y-4">
        <div className="h-5 w-32 bg-gray-700 rounded" />
        <div className="h-48 w-full bg-gray-800/40 rounded-full mx-auto" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <div className="h-4 w-20 bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-10 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom section: Top posts + Peak hours */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Top Posts */}
      <div className="lg:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800 space-y-3">
        <div className="h-5 w-32 bg-gray-700 rounded mb-2" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40"
          >
            <div className="flex-1 pr-4 space-y-2">
              <div className="h-4 w-40 bg-gray-700 rounded" />
              <div className="h-3 w-32 bg-gray-700/70 rounded" />
            </div>
            <div className="w-36 flex items-center gap-3">
              <div className="h-4 w-6 bg-gray-700 rounded" />
              <div className="w-full h-2 bg-gray-700/70 rounded-full overflow-hidden" />
            </div>
          </div>
        ))}
      </div>

      {/* Peak Hours */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800">
        <div className="h-5 w-32 bg-gray-700 rounded mb-4" />
        <div className="flex gap-1 items-end h-36 px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-3 rounded-sm bg-gradient-to-t from-gray-800 to-gray-700"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-3 h-3 w-40 bg-gray-700 rounded" />
      </div>
    </div>
  </div>
)

export default AnalyticsSkeleton