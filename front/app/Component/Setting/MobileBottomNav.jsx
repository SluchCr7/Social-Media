'use client';
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TABS } from '@/app/utils/Data';
import {
  HiPaintBrush,
  HiShieldCheck,
  HiUser,
  HiGlobeAlt,
  HiClock,
  HiBell,
  HiUserGroup,
  HiCog6Tooth
} from 'react-icons/hi2';

const TAB_ICONS = {
  appearance: HiPaintBrush,
  security: HiShieldCheck,
  profile: HiUser,
  language: HiGlobeAlt,
  history: HiClock,
  notifications: HiBell,
  communities: HiUserGroup,
  account: HiCog6Tooth,
};

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed flex md:hidden bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 border-t border-gray-200/50 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="flex items-center justify-start overflow-x-auto no-scrollbar px-2 py-2 space-x-1 snap-x snap-mandatory w-full">
        {TABS.map((tab, index) => {
          const Icon = TAB_ICONS[tab.id] || HiCog6Tooth;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => tab.view !== false && setActiveTab(tab.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'relative flex flex-col items-center justify-center min-w-[70px] flex-shrink-0 rounded-2xl px-2 py-3 transition-all duration-300 snap-center',
                tab.view === false && 'opacity-40 pointer-events-none',
                isActive && 'scale-105'
              )}
            >
              {/* Background */}
              <div className={clsx(
                'absolute inset-0 rounded-2xl transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 backdrop-blur-sm'
                  : 'bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              )} />

              {/* Icon */}
              <motion.div
                className={clsx(
                  'relative mb-1 transition-colors duration-300',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Label */}
              <span className={clsx(
                'relative text-[9px] font-bold truncate max-w-full transition-colors duration-300 uppercase tracking-wider',
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent'
                  : 'text-gray-600 dark:text-gray-400'
              )}>
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Glow effect */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl -z-10"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
