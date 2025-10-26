'use client';
import React from 'react';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const NotificationTab = ({ user, onToggleNotificationBlock, loading = false }) => {
  const { t } = useTranslation();
  const blockedUsers = user?.BlockedNotificationFromUsers || [];

  const handleUnblock = (userId) => {
    if (onToggleNotificationBlock) {
      onToggleNotificationBlock(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Head section */}
      <div className="p-5 sm:p-6 bg-lightMode-menu/60 dark:bg-gray-900/40 rounded-2xl border border-lightMode-text2/10 dark:border-gray-700/40 shadow-lg">
        <h2 className="text-xl font-bold text-lightMode-text dark:text-darkMode-text mb-2">{t('Notification Settings')}</h2>
        <p className="text-sm text-lightMode-text2 dark:text-gray-400">
          {t('Manage users you have muted or blocked notifications from.')}
        </p>
      </div>

      {/* Blocked Users List */}
      <div className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-4">
        <h3 className="text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t('Muted Users (Blocked Notifications)')}</h3>
        
        {blockedUsers.length > 0 ? (
          <ul className="divide-y divide-lightMode-text2/10 dark:divide-gray-700/40">
            {blockedUsers.map((blockedUser) => (
              <li key={blockedUser._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {/* صورة البروفايل */}
                  <Image
                    width={48}
                    height={48}
                    src={blockedUser?.profilePhoto?.url || "/default-avatar.png"}
                    alt={blockedUser?.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div className="flex flex-col">
                    {/* الاسم المعروض */}
                    <span className="font-semibold text-lightMode-text dark:text-white">
                      {blockedUser?.profileName || blockedUser?.username || t('No Name')}
                    </span>
                    {/* اسم المستخدم */}
                    <span className="text-sm text-lightMode-text2 dark:text-gray-400">
                      @{blockedUser.username}
                    </span>
                    {/* تفاصيل إضافية (الوصف/Bio) */}
                    {blockedUser?.description && (
                       <span className="text-xs text-lightMode-text2 dark:text-gray-500 line-clamp-1 mt-1 max-w-xs hidden sm:block">
                          {blockedUser.description}
                       </span>
                    )}
                  </div>
                </div>
                
                {/* زر إلغاء الحظر */}
                <button
                  onClick={() => handleUnblock(blockedUser._id)}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg font-medium transition duration-200
                             bg-red-600/10 text-red-600 dark:bg-red-400/10 dark:text-red-400
                             hover:bg-red-600/20 dark:hover:bg-red-400/20 disabled:opacity-50"
                >
                  {loading ? t('Unmuting...') : t('Unblock')}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lightMode-text2 dark:text-gray-500 p-4">
            {t('You currently have no users muted for notifications.')}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationTab;