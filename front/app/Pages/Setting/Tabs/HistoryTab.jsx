import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Smartphone, MapPin, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline';

const HistoryTab = memo(({ loginHistory }) => {
  const { t } = useTranslation();

  return (
    <motion.section
      key="history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="relative">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-600 to-gray-800 flex items-center justify-center text-white shadow-xl shadow-slate-600/20">
            <Clock size={40} />
          </div>
          {loginHistory?.length > 0 && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-white text-[10px] font-black shadow-lg">
              {loginHistory.length}
            </div>
          )}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Access Logs')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Monitor recent authentication events')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline Log */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
           <div className="flex items-center gap-3">
             <ShieldCheck size={20} className="text-indigo-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Session Timeline')}</h3>
           </div>
           
           <div className="relative">
             <LoginHistoryTimeline items={loginHistory} />
           </div>
        </div>

        {/* Security Modules */}
        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border flex items-start gap-4 group hover:border-indigo-500/30 transition-all">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
               <Smartphone size={20} />
             </div>
             <div className="flex flex-col">
               <h4 className="text-[13px] font-black uppercase tracking-widest">{t('Device Fingerprint')}</h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-1">
                 {t('Ensure all listed devices are familiar and authorized.')}
               </p>
             </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border flex items-start gap-4 group hover:border-emerald-500/30 transition-all">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
               <MapPin size={20} />
             </div>
             <div className="flex flex-col">
               <h4 className="text-[13px] font-black uppercase tracking-widest">{t('Geo-Location')}</h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-1">
                 {t('Verify that login locations match your physical movements.')}
               </p>
             </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

HistoryTab.displayName = 'HistoryTab';
export default HistoryTab;