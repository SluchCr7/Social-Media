import React from 'react';
import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

function LanguageCard({ lang, active, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(lang.code)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative p-4 rounded-2xl text-left w-full transition-all duration-300 overflow-hidden group',
        active
          ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10 dark:from-blue-600/30 dark:via-purple-600/20 dark:to-pink-600/15 ring-2 ring-blue-500/50 dark:ring-blue-400/50 shadow-lg shadow-blue-500/20'
          : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-md'
      )}
    >
      {/* Animated gradient overlay */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        active && 'opacity-100'
      )} />

      {/* Shimmer effect */}
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Flag with glow effect */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={clsx(
            'text-4xl p-3 rounded-xl backdrop-blur-sm transition-all',
            active
              ? 'bg-white/30 dark:bg-gray-700/30 shadow-lg'
              : 'bg-gray-100/50 dark:bg-gray-700/50'
          )}
        >
          {lang.flag}
        </motion.div>

        {/* Language info */}
        <div className="flex-1">
          <div className={clsx(
            'font-bold text-base transition-colors',
            active
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent'
              : 'text-gray-900 dark:text-gray-100'
          )}>
            {lang.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {lang.code.toUpperCase()}
          </div>
        </div>

        {/* Check icon with animation */}
        {active && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
          >
            <FaCheck className="text-white text-sm" />
          </motion.div>
        )}
      </div>

      {/* Active indicator line */}
      {active && (
        <motion.div
          layoutId="activeLanguage"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-b-2xl"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default React.memo(LanguageCard);