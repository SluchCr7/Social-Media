'use client';

import React, { memo } from 'react';
import { Clock, Smartphone, MapPin, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const HistoryTab = memo(({ loginHistory }) => {
  const { t } = useTranslation();

  return (
    <SettingsSection
      title="Access Logs"
      description="Monitor recent authentication events"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Timeline Log */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Session Timeline')}</h3>
          </div>
          
          <div className="relative">
            <LoginHistoryTimeline items={loginHistory} />
          </div>
        </div>

        {/* Security Modules */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm flex items-start gap-4 group hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 flex items-center justify-center flex-shrink-0 text-indigo-500 group-hover:scale-105 transition-transform duration-300">
              <Smartphone size={18} />
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 leading-tight">{t('Device Fingerprint')}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mt-1.5">
                {t('Ensure all listed devices are familiar and authorized.')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm flex items-start gap-4 group hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover:scale-105 transition-transform duration-300">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 leading-tight">{t('Geo-Location')}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mt-1.5">
                {t('Verify that login locations match your physical movements.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

HistoryTab.displayName = 'HistoryTab';
export default HistoryTab;