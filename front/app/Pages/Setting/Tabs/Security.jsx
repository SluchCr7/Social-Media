'use client';
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
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

  // ✅ تحسين: استخدم useCallback لتثبيت الدوال
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
      transition={{ duration: 0.28 }}
      className="p-6 rounded-2xl w-full bg-gradient-to-r from-white/70 to-blue-50 dark:from-gray-900/70 dark:to-gray-900/40 border shadow-sm"
    >
      {/* 🔐 العنوان */}
      <header className="flex items-center gap-4 mb-5">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md">
          <FaLock size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('Security')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('Manage password, two-factor and account safety.')}
          </p>
        </div>
      </header>

      {/* 🧩 نموذج تغيير كلمة المرور */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="password"
          placeholder={t('Current password')}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />

        <input
          type="password"
          placeholder={t('New password')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />

        <input
          type="password"
          placeholder={t('Confirm new password')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />

        {/* مكون قوة كلمة المرور */}
        <PasswordStrength password={newPassword} />

        {/* الأزرار */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium shadow hover:opacity-90 transition"
          >
            {t('Update password')}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {t('Reset')}
          </button>
        </div>

        {passwordMessage && (
          <p className="text-sm text-red-500 mt-2">{passwordMessage}</p>
        )}
      </form>

      {/* 🔒 قسم المصادقة الثنائية */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {t('Two-factor Authentication')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Add an extra layer of protection to your account.')}
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition">
            {t('Manage')}
          </button>
        </div>
      </div>
    </motion.section>
  );
});

Security.displayName = 'Security';
export default Security;
