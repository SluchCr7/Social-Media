'use client'

import { FaSortAmountDown } from "react-icons/fa"
import { MdOutlineDateRange } from "react-icons/md"
import { IoMdRefresh } from "react-icons/io"
import { months } from "@/app/utils/Data"
import { useTranslation } from "react-i18next"
import { memo, useCallback, useMemo } from "react"

const FilterBar = memo(({ filters, setFilters, years }) => {
  const { t } = useTranslation()

  // ✅ استخدم useCallback لتثبيت الدوال (ما تتغير إلا عند الحاجة)
  const handleChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [setFilters])

  const resetFilters = useCallback(() => {
    setFilters({ year: "all", month: "all", sort: "latest" })
  }, [setFilters])

  // ✅ استخدم useMemo لتجنب إعادة بناء عناصر القوائم كل مرة
  const yearOptions = useMemo(
    () => years.map(y => (
      <option key={y} value={y}>{y}</option>
    )),
    [years]
  )

  const monthOptions = useMemo(
    () => months.map(({ name, value }, i) => (
      <option key={i + 1} value={value}>{name}</option>
    )),
    []
  )

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
      <FilterSelect
        icon={<MdOutlineDateRange />}
        value={filters.year}
        onChange={e => handleChange("year", e.target.value)}
        options={[
          <option key="all" value="all">{t("All Years")}</option>,
          ...yearOptions
        ]}
      />

      {/* اختيار الشهر */}
      <FilterSelect
        icon={<MdOutlineDateRange />}
        value={filters.month}
        onChange={e => handleChange("month", e.target.value)}
        options={[
          <option key="all" value="all">{t("All Months")}</option>,
          ...monthOptions
        ]}
      />

      {/* الترتيب */}
      <FilterSelect
        icon={<FaSortAmountDown />}
        value={filters.sort}
        onChange={e => handleChange("sort", e.target.value)}
        options={[
          <option key="latest" value="latest">🆕 {t("Latest")}</option>,
          <option key="mostLiked" value="mostLiked">❤️ {t("Most Liked")}</option>,
          <option key="mostCommented" value="mostCommented">💬 {t("Most Commented")}</option>
        ]}
      />

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
})

// 🧩 مكون فرعي ميمو أيضًا لتقليل إعادة التصيير
const FilterSelect = memo(({ icon, value, onChange, options }) => (
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <span className="text-lightMode-text2 dark:text-gray-400 shrink-0 text-lg">{icon}</span>
    <select
      value={value}
      onChange={onChange}
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
      {options}
    </select>
  </div>
))

export default FilterBar
