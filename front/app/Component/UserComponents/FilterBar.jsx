'use client'
import { FaSortAmountDown } from "react-icons/fa"
import { MdOutlineDateRange } from "react-icons/md"
import { IoMdRefresh } from "react-icons/io"

const FilterBar = ({ filters, setFilters, years }) => {
  const resetFilters = () => {
    setFilters({ year: "all", month: "all", sort: "latest" })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 w-[95%] sm:w-[90%] mx-auto">
      
      {/* اختيار السنة */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MdOutlineDateRange className="text-gray-500 shrink-0" />
        <select
          value={filters.year}
          onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
          className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 rounded-xl border text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* اختيار الشهر */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MdOutlineDateRange className="text-gray-500 shrink-0" />
        <select
          value={filters.month}
          onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
          className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 rounded-xl border text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Months</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{`Month ${m}`}</option>
          ))}
        </select>
      </div>

      {/* الترتيب */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FaSortAmountDown className="text-gray-500 shrink-0" />
        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 rounded-xl border text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="latest">🆕 Latest</option>
          <option value="mostLiked">❤️ Most Liked</option>
          <option value="mostCommented">💬 Most Commented</option>
        </select>
      </div>

      {/* زر Reset */}
      <button
        onClick={resetFilters}
        className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition"
      >
        <IoMdRefresh />
        Reset
      </button>
    </div>
  )
}

export default FilterBar
