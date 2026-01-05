'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon, HiSparkles, HiSwatch, HiEye, HiAdjustmentsHorizontal } from 'react-icons/hi2';
import clsx from 'clsx';
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch';
import { DEFAULT_COLORS } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';

const AppearanceTab = React.memo(({ darkMode, toggleTheme, user, initialColor = DEFAULT_COLORS[0].value }) => {
  const { t } = useTranslation();
  const [backgroundValue, setBackgroundValue] = useState(initialColor);
  const [customColor, setCustomColor] = useState('');
  const [layout, setLayout] = useState('relaxed');

  const colors = useMemo(() => DEFAULT_COLORS, []);

  const handleBackgroundChange = useCallback((type, value) => {
    setBackgroundValue(value);
    if (type === 'custom') setCustomColor(value);
  }, []);

  return (
    <motion.section
      key="appearance"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white shadow-xl">
            <HiSparkles className="w-6 h-6" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('Appearance')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Personalize theme, layout and accent color.')}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Theme Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {darkMode ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
            </div>
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Theme Mode')}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('Light')}</div>
                <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('Dark')}</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {t('Toggle dark mode across the site for better visibility in low-light environments.')}
            </p>

            {/* Theme Preview Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all cursor-pointer",
                  !darkMode
                    ? "border-indigo-500 bg-white shadow-lg shadow-indigo-500/20"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                )}
                onClick={() => !darkMode || toggleTheme()}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HiSun className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{t('Light')}</span>
                  </div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all cursor-pointer",
                  darkMode
                    ? "border-indigo-500 bg-gray-900 shadow-lg shadow-indigo-500/20"
                    : "border-gray-300 bg-gray-900"
                )}
                onClick={() => darkMode || toggleTheme()}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HiMoon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">{t('Dark')}</span>
                  </div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Accent Color Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HiSwatch className="w-5 h-5" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Accent Color')}</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-3">
              {colors.map((c) => (
                <motion.button
                  key={c.value}
                  title={c.name}
                  onClick={() => handleBackgroundChange('color', c.value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    'relative w-full aspect-square rounded-xl transition-all',
                    backgroundValue === c.value
                      ? 'ring-4 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900 scale-110'
                      : 'hover:scale-105'
                  )}
                  style={{ backgroundColor: c.value }}
                >
                  {backgroundValue === c.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                    </motion.div>
                  )}
                </motion.button>
              ))}

              {/* Custom Color Picker */}
              <label className="relative w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer overflow-hidden group">
                <input
                  type="color"
                  value={customColor || '#000000'}
                  onChange={(e) => handleBackgroundChange('custom', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all">
                  <HiSparkles className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Selected')}:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg shadow-lg border-2 border-white dark:border-gray-800"
                    style={{ backgroundColor: backgroundValue }}
                  />
                  <span className="text-xs font-mono font-bold" style={{ color: backgroundValue }}>
                    {backgroundValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <HiAdjustmentsHorizontal className="w-5 h-5" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Layout Density')}</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLayout('compact')}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  layout === 'compact'
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-500/50"
                )}
              >
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t('Compact')}</div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLayout('relaxed')}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  layout === 'relaxed'
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-500/50"
                )}
              >
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Relaxed')}</div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {t('Choose a compact or relaxed layout for lists and posts.')}
            </p>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <HiEye className="w-5 h-5" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Live Preview')}</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="h-12 w-12 rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg"
                  style={{ backgroundColor: backgroundValue }}
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">{user?.username || t('User')}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    @{user?.profileName || 'username'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6" />
              </div>

              <div className="mt-4 flex gap-2">
                <div
                  className="px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: backgroundValue }}
                >
                  {t('Primary Button')}
                </div>
                <div className="px-4 py-2 rounded-lg border-2 text-sm font-bold" style={{ borderColor: backgroundValue, color: backgroundValue }}>
                  {t('Secondary')}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
              {t('See how your customizations look in real-time')}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});

AppearanceTab.displayName = 'AppearanceTab';

export default AppearanceTab;
