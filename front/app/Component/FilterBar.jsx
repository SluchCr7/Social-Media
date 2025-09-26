
'use client'
import { useState } from "react"

const FilterBar = ({ filters, setFilters, years }) => {
  return (
    <div className="flex w-[80%] md:w-[60%] mx-auto flex-wrap items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm">
      
      {/* اختيار السنة */}
      <select
        value={filters.year}
        onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
        className="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="all">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* اختيار الشهر */}
      <select
        value={filters.month}
        onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
        className="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="all">All Months</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{`Month ${m}`}</option>
        ))}
      </select>

      {/* الترتيب */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
        className="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="latest">Latest</option>
        <option value="mostLiked">Most Liked</option>
        <option value="mostCommented">Most Commented</option>
      </select>
    </div>
  )
}

export default FilterBar
