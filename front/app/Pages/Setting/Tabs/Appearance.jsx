'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Palette, Monitor, Sun, Moon, Sparkles, Layers, Eye, Check } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DEFAULT_COLORS } from '@/app/utils/Data';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection, SettingsCard } from '@/app/Component/Setting/SettingsComponents';

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
    <SettingsSection
      title="Visual Experience"
      description="Customize your interface themes & color palette"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
        
        {/* Theme Engine */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Monitor size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Theme Engine')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => !darkMode || toggleTheme()}
              className={clsx(
                "group relative p-5 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col items-center gap-3 cursor-pointer",
                !darkMode
                  ? "bg-slate-50 dark:bg-slate-900 border-indigo-500 shadow-sm"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <div className={clsx("p-2.5 rounded-lg transition-colors", !darkMode ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                <Sun size={20} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">{t('Light')}</span>
              {!darkMode && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </button>

            <button
              onClick={() => darkMode || toggleTheme()}
              className={clsx(
                "group relative p-5 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col items-center gap-3 cursor-pointer",
                darkMode
                  ? "bg-slate-50 dark:bg-slate-900 border-indigo-500 shadow-sm"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <div className={clsx("p-2.5 rounded-lg transition-colors", darkMode ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                <Moon size={20} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">{t('Dark')}</span>
              {darkMode && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </button>
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Color Spectrum')}</h3>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => handleBackgroundChange('color', c.value)}
                className={clsx(
                  "w-10 h-10 rounded-xl transition-all duration-200 relative shrink-0 cursor-pointer shadow-sm",
                  backgroundValue === c.value
                    ? "scale-105 ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-[#090d16]"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
              >
                {backgroundValue === c.value && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
            <label className="w-10 h-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shrink-0">
              <input
                type="color"
                value={customColor || '#6366f1'}
                onChange={(e) => handleBackgroundChange('custom', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Palette size={16} className="text-slate-400 hover:text-indigo-500" />
            </label>
          </div>
        </div>

        {/* Layout Density */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Layers size={18} className="text-emerald-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Layout Spacing')}</h3>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setLayout('compact')}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                layout === 'compact'
                  ? "bg-slate-50 dark:bg-slate-900 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <span>{t('Compact Mode')}</span>
              {layout === 'compact' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
            </button>
            <button
              onClick={() => setLayout('relaxed')}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                layout === 'relaxed'
                  ? "bg-slate-50 dark:bg-slate-900 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <span>{t('Relaxed Flow')}</span>
              {layout === 'relaxed' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Live Preview - SaaS Mockup */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <Eye size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Live Mockup')}</h3>
          </div>

          <div className="bg-slate-50 dark:bg-[#040811] border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar src={user?.profilePhoto?.url} size="sm" className="ring-1 ring-slate-200 dark:ring-slate-800" />
              <div className="space-y-1.5">
                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="w-10 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
              <div className="w-3/4 h-1.5 bg-slate-200/40 dark:bg-slate-800/40 rounded-full" />
            </div>

            <div className="flex gap-2 pt-1">
              <div
                className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
                style={{ backgroundColor: backgroundValue }}
              >
                Action
              </div>
              <div className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Cancel
              </div>
            </div>
          </div>
        </div>

      </div>
    </SettingsSection>
  );
});

AppearanceTab.displayName = 'AppearanceTab';
export default AppearanceTab;
