'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Palette, 
  Eye, 
  Settings2,
  Check,
  Layout,
  Layers,
  Monitor
} from 'lucide-react';
import clsx from 'clsx';
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch';
import { DEFAULT_COLORS } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';

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
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
          <Palette size={40} />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Visual Experience')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Customize your interface & accent colors')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Theme Engine */}
        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8">
          <div className="flex items-center gap-3">
             <Monitor size={20} className="text-indigo-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Theme Engine')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => !darkMode || toggleTheme()}
               className={clsx(
                 "group relative p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                 !darkMode ? "bg-white border-indigo-500 shadow-xl shadow-indigo-500/10" : "bg-white/5 border-transparent hover:bg-white/10"
               )}
             >
               <div className="flex flex-col items-center gap-4 relative z-10">
                 <div className={clsx("p-3 rounded-2xl transition-all", !darkMode ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400")}>
                   <Sun size={24} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest">{t('Light')}</span>
               </div>
               {!darkMode && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />}
             </button>

             <button 
               onClick={() => darkMode || toggleTheme()}
               className={clsx(
                 "group relative p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                 darkMode ? "bg-black border-indigo-500 shadow-xl shadow-indigo-500/10" : "bg-gray-100 border-transparent hover:bg-gray-200"
               )}
             >
               <div className="flex flex-col items-center gap-4 relative z-10">
                 <div className={clsx("p-3 rounded-2xl transition-all", darkMode ? "bg-indigo-500 text-white" : "bg-black/10 text-gray-400")}>
                   <Moon size={24} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest">{t('Dark')}</span>
               </div>
               {darkMode && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />}
             </button>
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8">
          <div className="flex items-center gap-3">
             <Sparkles size={20} className="text-amber-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Color Spectrum')}</h3>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => handleBackgroundChange('color', c.value)}
                className={clsx(
                  "w-full aspect-square rounded-2xl transition-all duration-300 relative group",
                  backgroundValue === c.value ? "scale-110 ring-4 ring-offset-4 ring-indigo-500 dark:ring-offset-black" : "hover:scale-105"
                )}
                style={{ backgroundColor: c.value }}
              >
                {backgroundValue === c.value && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
            <label className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all group overflow-hidden">
               <input 
                 type="color" 
                 value={customColor || '#6366f1'} 
                 onChange={(e) => handleBackgroundChange('custom', e.target.value)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <Palette size={20} className="text-gray-400 group-hover:text-indigo-500 transition-all" />
            </label>
          </div>
        </div>

        {/* Layout Density */}
        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8 lg:col-span-1">
          <div className="flex items-center gap-3">
             <Layers size={20} className="text-emerald-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Layout Density')}</h3>
          </div>

          <div className="space-y-3">
             <button 
               onClick={() => setLayout('compact')}
               className={clsx(
                 "w-full flex items-center justify-between p-5 rounded-3xl border transition-all duration-300",
                 layout === 'compact' ? "bg-white dark:bg-black border-indigo-500" : "bg-transparent border-transparent hover:bg-white/5"
               )}
             >
               <span className="text-xs font-bold">{t('Compact Mode')}</span>
               {layout === 'compact' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
             </button>
             <button 
               onClick={() => setLayout('relaxed')}
               className={clsx(
                 "w-full flex items-center justify-between p-5 rounded-3xl border transition-all duration-300",
                 layout === 'relaxed' ? "bg-white dark:bg-black border-indigo-500" : "bg-transparent border-transparent hover:bg-white/5"
               )}
             >
               <span className="text-xs font-bold">{t('Relaxed Flow')}</span>
               {layout === 'relaxed' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
             </button>
          </div>
        </div>

        {/* Live Preview - Premium Mockup */}
        <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
          
          <div className="flex items-center gap-3">
             <Eye size={20} className="text-indigo-400" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Live Simulation')}</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 space-y-6">
             <div className="flex items-center gap-4">
                <Avatar src={user?.profilePhoto?.url} size="md" className="ring-2 ring-indigo-500" />
                <div className="space-y-1">
                   <div className="w-24 h-2 bg-white/20 rounded-full" />
                   <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                </div>
             </div>
             
             <div className="space-y-2">
                <div className="w-full h-2 bg-white/5 rounded-full" />
                <div className="w-3/4 h-2 bg-white/5 rounded-full" />
             </div>

             <div className="flex gap-2">
                <div 
                  className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  style={{ backgroundColor: backgroundValue }}
                >
                  Action
                </div>
                <div className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5">
                  Secondary
                </div>
             </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
});

AppearanceTab.displayName = 'AppearanceTab';
export default AppearanceTab;
