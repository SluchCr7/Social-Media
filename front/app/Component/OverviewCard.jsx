'use client'

import React from 'react'
import { motion } from 'framer-motion'

const OverviewCard = ({ title, value, formatNumber, children }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="
      relative overflow-hidden
      p-6 rounded-[2.5rem]
      bg-white dark:bg-black/40
      backdrop-blur-3xl
      border border-gray-200 dark:border-white/5
      shadow-[0_20px_50px_rgba(0,0,0,0.3)]
      hover:shadow-indigo-500/10
      transition-all duration-500
      group cursor-default
    "
  >
    {/* Subtle Background Glow */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />

    <div className="flex flex-col gap-5 relative z-10">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
          {title}
        </span>
        <div className="text-indigo-400 dark:text-indigo-500 group-hover:scale-110 transition-transform">
          {children}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">
          {formatNumber ? formatNumber(value) : value}
        </div>
        <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-transparent rounded-full opacity-60 group-hover:w-16 transition-all duration-700" />
      </div>
    </div>
  </motion.div>
)

export default OverviewCard
