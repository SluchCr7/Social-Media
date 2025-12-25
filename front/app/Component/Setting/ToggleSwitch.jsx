'use client';
import React, { memo } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

function ToggleSwitch({ checked, onChange, onColor = 'bg-blue-500' }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-9 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 shadow-lg',
        checked
          ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900'
          : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500'
      )}
    >
      {/* Background glow */}
      <div className={clsx(
        'absolute inset-0 rounded-full blur-md transition-opacity duration-300',
        checked
          ? 'bg-gray-700 opacity-50'
          : 'bg-yellow-400 opacity-60'
      )} />

      {/* Toggle knob */}
      <motion.span
        layout
        className={clsx(
          'relative inline-flex items-center justify-center h-7 w-7 rounded-full bg-white shadow-lg transform transition-transform duration-300',
          checked ? 'translate-x-1' : 'translate-x-8'
        )}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon */}
        <motion.div
          initial={false}
          animate={{ rotate: checked ? 0 : 180, scale: checked ? 1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {checked ? (
            <Moon className="w-4 h-4 text-gray-700" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </motion.div>

        {/* Inner glow */}
        <div className={clsx(
          'absolute inset-0 rounded-full blur-sm transition-opacity',
          checked
            ? 'bg-blue-400/30 opacity-0'
            : 'bg-yellow-400/50 opacity-100'
        )} />
      </motion.span>

      {/* Stars decoration for dark mode */}
      {checked && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            className="absolute top-4 left-5 w-0.5 h-0.5 bg-white rounded-full"
          />
        </>
      )}
    </button>
  );
}

export default memo(ToggleSwitch);