'use client';
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiDevicePhoneMobile, HiMapPin } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const HistoryTab = memo(({ loginHistory }) => {
  const { t } = useTranslation();

  return (
    <motion.section
      key="history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white shadow-xl">
            <HiClock className="w-6 h-6" />
          </div>
          {loginHistory?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-black">
              {loginHistory.length}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Login History")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t("Recent sign-ins and devices.")}
          </p>
        </div>
      </div>

      {/* Login History Timeline */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5 shadow-lg"
      >
        <LoginHistoryTimeline items={loginHistory} />
      </motion.div>

      {/* Security Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-200/50 dark:border-blue-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <HiDevicePhoneMobile className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                {t('Recognize Devices')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t('Check if all devices are familiar to you')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/5 dark:to-pink-500/5 border border-purple-200/50 dark:border-purple-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
              <HiMapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                {t('Verify Locations')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t('Ensure login locations match your activity')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/5 dark:to-emerald-500/5 border border-green-200/50 dark:border-green-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex-shrink-0">
              <HiClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                {t('Monitor Activity')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t('Review recent logins regularly for security')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});

HistoryTab.displayName = 'HistoryTab';
export default HistoryTab;