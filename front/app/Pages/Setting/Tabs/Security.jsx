'use client';
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiLockClosed, HiKey, HiFingerPrint, HiDevicePhoneMobile } from 'react-icons/hi2';
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
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 text-white shadow-xl">
            <HiShieldCheck className="w-6 h-6" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('Security')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Manage password, two-factor and account safety.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Change Password Form - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <HiKey className="w-5 h-5" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Change Password')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('Current password')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiLockClosed className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('New password')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiKey className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('Confirm new password')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Strength */}
              <PasswordStrength password={newPassword} />

              {/* Error Message */}
              {passwordMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium"
                >
                  {passwordMessage}
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
                >
                  {t('Update password')}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {t('Reset')}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Password Tips */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-200/50 dark:border-blue-500/20"
          >
            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">{t('Password Tips')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{t('Use at least 8 characters')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{t('Include uppercase and lowercase letters')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{t('Add numbers and special characters')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{t('Avoid common words and patterns')}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Security Features - Right Column */}
        <div className="space-y-6">

          {/* Two-Factor Authentication */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <HiFingerPrint className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              {t('Two-factor Authentication')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
              {t('Add an extra layer of protection to your account.')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-sm hover:bg-green-500/20 transition-all"
            >
              {t('Enable 2FA')}
            </motion.button>
          </motion.div>

          {/* Active Sessions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <HiDevicePhoneMobile className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              {t('Active Sessions')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
              {t('Manage devices where you\'re logged in.')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-sm hover:bg-purple-500/20 transition-all"
            >
              {t('View Sessions')}
            </motion.button>
          </motion.div>

          {/* Security Score */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/5 dark:to-orange-500/5 border border-yellow-200/50 dark:border-yellow-500/20"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-black text-2xl mb-3 shadow-lg">
                85
              </div>
              <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">
                {t('Security Score')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t('Your account is well protected')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

Security.displayName = 'Security';
export default Security;
