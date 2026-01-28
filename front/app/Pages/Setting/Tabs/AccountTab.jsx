import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUserCircle, HiTrash, HiCheckBadge, HiExclamationTriangle, HiLockClosed, HiEye, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import PrimaryToggle from '@/app/Component/Setting/PrimaryToggle';
import { useFeedback } from '@/app/Context/FeedbackContext';

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
  const { confirmAction } = useFeedback();

  const handleVerifyToggle = useCallback(
    (v) => {
      setIsVerified(v);
      onMakePremiumVerify(v);
    },
    [setIsVerified, onMakePremiumVerify]
  );

  const handleDeleteRequest = async () => {
    const isConfirmed = await confirmAction({
      title: t('Delete Account'),
      text: t('This will permanently delete your user profile and all associated data. This action cannot be undone.'),
      confirmButtonText: t('Delete My Data'),
      cancelButtonText: t('Go Back'),
      type: 'danger'
    });

    if (isConfirmed) {
      handleDelete();
    }
  };

  return (
    <motion.section
      key="account"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-10"
    >
      {/* Header */}
      <div className="flex items-center gap-5 pb-8 border-b border-gray-100 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#FF9D6C] to-[#BB4E75] text-white shadow-2xl shadow-orange-500/20">
            <HiUserCircle className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white dark:border-[#0B0F1A]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">{t('Account Governance')}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            {t('Manage your digital identity, privacy & credentials')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Premium Verification Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="group relative rounded-[2.5rem] p-8 bg-white dark:bg-[#0D1117] border border-gray-100 dark:border-white/5 shadow-xl transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-500">
              <HiCheckBadge className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{t('Status')}</span>
              <span className={`text-xs font-black uppercase ${isVerified ? 'text-amber-500' : 'text-gray-400'}`}>
                {isVerified ? t('Elite Verified') : t('Standard Index')}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('Identity Verification')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {t('Gain trust with a verification badge and priority signal rankings across the network.')}
            </p>

            <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isVerified ? 'bg-amber-400/20 text-amber-500 ring-2 ring-amber-400/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                  <HiCheckBadge className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300">{t('Verified Status')}</span>
              </div>
              <PrimaryToggle
                checked={isVerified}
                onChange={handleVerifyToggle}
                onColor="bg-amber-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy & Visibility Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative rounded-[2.5rem] p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/20 overflow-hidden"
        >
          {/* Ornamental Blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

          <div className="relative space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                <HiLockClosed className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight">{t('Privacy Control')}</h3>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <HiEye className="w-5 h-5 opacity-80" />
                    <span className="font-bold text-sm">{t('Private Account')}</span>
                  </div>
                  <PrimaryToggle
                    checked={user?.isPrivate || false}
                    onChange={() => onTogglePrivate()}
                    onColor="bg-white/30"
                  />
                </div>
                <p className="text-[11px] font-medium opacity-60">
                  {t('Restricts profile access to approved synchronization partners only.')}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <HiUserCircle className="w-5 h-5 opacity-80" />
                    <span className="font-bold text-sm">{t('Signal Pulse')}</span>
                  </div>
                  <PrimaryToggle
                    checked={user?.showOnlineStatus !== false}
                    onChange={() => onToggleShowOnlineStatus()}
                    onColor="bg-white/30"
                  />
                </div>
                <p className="text-[11px] font-medium opacity-60">
                  {t('Broadcast your activity status to allow real-time interactions.')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Summary / Linked Accounts */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-2 rounded-[2.5rem] p-8 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1 space-y-2">
            <h4 className="text-lg font-black text-gray-900 dark:text-white">{t('Account Exports')}</h4>
            <p className="text-sm text-gray-500 font-medium">
              {t('Download a copy of your personal data archive for portability and local storage.')}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-2xl bg-white dark:bg-white/10 text-gray-900 dark:text-white font-bold text-sm shadow-sm border border-gray-200 dark:border-white/10 flex items-center gap-2 hover:bg-gray-100 transition-all"
          >
            {t('Export Data')}
            <HiArrowTopRightOnSquare className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Danger Zone */}
        <div className="lg:col-span-2">
          <div className="relative rounded-[3rem] p-10 bg-red-50 dark:bg-red-500/5 border-2 border-dashed border-red-200 dark:border-red-500/20 flex flex-col items-center text-center space-y-6">
            <div className="p-5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600">
              <HiExclamationTriangle className="w-10 h-10" />
            </div>
            <div className="max-w-xl space-y-2">
              <h3 className="text-2xl font-black text-red-600">{t('The Termination Vector')}</h3>
              <p className="text-sm text-red-700/60 dark:text-red-400/60 font-medium">
                {t('Deleting your account is permanent. All posts, media, connections and data will be liquidated from our servers instantly.')}
              </p>
            </div>

            <motion.button
              onClick={handleDeleteRequest}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all"
            >
              {t('Terminate My Presence')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

AccountTab.displayName = 'AccountTab';

export default AccountTab;
