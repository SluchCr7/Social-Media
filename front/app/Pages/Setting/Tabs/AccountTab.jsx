'use client';

import React, { useState, useCallback } from 'react';
import { ShieldCheck, Lock, Shield, Trash2, Download, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection, ToggleSwitch, DangerButton, ConfirmationModal } from '@/app/Component/Setting/SettingsComponents';

const AccountTab = React.memo(({
  user,
  isVerified,
  setIsVerified,
  onMakePremiumVerify,
  onTogglePrivate,
  onToggleShowOnlineStatus,
  handleDelete
}) => {
  const { t } = useTranslation();
  
  // Local state for account termination confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleVerifyToggle = useCallback(
    (v) => {
      setIsVerified(v);
      onMakePremiumVerify(v);
    },
    [setIsVerified, onMakePremiumVerify]
  );

  const handleDeleteConfirm = useCallback(() => {
    handleDelete();
    setIsDeleteModalOpen(false);
  }, [handleDelete]);

  return (
    <SettingsSection
      title="Account Governance"
      description="Manage your digital identity & credentials"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        
        {/* Verification Card */}
        <div className="group p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                {isVerified ? t('Verified') : t('Standard')}
              </div>
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">{t('Elite Verification')}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mb-6">
              {t('Gain trust with a verification badge and priority signal rankings across the network.')}
            </p>
          </div>
          <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('Identity Status')}</span>
            <ToggleSwitch
              checked={isVerified}
              onChange={handleVerifyToggle}
              onColor="bg-amber-500"
            />
          </div>
        </div>

        {/* Privacy Card */}
        <div className="group p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-indigo-600 dark:bg-indigo-950 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 text-white select-none pointer-events-none">
            <Shield size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center mb-6 text-white">
              <Lock size={22} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-6">{t('Privacy Control')}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{t('Private Account')}</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase tracking-wider mt-0.5">{t('Restrict profile access')}</span>
                </div>
                <ToggleSwitch
                  checked={user?.isPrivate || false}
                  onChange={() => onTogglePrivate()}
                  onColor="bg-white/30"
                />
              </div>
              <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{t('Signal Pulse')}</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase tracking-wider mt-0.5">{t('Broadcast activity')}</span>
                </div>
                <ToggleSwitch
                  checked={user?.showOnlineStatus !== false}
                  onChange={() => onToggleShowOnlineStatus()}
                  onColor="bg-white/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Account Archive')}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('Download your personal data archive for portability.')}</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-5 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer">
            {t('Request Data')}
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-2">
          <div className="p-8 rounded-2xl border border-rose-200/50 dark:border-rose-950 bg-rose-500/5 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">{t('Account Termination')}</h3>
              <p className="text-xs text-rose-500/70 font-semibold leading-relaxed">
                {t('Deleting your account is permanent. All posts, media, and data will be liquidated instantly.')}
              </p>
            </div>
            <div className="flex justify-center">
              <DangerButton onClick={() => setIsDeleteModalOpen(true)}>
                {t('Terminate My Presence')}
              </DangerButton>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal for account termination */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="This will permanently delete your user profile and all associated data. This action cannot be undone."
        confirmText="Delete My Data"
        cancelText="Go Back"
        type="danger"
      />
    </SettingsSection>
  );
});

AccountTab.displayName = 'AccountTab';
export default AccountTab;
