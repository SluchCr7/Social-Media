'use client';

import { HiAdjustmentsHorizontal, HiCalendarDays, HiArrowPath, HiChevronDown } from "react-icons/hi2";
import { months } from "@/app/utils/Data";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

const FilterBar = memo(({ filters, setFilters, years }) => {
  const { t } = useTranslation();

  const handleChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({ year: "all", month: "all", sort: "latest" });
  }, [setFilters]);

  const yearOptions = useMemo(
    () => years.map(y => (
      <option key={y} value={y} className="bg-white dark:bg-[#0B0F1A]">{y}</option>
    )),
    [years]
  );

  const monthOptions = useMemo(
    () => months.map(({ name, value }, i) => (
      <option key={i + 1} value={value} className="bg-white dark:bg-[#0B0F1A]">{name}</option>
    )),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mb-12"
    >
      <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] flex flex-wrap items-center gap-6">

        {/* Signal Section */}
        <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-white/5 hidden lg:flex">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <HiAdjustmentsHorizontal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{t("Tuning")}</span>
            <span className="text-xs font-bold text-gray-400 uppercase">{t("Parameters")}</span>
          </div>
        </div>

        {/* Dynamic Selectors */}
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <FilterSelect
            icon={<HiCalendarDays />}
            label={t("Year")}
            value={filters.year}
            onChange={e => handleChange("year", e.target.value)}
            options={[
              <option key="all" value="all" className="bg-white dark:bg-[#0B0F1A]">{t("All Dimensions")}</option>,
              ...yearOptions
            ]}
          />

          <FilterSelect
            icon={<HiCalendarDays />}
            label={t("Month")}
            value={filters.month}
            onChange={e => handleChange("month", e.target.value)}
            options={[
              <option key="all" value="all" className="bg-white dark:bg-[#0B0F1A]">{t("All Phases")}</option>,
              ...monthOptions
            ]}
          />

          <FilterSelect
            icon={<HiAdjustmentsHorizontal />}
            label={t("Sort")}
            value={filters.sort}
            onChange={e => handleChange("sort", e.target.value)}
            options={[
              <option key="latest" value="latest" className="bg-white dark:bg-[#0B0F1A]">🆕 {t("Chronological")}</option>,
              <option key="mostLiked" value="mostLiked" className="bg-white dark:bg-[#0B0F1A]">❤️ {t("Resonant")}</option>,
              <option key="mostCommented" value="mostCommented" className="bg-white dark:bg-[#0B0F1A]">💬 {t("Active Discourse")}</option>
            ]}
          />
        </div>

        {/* Reset Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetFilters}
          className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
        >
          <HiArrowPath className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t("Reset Matrix")}</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

FilterBar.displayName = 'FilterBar';

const FilterSelect = memo(({ icon, label, value, onChange, options }) => (
  <div className="relative group/select flex-1 min-w-[140px]">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
      <span className="text-indigo-500 opacity-60 group-focus-within/select:opacity-100 transition-opacity">
        {icon}
      </span>
      <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-gray-400">
        {label}:
      </span>
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl pl-24 pr-10 py-4 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-white outline-none focus:border-indigo-500/30 transition-all appearance-none cursor-pointer"
    >
      {options}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
      <HiChevronDown className="w-3 h-3" />
    </div>
  </div>
));

FilterSelect.displayName = 'FilterSelect';

export default FilterBar;
