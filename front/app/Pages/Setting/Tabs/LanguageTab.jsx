'use client';
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { MdLanguage } from 'react-icons/md';
import { availableLanguages } from '@/app/utils/Data';
import LanguageCard from '@/app/Component/Setting/LanguageCard';
import { useTranslation } from 'react-i18next';

const LanguageTab = memo(({
    language, handleLanguageChange
}) => {
  const {t} = useTranslation()
  return (
    <motion.section
      key="language"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="p-6 rounded-2xl w-full bg-white/60 dark:bg-gray-900/60 border shadow"
    >
      {/* 🗣 العنوان */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg">
          <MdLanguage />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t("Language")}</h2>
          <p className="text-sm text-gray-500">
            {t("Select your preferred language for the UI.")}
          </p>
        </div>
      </div>

      {/* 🌍 قائمة اللغات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableLanguages.map((l) => (
          <LanguageCard
            key={l.code}
            lang={l}
            active={language === l.code}
            onClick={handleLanguageChange}
          />
        ))}
      </div>
    </motion.section>
  );
});
LanguageTab.displayName = 'LanguageTab'
export default LanguageTab;
