'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HiGlobeAlt, HiCheckCircle } from 'react-icons/hi2';
import { availableLanguages } from '@/app/utils/Data';
import LanguageCard from '@/app/Component/Setting/LanguageCard';
import { useTranslation } from 'react-i18next';

const LanguageTab = memo(({ language, handleLanguageChange }) => {
  const { t } = useTranslation();

  return (
    <motion.section
      key="language"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl">
            <HiGlobeAlt className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <HiCheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Language")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t("Select your preferred language for the UI.")}
          </p>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableLanguages.map((l, index) => (
          <motion.div
            key={l.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <LanguageCard
              lang={l}
              active={language === l.code}
              onClick={handleLanguageChange}
            />
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-200/50 dark:border-indigo-500/20"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <HiGlobeAlt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              {t('Language Settings')}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('Changing your language will update all interface elements. Your content will remain in its original language.')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
});

LanguageTab.displayName = 'LanguageTab';
export default LanguageTab;
