'use client';
import React, { memo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiBell, HiBellSlash, HiUserMinus, HiSparkles } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

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
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl">
            <HiBell className="w-6 h-6" />
          </div>
          {blockedUsers.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-black">
              {blockedUsers.length}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('Notification Settings')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Manage users you have muted or blocked notifications from.')}
          </p>
        </div>
      </div>

      {/* Muted Users List */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <HiBellSlash className="w-5 h-5" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">
            {t('Muted Users (Blocked Notifications)')}
          </h3>
        </div>

        {blockedUsers.length > 0 ? (
          <div className="space-y-3">
            {blockedUsers.map((blockedUser, index) => (
              <motion.div
                key={blockedUser._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all group"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Image
                      width={56}
                      height={56}
                      src={blockedUser?.profilePhoto?.url || '/default-avatar.png'}
                      alt={blockedUser?.username || 'User'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-500 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <HiBellSlash className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-white truncate">
                      {blockedUser?.profileName || blockedUser?.username || t('No Name')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{blockedUser.username}
                    </div>
                    {blockedUser?.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 hidden sm:block">
                        {blockedUser.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Unblock Button */}
                <motion.button
                  onClick={() => handleUnblock(blockedUser._id)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${loading
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white'
                    }`}
                >
                  <HiUserMinus className="w-4 h-4" />
                  {loading ? t('Unmuting...') : t('Unblock')}
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <HiBell className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <HiSparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <h4 className="font-black text-gray-900 dark:text-white text-lg mb-2">{t('All Clear!')}</h4>
            <p className="text-center text-gray-500 dark:text-gray-400 max-w-md font-medium">
              {t('You currently have no users muted for notifications. You\'ll receive notifications from everyone you follow.')}
            </p>
          </div>
        )}
      </motion.div>

      {/* Info Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-200/50 dark:border-blue-500/20"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0">
            <HiBell className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              {t('About Notification Blocking')}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('When you block notifications from a user, you won\'t receive any notifications about their activity, but you can still see their posts and interact with them normally.')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
});

NotificationTab.displayName = 'NotificationTab';
export default NotificationTab;
