import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle2, Languages } from 'lucide-react';
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
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
          <Globe size={40} />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Localization')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Select your interface language')}
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Language Selection */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
           <div className="flex items-center gap-3 mb-4">
             <Languages size={20} className="text-indigo-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Available Dialects')}</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Globe size={100} className="rotate-12" />
             </div>
             <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                 <CheckCircle2 size={24} />
               </div>
               <h4 className="text-lg font-black uppercase tracking-tighter">
                 {t('System Translation')}
               </h4>
               <p className="text-xs font-medium leading-relaxed opacity-90">
                 {t('Modifying the language preference instantly updates all system interface elements. User-generated content remains in its original published language.')}
               </p>
             </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
});

LanguageTab.displayName = 'LanguageTab';
export default LanguageTab;
