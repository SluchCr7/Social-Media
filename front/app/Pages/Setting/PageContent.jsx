'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from '@/app/redux/hooks';
import { useAuth } from '@/app/redux/hooks';
import { useUser } from '@/app/redux/hooks';
import { useAdmin } from '@/app/redux/hooks';
import { getPasswordStrength } from '@/app/utils/getPasswordStrength';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslate } from '@/app/redux/hooks';
import SettingsView from './Design';
import i18n from '@/app/i18n'; // ✅ تأكد من صحة المسار

export default function SettingsContainer() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { makeAccountPremiumVerify } = useAdmin();
  const {
    deleteAccount,
    togglePrivateAccount,
    updatePassword,
    toggleBlockNotification,
    toggleShowOnlineStatus,
  } = useUser();
  const { userData } = useGetData(user?._id);
  const { language, handleLanguageChange } = useTranslate();

  const [activeTab, setActiveTab] = useState('appearance');

  const handlePasswordSubmit = useCallback(
    (oldPassword, newPassword, confirmPassword) => {
      if (newPassword !== confirmPassword) {
        return { error: i18n.t('Passwords do not match') };
      }

      const { score } = getPasswordStrength(newPassword);
      if (score < 2) {
        return { error: i18n.t('Choose a stronger password') };
      }

      updatePassword({ oldPassword, newPassword });
      return { success: true };
    },
    [updatePassword]
  );

  const handleDeleteAccount = useCallback(() => {
    if (user?._id) deleteAccount();
  }, [user?._id, deleteAccount]);

  const handleMakePremiumVerify = useCallback(
    (v) => makeAccountPremiumVerify(v),
    [makeAccountPremiumVerify]
  );

  const handleTogglePrivate = useCallback(
    (v) => togglePrivateAccount(v),
    [togglePrivateAccount]
  );

  const handleToggleNotificationBlock = useCallback(
    (blockedUser) => {
      if (blockedUser?._id) toggleBlockNotification(blockedUser._id);
    },
    [toggleBlockNotification]
  );

  const handleToggleShowOnlineStatus = useCallback(
    () => toggleShowOnlineStatus(),
    [toggleShowOnlineStatus]
  );

  const loginHistory = useMemo(() => userData?.loginHistory || [], [userData]);

  return (
    <SettingsView
      user={userData}
      theme={theme}
      darkMode={theme === 'dark'}
      toggleTheme={toggleTheme}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      loginHistory={loginHistory}
      onChangePassword={handlePasswordSubmit}
      onDeleteAccount={handleDeleteAccount}
      onMakePremiumVerify={handleMakePremiumVerify}
      onTogglePrivate={handleTogglePrivate}
      language={language}
      handleLanguageChange={handleLanguageChange}
      onToggleNotificationBlock={handleToggleNotificationBlock}
      onToggleShowOnlineStatus={handleToggleShowOnlineStatus}
    />
  );
}
