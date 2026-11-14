
'use client';

import React, { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const HistoryTab = memo(({ loginHistory }) => {
  const { t } = useTranslation();

  return (
    <SettingsSection
      title="Login History"
      description="Monitor recent authentication events"
    >
      <div className="w-full">
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {t('Session Timeline')}
            </h3>
          </div>

          <div className="relative">
            <LoginHistoryTimeline items={loginHistory} />
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

HistoryTab.displayName = 'HistoryTab';

export default HistoryTab;
