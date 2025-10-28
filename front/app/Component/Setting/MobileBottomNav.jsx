'use client'
import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { TABS } from '@/app/utils/Data'

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed flex md:hidden bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-start overflow-x-auto no-scrollbar px-2 py-3 space-x-4 snap-x snap-mandatory">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.view !== false && setActiveTab(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center min-w-[70px] flex-shrink-0 rounded-xl px-2 py-1 transition-all duration-300 snap-center',
              tab.view == false && 'opacity-50 pointer-events-none',
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 scale-110'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
            )}
          >
            <motion.div
              className="text-lg"
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {tab.icon}
            </motion.div>
            <span className="text-[11px] font-medium mt-1 truncate">{tab.label}</span>

            {/* شريط تمييز للتبويب النشط */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeIndicator"
                className="w-8 h-[3px] bg-blue-500 dark:bg-blue-400 rounded-full mt-1"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
