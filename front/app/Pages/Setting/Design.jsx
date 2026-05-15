'use client';

import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Command,
  Settings,
  ShieldCheck,
  User,
  Globe,
  Clock,
  Bell,
  Users,
  Palette,
  Search,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Moon,
  Sun,
  LayoutGrid
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TABS } from '@/app/utils/Data';
import { Avatar } from '@/app/Component/ui/Avatar';

// Lazy Loading
const AppearanceTab = lazy(() => import('./Tabs/Appearance'));
const Security = lazy(() => import('./Tabs/Security'));
const AccountTab = lazy(() => import('./Tabs/AccountTab'));
const LanguageTab = lazy(() => import('./Tabs/LanguageTab'));
const HistoryTab = lazy(() => import('./Tabs/HistoryTab'));
const UpdateProfile = lazy(() => import('@/app/Component/AddandUpdateMenus/UpdateProfile'));
const NotificationTab = lazy(() => import('./Tabs/NotificationTab'));
const CommunityTab = lazy(() => import('./Tabs/CommunityTab'));
const PrivacyTab = lazy(() => import('./Tabs/PrivacyTab'));
const HelpTab = lazy(() => import('./Tabs/HelpTab'));

const TAB_ICONS = {
  appearance: Palette,
  security: ShieldCheck,
  profile: User,
  language: Globe,
  history: Clock,
  notifications: Bell,
  communities: Users,
  account: Settings,
  privacy: ShieldAlert,
  help: HelpCircle,
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
  onToggleNotificationBlock,
  onToggleShowOnlineStatus
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false);

  const filteredTabs = useMemo(() => {
    return TABS.filter(tab =>
      t(tab.label).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, t]);

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

  return (
    <div className="h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col md:flex-row overflow-hidden font-cairo">
      
      {/* --- Sidebar: Immersive Navigation --- */}
      <aside className="hidden md:flex w-72 flex-col border-r border-gray-100 dark:border-threads-border bg-white dark:bg-black z-50 h-full">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Command size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">{t('Console')}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v2.0.4 - Settings</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('Search settings...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{t('General')}</p>
          {filteredTabs.map((tab) => {
            const Icon = TAB_ICONS[tab.id] || Settings;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive ? 'bg-gray-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-indigo-500/10 text-indigo-500' : 'bg-transparent text-gray-400'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-[13px] font-bold ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                    {t(tab.label)}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-40" />}
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-100 dark:border-threads-border">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-white/5">
             <Avatar src={user?.profilePhoto?.url} size="sm" />
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold truncate">{user?.username}</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">@{user?.profileName}</p>
             </div>
             <button 
               onClick={toggleTheme}
               className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all"
             >
               {darkMode ? <Sun size={16} /> : <Moon size={16} />}
             </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content: Dynamic Section --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-gray-100 dark:border-threads-border bg-white/80 dark:bg-black/80 backdrop-blur-xl z-40 shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
               <LayoutGrid size={20} />
             </div>
             <h1 className="text-lg font-black tracking-tight uppercase">{t(activeTab)}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live System
             </div>
             <div className="w-px h-6 bg-gray-100 dark:border-threads-border" />
             <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
               <Sparkles size={20} />
             </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16 pb-32">
            <AnimatePresence mode="wait">
              <Suspense
                fallback={
                  <div className="py-40 flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Initializing Interface...</p>
                  </div>
                }
              >
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="rounded-[2.5rem] bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-2xl shadow-black/5 p-8 md:p-12">
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
                    {activeTab === 'privacy' && (
                      <PrivacyTab
                        user={user}
                        onTogglePrivate={onTogglePrivate}
                        onToggleShowOnlineStatus={onToggleShowOnlineStatus}
                      />
                    )}
                    {activeTab === 'help' && <HelpTab />}
                    {activeTab === 'account' && (
                      <AccountTab
                        user={user}
                        isVerified={isVerified}
                        setIsVerified={setIsVerified}
                        onMakePremiumVerify={onMakePremiumVerify}
                        showConfirmDelete={showConfirmDelete}
                        setShowConfirmDelete={setShowConfirmDelete}
                        onTogglePrivate={onTogglePrivate}
                        onToggleShowOnlineStatus={onToggleShowOnlineStatus}
                        handleDelete={handleDelete}
                      />
                    )}
                  </div>
                </motion.div>
              </Suspense>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default React.memo(SettingsView);
