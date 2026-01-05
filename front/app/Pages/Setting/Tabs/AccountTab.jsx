'use client';
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUserCircle, HiTrash, HiCheckBadge, HiExclamationTriangle, HiLockClosed, HiEye } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch';

const AccountTab = React.memo(({
  user,
  isVerified,
  setIsVerified,
  onMakePremiumVerify,
  showConfirmDelete,
  setShowConfirmDelete,
  handleDelete
}) => {
  const { t } = useTranslation();

  const handleVerifyToggle = useCallback(
    (v) => {
      setIsVerified(v);
      onMakePremiumVerify(v);
    },
    [setIsVerified, onMakePremiumVerify]
  );

  const confirmDelete = useCallback(() => {
    setShowConfirmDelete(true);
  }, [setShowConfirmDelete]);

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
  }, [setShowConfirmDelete]);

  return (
    <motion.section
      key="account"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white shadow-xl">
            <HiUserCircle className="w-6 h-6" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('Account')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Manage privacy, verification and account actions.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Premium Verification */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                <HiCheckBadge className="w-6 h-6" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Premium Verified')}</h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {t('Get a verified badge and priority support.')}
              </p>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVerified ? 'bg-yellow-500/20' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    <HiCheckBadge className={`w-6 h-6 ${isVerified ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {isVerified ? t('Verified') : t('Not Verified')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isVerified ? t('Premium member') : t('Standard account')}
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={isVerified}
                  onChange={handleVerifyToggle}
                  onColor="bg-yellow-400"
                />
              </div>

              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-start gap-3">
                    <HiCheckBadge className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                      {t('You have access to premium features including priority support, exclusive badges, and advanced analytics.')}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HiLockClosed className="w-6 h-6" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('Privacy')}</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HiEye className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{t('Private Account')}</span>
                </div>
                <ToggleSwitch
                  checked={user?.isPrivate || false}
                  onChange={() => { }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {t('Only approved followers can see your posts')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HiUserCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{t('Show Activity Status')}</span>
                </div>
                <ToggleSwitch
                  checked={true}
                  onChange={() => { }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {t('Let others see when you\'re active')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone - Full Width */}
        <div className="lg:col-span-2">
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/5 dark:to-rose-500/5 border-2 border-red-200/50 dark:border-red-500/20 shadow-lg overflow-hidden"
          >
            {/* Warning Pattern Background */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,currentColor_10px,currentColor_20px)] text-red-500" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <HiExclamationTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-red-600 dark:text-red-400 uppercase text-sm tracking-wider">{t('Danger zone')}</h3>
                  <p className="text-xs text-red-500/70 dark:text-red-400/70 font-medium">
                    {t('Irreversible actions - proceed with caution')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-white/50 dark:bg-white/5 border border-red-200/50 dark:border-red-500/20">
                <div className="flex-1">
                  <div className="font-black text-gray-900 dark:text-white mb-1">
                    {t('Delete account')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {t('Delete account and data permanently. This action cannot be undone.')}
                  </div>
                </div>
                <motion.button
                  onClick={confirmDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 hover:shadow-xl transition-all whitespace-nowrap"
                >
                  <HiTrash className="w-5 h-5" />
                  {t('Delete account')}
                </motion.button>
              </div>

              {/* Confirm Delete Modal */}
              <AnimatePresence>
                {showConfirmDelete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-6 p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-full bg-red-500/20">
                        <HiExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 dark:text-white mb-2">{t('Are you absolutely sure?')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t('This action cannot be undone. This will permanently delete your account and remove all your data from our servers.')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleDelete}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('Yes, delete my account')}
                      </motion.button>
                      <motion.button
                        onClick={cancelDelete}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      >
                        {t('Cancel')}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

AccountTab.displayName = 'AccountTab';

export default AccountTab;
