'use client';

import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMoon, HiSun, HiCog, HiSignal } from 'react-icons/hi2';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505] pb-24 md:pb-8">
      <div className="w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="flex gap-8 w-full max-w-[1600px] mx-auto">
          {/* 🎯 Sidebar */}
          <aside className="hidden md:block w-80 sticky top-8 h-[calc(100vh-64px)] self-start">
            <div className="h-full p-8 rounded-[3rem] backdrop-blur-3xl bg-white/70 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-2xl flex flex-col justify-between">
              <div>
                {/* User Info */}
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200 dark:border-white/5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-500/30">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 dark:text-white">{displayName}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">@{username}</div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <nav className="space-y-2">
                  {TABS.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={tab.view === false}
                      className={`flex items-center gap-4 w-full p-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${tab.view === false ? 'pointer-events-none opacity-30' : ''
                        } ${activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      <div className="text-xl">{tab.icon}</div>
                      <div className="flex-1 text-left text-[10px]">{t(tab.label)}</div>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Theme Switch */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{t('Appearance')}</div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
                  >
                    {darkMode ? <HiMoon className="w-6 h-6" /> : <HiSun className="w-6 h-6" />}
                  </motion.button>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{darkMode ? t('Dark Mode') : t('Light Mode')}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ⚙️ Main Content */}
          <main className="flex-1 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-10 border-b border-gray-200 dark:border-white/5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <HiSignal className="w-3 h-3 animate-pulse" />
                  {t('Configuration Active')}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
                  {t('Settings')} <span className="text-indigo-500">{t('Console')}</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t('Manage your account, privacy and appearance')}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('Signed in as')}</div>
                <div className="font-black text-gray-900 dark:text-white">@{username}</div>
              </div>
            </div>

            {/* Tabs Content */}
            <AnimatePresence mode="wait">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-20">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  </div>
                }
              >
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
