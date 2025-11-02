'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSun } from 'react-icons/fa'
import clsx from 'clsx'
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch'
import { DEFAULT_COLORS } from '@/app/utils/Data'
import { useTranslation } from 'react-i18next'

const AppearanceTab = React.memo(({ darkMode, toggleTheme, user, initialColor = DEFAULT_COLORS[0].value }) => {
  const { t } = useTranslation()
  const [backgroundValue, setBackgroundValue] = useState(initialColor)
  const [customColor, setCustomColor] = useState('')

  // ✅ useMemo لتجنب إعادة إنشاء المصفوفة عند كل ريندر
  const colors = useMemo(() => DEFAULT_COLORS, [])

  // ✅ useCallback لتثبيت الدالة ومنع إعادة تعريفها كل مرة
  const handleBackgroundChange = useCallback((type, value) => {
    setBackgroundValue(value)
    if (type === 'custom') setCustomColor(value)
  }, [])

  return (
    <motion.section
      key="appearance"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="p-6 rounded-2xl w-full bg-gradient-to-r from-white/60 to-blue-50 dark:from-gray-900/60 dark:to-gray-900/40 border shadow"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg">
          <FaSun />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t('Appearance')}</h2>
          <p className="text-sm text-gray-500">
            {t('Personalize theme, layout and accent color.')}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          {/* Theme */}
          <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
            <div className="flex items-center justify-between">
              <div className="font-medium">{t('Theme')}</div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500">{t('Light')}</div>
                <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
                <div className="text-xs text-gray-500">{t('Dark')}</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('Toggle dark mode across the site.')}
            </p>
          </div>

          {/* Accent Color */}
          <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
            <div className="font-medium mb-2">{t('Accent color')}</div>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  title={c.name}
                  onClick={() => handleBackgroundChange('color', c.value)}
                  className={clsx(
                    'w-10 h-10 rounded-full border-2 transition-transform',
                    backgroundValue === c.value
                      ? 'scale-110 ring-2 ring-offset-2 ring-blue-400 border-white'
                      : 'border-gray-300 hover:scale-105'
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="color"
                  value={customColor || '#000000'}
                  onChange={(e) => handleBackgroundChange('custom', e.target.value)}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                  aria-label="Choose custom accent color"
                />
              </label>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              {t('Selected')}:&nbsp;
              <span className="font-medium" style={{ color: backgroundValue }}>
                {backgroundValue}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          {/* Layout */}
          <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
            <div className="font-medium">{t('Layout')}</div>
            <p className="text-sm text-gray-500 mt-2">
              {t('Choose a compact or relaxed layout for lists and posts.')}
            </p>
            <div className="mt-3 flex gap-3">
              <button className="px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                {t('Compact')}
              </button>
              <button className="px-3 py-2 rounded-lg border bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:opacity-90 transition">
                {t('Relaxed')}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
            <div className="font-medium">{t('Preview')}</div>
            <div className="mt-3 p-3 rounded-lg border bg-white/30 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: backgroundValue }}
                />
                <div>
                  <div className="font-medium">{user?.username || t('User')}</div>
                  <div className="text-xs text-gray-500">
                    @{user?.profileName || 'username'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
})

AppearanceTab.displayName = 'AppearanceTab'

export default AppearanceTab
