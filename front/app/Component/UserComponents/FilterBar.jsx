'use client'

import { FaSortAmountDown } from "react-icons/fa"
import { MdOutlineDateRange } from "react-icons/md"
import { IoMdRefresh } from "react-icons/io"
import { months } from "@/app/utils/Data"
import { useTranslation } from "react-i18next"
const FilterBar = ({ filters, setFilters, years }) => {
  const resetFilters = () => {
    setFilters({ year: "all", month: "all", sort: "latest" })
  }
  const {t} = useTranslation()
  return (
    <div
      className="
        flex flex-wrap items-center justify-center gap-3 sm:gap-4
        bg-lightMode-menu dark:bg-darkMode-menu
        p-4 rounded-2xl shadow-lg border border-lightMode-text/10 dark:border-darkMode-text/20
        w-[95%] sm:w-[90%] mx-auto transition-colors duration-300
      "
    >
      {/* اختيار السنة */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MdOutlineDateRange className="text-lightMode-text2 dark:text-gray-400 shrink-0 text-lg" />
        <select
          value={filters.year}
          onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
          className="
            flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 rounded-xl border
            text-xs sm:text-sm font-medium
            bg-lightMode-bg dark:bg-darkMode-bg
            border-lightMode-text/10 dark:border-darkMode-text/20
            text-lightMode-text2 dark:text-gray-200
            focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text
            transition
          "
        >
          <option value="all">{t("All Years")}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* اختيار الشهر */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MdOutlineDateRange className="text-lightMode-text2 dark:text-gray-400 shrink-0 text-lg" />
        <select
          value={filters.month}
          onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
          className="
            flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 rounded-xl border
            text-xs sm:text-sm font-medium
            bg-lightMode-bg dark:bg-darkMode-bg
            border-lightMode-text/10 dark:border-darkMode-text/20
            text-lightMode-text2 dark:text-gray-200
            focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text
            transition
          "
        >
          <option value="all">{t("All Months")}</option>
          {months.map(({name , value}, i) => (
            <option key={i + 1} value={value}>{name}</option>
          ))}
        </select>
      </div>

      {/* الترتيب */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FaSortAmountDown className="text-lightMode-text2 dark:text-gray-400 shrink-0 text-lg" />
        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="
            flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 rounded-xl border
            text-xs sm:text-sm font-medium
            bg-lightMode-bg dark:bg-darkMode-bg
            border-lightMode-text/10 dark:border-darkMode-text/20
            text-lightMode-text2 dark:text-gray-200
            focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text
            transition
          "
        >
          <option value="latest">🆕 {t("Latest")}</option>
          <option value="mostLiked">❤️ {t("Most Liked")}</option>
          <option value="mostCommented">💬 {t("Most Commented")}</option>
        </select>
      </div>

      {/* زر Reset */}
      <button
        onClick={resetFilters}
        className="
          w-full sm:w-auto ml-auto flex items-center justify-center gap-2
          px-4 py-2 text-xs sm:text-sm font-medium
          rounded-xl
          bg-red-100 text-red-600 hover:bg-red-200
          dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/70
          border border-red-200/50 dark:border-red-800/50
          transition duration-200
        "
      >
        <IoMdRefresh className="text-base" />
        {t("Reset")}
      </button>
    </div>
  )
}

export default FilterBar
