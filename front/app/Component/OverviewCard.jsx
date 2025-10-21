'use client'

import React from 'react'
import { motion } from 'framer-motion'

const OverviewCard = ({ title, value, formatNumber, children }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    className="
      p-4 rounded-2xl
      bg-gradient-to-br from-lightMode-bg/80 to-lightMode-menu/60
      dark:from-gray-900/60 dark:to-gray-900/40
      border border-gray-200 dark:border-gray-800
      shadow-[0_8px_30px_rgba(2,6,23,0.3)]
      hover:shadow-[0_8px_35px_rgba(2,6,23,0.5)]
      transition-all duration-300
    "
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs text-lightMode-text2 dark:text-gray-400">{title}</div>
        <div className="text-2xl font-semibold text-lightMode-text dark:text-white">
          {formatNumber(value)}
        </div>
      </div>
      <div className="w-12 h-10 flex items-center justify-center text-lightMode-text dark:text-white/80">
        {children}
      </div>
    </div>
  </motion.div>
)

export default OverviewCard
