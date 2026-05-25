'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle2, Languages } from 'lucide-react';
import { availableLanguages } from '@/app/utils/Data';
import LanguageCard from '@/app/Component/Setting/LanguageCard';
import { useTranslation } from 'react-i18next';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const LanguageTab = memo(({ language, handleLanguageChange }) => {
  const { t } = useTranslation();

  return (
    <SettingsSection
      title="Localization"
      description="Select your interface language preference"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Language Selection */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Languages size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Available Dialects')}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableLanguages.map((l, index) => (
              <motion.div
                key={l.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <LanguageCard
                  lang={l}
                  active={language === l.code}
                  onClick={handleLanguageChange}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-600 dark:bg-indigo-950 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 text-white select-none pointer-events-none">
              <Globe size={100} className="rotate-12" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center text-white">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider">
                {t('System Translation')}
              </h4>
              <p className="text-xs font-semibold leading-relaxed opacity-85">
                {t('Modifying the language preference instantly updates all system interface elements. User-generated content remains in its original published language.')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </SettingsSection>
  );
});

LanguageTab.displayName = 'LanguageTab';
export default LanguageTab;
