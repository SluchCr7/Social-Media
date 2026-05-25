'use client';

import React, { useState, memo } from 'react';
import { ShieldAlert, Lock, Eye, UserMinus, VolumeX, ChevronRight, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection, ToggleSwitch } from '@/app/Component/Setting/SettingsComponents';

const PrivacyTab = memo(({
  user,
  onTogglePrivate,
  onToggleShowOnlineStatus,
}) => {
  const { t } = useTranslation();

  // Mock Data for Blocked/Muted (Since we don't have backend integration yet)
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, username: 'spambot99', avatar: '/default-avatar.png' },
    { id: 2, username: 'hater_dude', avatar: '/default-avatar.png' },
  ]);

  const unblockUser = (id) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
  };

  return (
    <SettingsSection
      title="Privacy Control"
      description="Manage visibility & user interactions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
        
        {/* Account Visibility Module */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Eye size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Profile Visibility')}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('Private Account')}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 leading-normal">
                  {t('Only approved followers can see your content')}
                </span>
              </div>
              <ToggleSwitch
                checked={user?.isPrivate || false}
                onChange={() => onTogglePrivate()}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('Activity Status')}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 leading-normal">
                  {t('Allow others to see when you are online')}
                </span>
              </div>
              <ToggleSwitch
                checked={user?.showOnlineStatus !== false}
                onChange={() => onToggleShowOnlineStatus()}
              />
            </div>
          </div>
        </div>

        {/* Restricted Entities Module */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <UserMinus size={18} className="text-rose-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Restricted Entities')}</h3>
          </div>

          <div className="space-y-3">
            <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm hover:border-rose-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <UserX size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('Blocked Accounts')}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-0.5">{blockedUsers.length} Entities</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm hover:border-amber-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <VolumeX size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('Muted Accounts')}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-0.5">0 Entities</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Blocked List (Expanded View) */}
        {blockedUsers.length > 0 && (
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-500">{t('Active Blocks')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blockedUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3.5 px-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={u.avatar} size="sm" className="ring-1 ring-slate-200 dark:ring-slate-800" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 truncate">@{u.username}</span>
                  </div>
                  <button
                    onClick={() => unblockUser(u.id)}
                    className="h-8 px-4.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-all cursor-pointer shrink-0"
                  >
                    {t('Revoke')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
});

PrivacyTab.displayName = 'PrivacyTab';
export default PrivacyTab;
