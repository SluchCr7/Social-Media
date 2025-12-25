'use client';
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TABS } from '@/app/utils/Data';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed flex md:hidden bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-gradient-to-t from-white/95 via-white/90 to-white/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/80 border-t border-white/20 dark:border-gray-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

      <div className="flex items-center justify-start overflow-x-auto no-scrollbar px-3 py-3 space-x-2 snap-x snap-mandatory w-full">
        {TABS.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => tab.view !== false && setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
              'relative flex flex-col items-center justify-center min-w-[75px] flex-shrink-0 rounded-2xl px-3 py-2.5 transition-all duration-300 snap-center',
              tab.view === false && 'opacity-40 pointer-events-none',
              activeTab === tab.id
                ? 'scale-105'
                : 'hover:scale-105'
            )}
          >
            {/* Background with gradient */}
            <div className={clsx(
              'absolute inset-0 rounded-2xl transition-all duration-300',
              activeTab === tab.id
                ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10 backdrop-blur-sm'
                : 'bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            )} />

            {/* Icon with animation */}
            <motion.div
              className={clsx(
                'relative text-xl mb-1 transition-colors duration-300',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
              whileTap={{ scale: 0.9 }}
              animate={activeTab === tab.id ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {tab.icon}
            </motion.div>

            {/* Label */}
            <span className={clsx(
              'relative text-[10px] font-bold truncate max-w-full transition-colors duration-300',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent'
                : 'text-gray-600 dark:text-gray-400'
            )}>
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Glow effect */}
            {activeTab === tab.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl -z-10"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
