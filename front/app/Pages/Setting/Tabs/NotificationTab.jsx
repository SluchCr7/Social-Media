import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Info, UserMinus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';

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
      key="notifications"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="relative">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Bell size={40} />
          </div>
          {blockedUsers.length > 0 && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-white text-[10px] font-black shadow-lg">
              {blockedUsers.length}
            </div>
          )}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Notification Hub')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Manage muted signals and alerts')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Muted Users List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <BellOff size={20} className="text-indigo-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">{t('Muted Entities')}</h3>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border min-h-[300px]">
            {blockedUsers.length > 0 ? (
              <div className="space-y-4">
                {blockedUsers.map((blockedUser) => (
                  <div
                    key={blockedUser._id}
                    className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm group hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar src={blockedUser?.profilePhoto?.url} size="md" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black">{blockedUser?.profileName || blockedUser?.username || t('Unknown Entity')}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">@{blockedUser.username}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnblock(blockedUser._id)}
                      disabled={loading}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        loading
                          ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5 text-gray-400'
                          : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg hover:shadow-rose-500/20'
                      }`}
                    >
                      <UserMinus size={14} />
                      {loading ? t('Processing') : t('Unmute')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-6 text-center opacity-70">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">{t('All Clear')}</h4>
                  <p className="text-xs text-gray-400 font-medium max-w-[200px] mx-auto mt-2 leading-relaxed">
                    {t('You currently have no users muted for notifications.')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[40px]" />
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Info size={24} />
              </div>
              <h4 className="text-lg font-black uppercase tracking-tighter">
                {t('Notification Protocol')}
              </h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                {t('When you block notifications from an entity, you will not receive any signals regarding their activity. However, their content remains accessible.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

NotificationTab.displayName = 'NotificationTab';
export default NotificationTab;
