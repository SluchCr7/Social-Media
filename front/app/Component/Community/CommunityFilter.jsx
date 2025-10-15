import { SORT_OPTIONS } from '@/app/utils/Data'
import React from 'react'
import { motion } from 'framer-motion'
import { FaSearch } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const CommunityFilter = ({
  categories = [],
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) => {
  const {t} = useTranslation()
  return(
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between flex-wrap sticky top-0 bg-lightMode-bg dark:bg-darkMode-bg z-10 p-2 rounded-md shadow-sm"
    >
      {/* التصنيفات */}
      <div className="flex gap-2 flex-wrap">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-xs px-3 py-1.5 rounded-full border transition select-none whitespace-nowrap shadow-sm
                ${activeCategory === cat
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text border-gray-200 dark:border-gray-700 hover:border-sky-400'
                }`}
            >
              {cat}
            </motion.button>
          ))
        ) : (
          <span className="text-sm text-gray-500">{t("No categories")}</span>
        )}
      </div>

      {/* البحث والفرز */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-lightMode-menu dark:bg-darkMode-menu rounded-lg px-3 py-2 flex-1 min-w-[160px] focus-within:ring-2 focus-within:ring-sky-500 transition">
          <FaSearch className="text-lightMode-text2 dark:text-darkMode-text2" />
          <input
            aria-label="Search communities"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search communities..."
            className="bg-transparent outline-none text-sm w-full placeholder-lightMode-text2 dark:placeholder-darkMode-text2"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg border text-sm bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text min-w-[120px] focus:ring-2 focus:ring-sky-500 focus:outline-none"
        >
          {SORT_OPTIONS.map(({name,value}) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  )
}


export default CommunityFilter
