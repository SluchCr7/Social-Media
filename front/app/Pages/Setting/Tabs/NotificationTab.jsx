'use client';
import React, { memo, useCallback } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const NotificationTab = memo(({ user, onToggleNotificationBlock, loading = false }) => {
  const { t } = useTranslation();
  const blockedUsers = user?.BlockedNotificationFromUsers || [];

  // 🔁 تحسين: استخدام useCallback لتثبيت الدالة
  const handleUnblock = useCallback(
    (userId) => {
      if (!loading && onToggleNotificationBlock) {
        onToggleNotificationBlock(userId);
      }
    },
    [onToggleNotificationBlock, loading]
  );

  return (
    <section className="space-y-6">
      {/* 🧭 العنوان الرئيسي */}
      <div className="p-6 bg-white/70 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('Notification Settings')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('Manage users you have muted or blocked notifications from.')}
        </p>
      </div>

      {/* 📋 قائمة المستخدمين المحظورين */}
      <div className="bg-white/60 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t('Muted Users (Blocked Notifications)')}
        </h3>

        {blockedUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {blockedUsers.map((blockedUser) => (
              <li
                key={blockedUser._id}
                className="flex items-center justify-between py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-xl px-2 transition"
              >
                {/* 👤 بيانات المستخدم */}
                <div className="flex items-center gap-3">
                  <Image
                    width={48}
                    height={48}
                    src={blockedUser?.profilePhoto?.url || '/default-avatar.png'}
                    alt={blockedUser?.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-300 dark:border-gray-700"
                  />

                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {blockedUser?.profileName || blockedUser?.username || t('No Name')}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      @{blockedUser.username}
                    </span>

                    {blockedUser?.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 max-w-xs hidden sm:block">
                        {blockedUser.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* 🚫 زر إلغاء الحظر */}
                <button
                  onClick={() => handleUnblock(blockedUser._id)}
                  disabled={loading}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition duration-200
                    ${
                      loading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-[1.03]'
                    }
                    bg-red-600/10 text-red-600 dark:bg-red-400/10 dark:text-red-400
                    hover:bg-red-600/20 dark:hover:bg-red-400/20`}
                >
                  {loading ? t('Unmuting...') : t('Unblock')}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            {t('You currently have no users muted for notifications.')}
          </p>
        )}
      </div>
    </section>
  );
});

NotificationTab.displayName = 'NotificationTab';
export default NotificationTab;
