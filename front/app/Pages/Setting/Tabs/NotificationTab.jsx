'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Info, UserMinus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const NotificationTab = memo(({ user, onToggleNotificationBlock, loading = false }) => {
  const { t } = useTranslation();
  const blockedUsers = user?.BlockedNotificationFromUsers || [];

  const handleUnblock = useCallback(
    (userId) => {
      if (!loading && onToggleNotificationBlock) {
        onToggleNotificationBlock(userId);
      }
    },
    [onToggleNotificationBlock, loading]
  );

  return (
    <SettingsSection
      title="Notification Hub"
      description="Manage muted signals and alerts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        {/* Muted Users List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 px-1">
            <BellOff size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Muted Entities')}</h3>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm min-h-[300px] flex flex-col justify-start">
            {blockedUsers.length > 0 ? (
              <div className="space-y-3">
                {blockedUsers.map((blockedUser) => (
                  <div
                    key={blockedUser._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar src={blockedUser?.profilePhoto?.url} size="md" className="ring-1 ring-slate-200 dark:ring-slate-850" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate leading-tight">
                          {blockedUser?.profileName || blockedUser?.username || t('Unknown Entity')}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate mt-0.5">
                          @{blockedUser.username}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnblock(blockedUser._id)}
                      disabled={loading}
                      className={`h-9 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        loading
                          ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white shadow-sm active:scale-95'
                      }`}
                    >
                      <UserMinus size={13} />
                      <span>{loading ? t('Processing') : t('Unmute')}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 space-y-4 text-center p-6 select-none">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-505 flex items-center justify-center text-emerald-500">
                  <Sparkles size={26} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('All Clear')}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold max-w-[220px] mx-auto mt-1 leading-relaxed">
                    {t('You currently have no users muted for notifications.')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-600 dark:bg-indigo-950 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 text-white select-none pointer-events-none">
              <Bell size={100} className="rotate-12" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center text-white">
                <Info size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider">
                {t('Notification Protocol')}
              </h4>
              <p className="text-xs font-semibold leading-relaxed opacity-85">
                {t('When you block notifications from an entity, you will not receive any signals regarding their activity. However, their content remains accessible.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

NotificationTab.displayName = 'NotificationTab';
export default NotificationTab;
