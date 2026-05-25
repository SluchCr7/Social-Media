'use client';

import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import {
  User,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Palette,
  Globe,
  Bell,
  Users,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SettingsLayout, SettingsSidebar } from '@/app/Component/Setting/SettingsComponents';

// Lazy loaded Tab Panels
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

// Define the 5 logical settings sections
const SECTIONS = [
  {
    title: 'Personal Profile',
    tabs: [
      { id: 'profile', label: 'Profile', lucideIcon: User },
      { id: 'account', label: 'Account', lucideIcon: Settings },
    ]
  },
  {
    title: 'Security & Privacy',
    tabs: [
      { id: 'security', label: 'Security', lucideIcon: ShieldCheck },
      { id: 'privacy', label: 'Privacy', lucideIcon: ShieldAlert },
      { id: 'history', label: 'Login History', lucideIcon: Clock },
    ]
  },
  {
    title: 'Preferences',
    tabs: [
      { id: 'appearance', label: 'Appearance', lucideIcon: Palette },
      { id: 'language', label: 'Language', lucideIcon: Globe },
      { id: 'notifications', label: 'Notifications', lucideIcon: Bell },
    ]
  },
  {
    title: 'Interactions',
    tabs: [
      { id: 'communities', label: 'Communities', lucideIcon: Users },
    ]
  },
  {
    title: 'Support',
    tabs: [
      { id: 'help', label: 'Help', lucideIcon: HelpCircle },
    ]
  }
];

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
  
  // Search query in sidebar
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state for mobile responsive subpage drilldown
  const [isMobileSubpageActive, setIsMobileSubpageActive] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  // Destructive deletion states
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false);

  // Sync state if user verification changes
  React.useEffect(() => {
    if (user?.isAccountWithPremiumVerify !== undefined) {
      setIsVerified(user.isAccountWithPremiumVerify);
    }
  }, [user?.isAccountWithPremiumVerify]);

  // Tab Selection
  const handleTabSelect = useCallback((tabId) => {
    setActiveTab(tabId);
    setIsMobileSubpageActive(true);
  }, [setActiveTab]);

  const handleMobileBack = useCallback(() => {
    setIsMobileSubpageActive(false);
  }, []);

  // Password Submit handler
  const submitPassword = useCallback(
    (e) => {
      e.preventDefault();
      const result = onChangePassword(oldPassword, newPassword, confirmPassword);
      if (result?.error) {
        setPasswordMessage(result.error);
      } else {
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

  // Get active tab label for header title display
  const activeTabLabel = useMemo(() => {
    for (const sec of SECTIONS) {
      const found = sec.tabs.find(tb => tb.id === activeTab);
      if (found) return t(found.label);
    }
    return t(activeTab);
  }, [activeTab, t]);

  // Sidebar element
  const sidebar = (
    <SettingsSidebar
      sections={SECTIONS}
      activeTab={activeTab}
      onTabSelect={handleTabSelect}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      user={user}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );

  return (
    <SettingsLayout
      sidebar={sidebar}
      isMobileSubpageActive={isMobileSubpageActive}
      onMobileBack={handleMobileBack}
      activeTabLabel={activeTabLabel}
    >
      <Suspense
        fallback={
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-[3px] border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 animate-pulse select-none">
              Loading Component...
            </p>
          </div>
        }
      >
        {activeTab === 'appearance' && (
          <AppearanceTab
            user={user}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
          />
        )}
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
        {activeTab === 'profile' && (
          <UpdateProfile
            user={user}
          />
        )}
        {activeTab === 'language' && (
          <LanguageTab
            language={language}
            handleLanguageChange={handleLanguageChange}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab
            loginHistory={loginHistory}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationTab
            user={user}
            onToggleNotificationBlock={onToggleNotificationBlock}
          />
        )}
        {activeTab === 'communities' && (
          <CommunityTab
            user={user}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacyTab
            user={user}
            onTogglePrivate={onTogglePrivate}
            onToggleShowOnlineStatus={onToggleShowOnlineStatus}
          />
        )}
        {activeTab === 'help' && (
          <HelpTab
          />
        )}
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
      </Suspense>
    </SettingsLayout>
  );
}

export default React.memo(SettingsView);
