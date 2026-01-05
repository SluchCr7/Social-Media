'use client';

import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles,
  HiCommandLine,
  HiCog6Tooth,
  HiShieldCheck,
  HiUser,
  HiGlobeAlt,
  HiClock,
  HiBell,
  HiUserGroup,
  HiPaintBrush
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { TABS } from '@/app/utils/Data';
import MobileBottomNav from '@/app/Component/Setting/MobileBottomNav';

// Lazy Loading
const AppearanceTab = lazy(() => import('./Tabs/Apperance'));
const Security = lazy(() => import('./Tabs/Security'));
const AccountTab = lazy(() => import('./Tabs/AccountTab'));
const LanguageTab = lazy(() => import('./Tabs/LanguageTab'));
const HistoryTab = lazy(() => import('./Tabs/HistoryTab'));
const UpdateProfile = lazy(() => import('@/app/Component/AddandUpdateMenus/UpdateProfile'));
const NotificationTab = lazy(() => import('./Tabs/NotificationTab'));
const CommunityTab = lazy(() => import('./Tabs/CommunityTab'));

// Icon mapping for tabs
const TAB_ICONS = {
  appearance: HiPaintBrush,
  security: HiShieldCheck,
  profile: HiUser,
  language: HiGlobeAlt,
  history: HiClock,
  notifications: HiBell,
  communities: HiUserGroup,
  account: HiCog6Tooth,
};

function SettingsView({
  user = {},
  theme,
  darkMode,
  toggleTheme,
  activeTab,
  setActiveTab,
  onChangePassword,
  onDeleteAccount,
  onTogglePrivate,
  onMakePremiumVerify,
  loginHistory = [],
  language,
  handleLanguageChange,
  onToggleNotificationBlock
}) {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false);

  const submitPassword = useCallback(
    (e) => {
      e.preventDefault();
      const result = onChangePassword(oldPassword, newPassword, confirmPassword);
      if (result?.error) setPasswordMessage(result.error);
      else {
        setPasswordMessage('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    },
    [onChangePassword, oldPassword, newPassword, confirmPassword]
  );

  const handleDelete = useCallback(() => {
    onDeleteAccount();
    setShowConfirmDelete(false);
  }, [onDeleteAccount]);

  const username = useMemo(() => user?.username || 'username', [user]);
  const displayName = useMemo(() => user?.profileName || user?.username || t('User'), [user, t]);
  const userInitial = useMemo(() => displayName.charAt(0).toUpperCase(), [displayName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 dark:from-[#050505] dark:via-[#0A0A14] dark:to-[#050510] pb-24 md:pb-8 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="flex gap-8 w-full max-w-[1600px] mx-auto">

          {/* 🎯 Enhanced Sidebar */}
          <aside className="hidden md:block w-80 sticky top-8 h-[calc(100vh-64px)] self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-[2rem] backdrop-blur-2xl bg-white/80 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 flex flex-col overflow-hidden"
            >
              {/* Gradient Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 border-b border-gray-200/50 dark:border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />

                {/* User Info */}
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/30 ring-4 ring-white/20 dark:ring-white/10">
                      {userInitial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-gray-900 dark:text-white truncate">{displayName}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">@{username}</div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                {TABS.map((tab) => {
                  const Icon = TAB_ICONS[tab.id] || HiCog6Tooth;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={tab.view === false}
                      className={`group relative flex items-center gap-4 w-full p-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab.view === false ? 'pointer-events-none opacity-30' : ''
                        } ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      {/* Background Glow for Active */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-xl opacity-50"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      <div className="relative text-xl">
                        <Icon />
                      </div>
                      <div className="relative flex-1 text-left text-[10px]">{t(tab.label)}</div>

                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 rounded-full bg-white"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Theme Switch Footer */}
              <div className="p-6 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <HiSparkles className="w-3 h-3" />
                  {t('Appearance')}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
                >
                  <span className="text-sm font-bold">{darkMode ? t('Dark Mode') : t('Light Mode')}</span>
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {darkMode ? '🌙' : '☀️'}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </aside>

          {/* ⚙️ Main Content */}
          <main className="flex-1 w-full">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 pb-10 border-b border-gray-200/50 dark:border-white/5"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <HiCommandLine className="w-3 h-3 animate-pulse" />
                    {t('Configuration Active')}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
                    {t('Settings')} <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('Console')}</span>
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                    {t('Manage your account, privacy and appearance')}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('Signed in as')}</div>
                  <div className="font-black text-gray-900 dark:text-white">@{username}</div>
                </div>
              </div>
            </motion.div>

            {/* Tabs Content with Enhanced Container */}
            <AnimatePresence mode="wait">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                  </div>
                }
              >
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Content Container with Gradient Border */}
                  <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20">
                    <div className="rounded-[2rem] bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl">
                      {activeTab === 'appearance' && <AppearanceTab user={user} darkMode={darkMode} toggleTheme={toggleTheme} />}
                      {activeTab === 'security' && (
                        <Security
                          oldPassword={oldPassword}
                          setOldPassword={setOldPassword}
                          newPassword={newPassword}
                          setNewPassword={setNewPassword}
                          confirmPassword={confirmPassword}
                          setConfirmPassword={setConfirmPassword}
                          passwordMessage={passwordMessage}
                          setPasswordMessage={setPasswordMessage}
                          submitPassword={submitPassword}
                        />
                      )}
                      {activeTab === 'profile' && <UpdateProfile user={user} />}
                      {activeTab === 'language' && <LanguageTab language={language} handleLanguageChange={handleLanguageChange} />}
                      {activeTab === 'history' && <HistoryTab loginHistory={loginHistory} />}
                      {activeTab === 'notifications' && <NotificationTab user={user} onToggleNotificationBlock={onToggleNotificationBlock} />}
                      {activeTab === 'communities' && <CommunityTab user={user} />}
                      {activeTab === 'account' && (
                        <AccountTab
                          user={user}
                          isVerified={isVerified}
                          setIsVerified={setIsVerified}
                          onMakePremiumVerify={onMakePremiumVerify}
                          showConfirmDelete={showConfirmDelete}
                          setShowConfirmDelete={setShowConfirmDelete}
                          handleDelete={handleDelete}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </Suspense>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* 📱 Mobile Bottom Nav */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default React.memo(SettingsView);
