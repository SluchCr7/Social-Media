'use client';

import React, { memo, useCallback } from 'react';
import { ShieldCheck, Lock, Key, Fingerprint, Smartphone, Info, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordStrength from '@/app/Component/Setting/PasswordStrength';
import { SettingsSection, InputField, PrimaryButton } from '@/app/Component/Setting/SettingsComponents';

const Security = memo(({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordMessage,
  setPasswordMessage,
  submitPassword,
}) => {
  const { t } = useTranslation();

  const handleReset = useCallback(() => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
  }, [setOldPassword, setNewPassword, setConfirmPassword, setPasswordMessage]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      submitPassword?.(e);
    },
    [submitPassword]
  );

  return (
    <SettingsSection
      title="Security Protocol"
      description="Manage password, 2FA & account safety settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">

        {/* Change Password Engine */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Key size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Credential Update')}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <InputField
                label="Current password"
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                icon={Lock}
                required
              />

              <InputField
                label="New password"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Key}
                required
              />

              <InputField
                label="Confirm password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={ShieldCheck}
                required
              />
            </div>

            <PasswordStrength password={newPassword} />

            {passwordMessage && (
              <div className="p-3 text-[10px] font-bold uppercase tracking-wider text-center text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl animate-pulse">
                {passwordMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <PrimaryButton type="submit" className="flex-1">
                {t('Apply Changes')}
              </PrimaryButton>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 h-11 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                {t('Reset')}
              </button>
            </div>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-500">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('Security Tips')}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t('Use at least 12 characters with a mix of letters, numbers and special symbols for maximum entropy.')}
            </p>
          </div>
        </div>

        {/* Security Modules */}
        <div className="space-y-6">
          {/* 2FA Card */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-emerald-500">
              <Fingerprint size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Biometric/2FA')}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('Add an extra layer of protection using your hardware device.')}</p>
            <button className="w-full h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
              {t('Enable Protection')}
            </button>
          </div>

          {/* Sessions Card */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-purple-500">
              <Smartphone size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Device Matrix')}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('Manage all authenticated hardware currently accessing your data.')}</p>
            <button className="w-full h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 hover:text-white transition-all cursor-pointer">
              {t('Scan Matrix')}
            </button>
          </div>

          {/* Integrity Score */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-4 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 flex items-center justify-center mx-auto">
              <span className="text-lg font-black text-slate-800 dark:text-slate-200">88%</span>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">{t('Integrity Score')}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide leading-relaxed">{t('Your digital signature is highly secure.')}</p>
            </div>
          </div>
        </div>

      </div>
    </SettingsSection>
  );
});

Security.displayName = 'Security';
export default Security;
