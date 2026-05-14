'use client';
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Fingerprint, 
  Smartphone,
  ShieldAlert,
  Activity,
  History,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordStrength from '@/app/Component/Setting/PasswordStrength';

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
    <motion.section
      key="security"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
          <ShieldCheck size={40} />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Security Protocol')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Manage password, 2FA & account safety')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Change Password Engine */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8">
          <div className="flex items-center gap-3">
             <Key size={20} className="text-indigo-500" />
             <h3 className="text-sm font-black uppercase tracking-widest">{t('Credential Update')}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input
                  type="password"
                  placeholder={t('Current password')}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input
                  type="password"
                  placeholder={t('New password')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input
                  type="password"
                  placeholder={t('Confirm password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <PasswordStrength password={newPassword} />

            {passwordMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest text-center">
                {passwordMessage}
              </div>
            )}

            <div className="flex gap-3">
               <button 
                 type="submit"
                 className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
               >
                 {t('Apply Changes')}
               </button>
               <button 
                 type="button"
                 onClick={handleReset}
                 className="px-8 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
               >
                 {t('Reset')}
               </button>
            </div>
          </form>

          <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
             <div className="flex items-center gap-2 text-indigo-500">
               <Info size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">{t('Security Tips')}</span>
             </div>
             <p className="text-xs text-gray-400 font-medium leading-relaxed">
               {t('Use at least 12 characters with a mix of letters, numbers and special symbols for maximum entropy.')}
             </p>
          </div>
        </div>

        {/* Security Modules */}
        <div className="space-y-6">
           {/* 2FA Card */}
           <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Fingerprint size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">{t('Biometric/2FA')}</h3>
              <p className="text-xs text-gray-400 font-medium">{t('Add an extra layer of protection using your hardware device.')}</p>
              <button className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all hover:text-white">
                {t('Enable Protection')}
              </button>
           </div>

           {/* Sessions Card */}
           <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Smartphone size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">{t('Device Matrix')}</h3>
              <p className="text-xs text-gray-400 font-medium">{t('Manage all authenticated hardware currently accessing your data.')}</p>
              <button className="w-full py-3 rounded-xl bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all hover:text-white">
                {t('Scan Matrix')}
              </button>
           </div>

           {/* Integrity Score */}
           <div className="p-8 rounded-[2.5rem] bg-black text-white space-y-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-black">88%</span>
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">{t('Integrity Score')}</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{t('Your digital signature is highly secure and properly encrypted.')}</p>
              </div>
           </div>
        </div>

      </div>
    </motion.section>
  );
});

Security.displayName = 'Security';
export default Security;
