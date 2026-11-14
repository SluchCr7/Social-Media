'use client';

import React, { useState } from 'react';
import { Palette, Monitor, Sun, Moon, Sparkles, Layers, Eye, Check } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DEFAULT_COLORS } from '@/app/utils/Data';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';
import { useTheme } from '@/app/redux/hooks';
import { getAccentTextColor } from '@/app/utils/accentColor';

const AppearanceTab = React.memo(({ darkMode, toggleTheme, user }) => {
  const { t } = useTranslation();
  const { accentColor, setAccentColor } = useTheme();
  const [layout, setLayout] = useState('relaxed');

  return (
    <SettingsSection
      title="Visual Experience"
      description="Customize your interface themes & color palette"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
        {/* Theme Engine */}
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#090d16]/90">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/10 p-2.5 text-indigo-500">
              <Monitor size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">{t('Theme Engine')}</h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('Switch between refined light and dark surfaces')}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => !darkMode || toggleTheme()}
              className={clsx(
                'group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-5 text-center transition-all duration-300 cursor-pointer',
                !darkMode
                ? 'accent-selected shadow-sm'
                  : 'border-slate-200 bg-white/70 hover:border-indigo-500/50 dark:border-slate-800 dark:bg-transparent'
              )}
            >
              <div className={clsx('rounded-xl p-2.5 transition-colors', !darkMode ? 'accent-action' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400')}>
                <Sun size={20} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em]">{t('Light')}</span>
                {!darkMode && <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full accent-action" />}
            </button>

            <button
              onClick={() => darkMode || toggleTheme()}
              className={clsx(
                'group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-5 text-center transition-all duration-300 cursor-pointer',
                darkMode
                  ? 'accent-selected shadow-sm'
                  : 'border-slate-200 bg-white/70 hover:border-indigo-500/50 dark:border-slate-800 dark:bg-transparent'
              )}
            >
              <div className={clsx('rounded-xl p-2.5 transition-colors', darkMode ? 'accent-action' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400')}>
                <Moon size={20} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em]">{t('Dark')}</span>
              {darkMode && <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full accent-action" />}
            </button>
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#090d16]/90 space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-500/10 p-2.5 text-amber-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">{t('Color Spectrum')}</h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('Choose a brand accent for your experience')}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {DEFAULT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setAccentColor(c.value)}
                aria-pressed={accentColor === c.value}
                className={clsx(
                  "w-10 h-10 rounded-xl transition-all duration-200 relative shrink-0 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 accent-ring",
                  accentColor === c.value
                    ? "scale-105 ring-2 ring-offset-2 dark:ring-offset-[#090d16]"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
                aria-label={t('Choose {{color}} accent', { color: c.name })}
              >
                {accentColor === c.value && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: getAccentTextColor(c.value) }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
            <label className="relative w-10 h-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shrink-0">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                aria-label={t('Choose a custom accent color')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Palette size={16} className="text-slate-400 hover:accent-text" />
            </label>
          </div>
        </div>

        {/* Layout Density */}
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#090d16]/90 space-y-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-500">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">{t('Layout Spacing')}</h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('Balanced spacing for a calmer feed')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setLayout('compact')}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                layout === 'compact'
                  ? "accent-selected"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <span>{t('Compact Mode')}</span>
              {layout === 'compact' &&               <div className="w-1.5 h-1.5 rounded-full accent-action" />}
            </button>
            <button
              onClick={() => setLayout('relaxed')}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                layout === 'relaxed'
                  ? "accent-selected"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
              )}
            >
              <span>{t('Relaxed Flow')}</span>
              {layout === 'relaxed' &&               <div className="w-1.5 h-1.5 rounded-full accent-action" />}
            </button>
          </div>
        </div>

        {/* Live Preview - SaaS Mockup */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#090d16]/90">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/10 p-2.5 text-indigo-500">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">{t('Live Mockup')}</h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('Preview your style in real time')}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-[#040811] space-y-4">
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
                className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm"
                style={{
                  backgroundColor: accentColor,
                  color: getAccentTextColor(accentColor),
                }}
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