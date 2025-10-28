'use client'
import React, { useState } from 'react'
import { useTheme } from '@/app/Context/ThemeContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useUser } from '@/app/Context/UserContext'
import { useAdmin } from '@/app/Context/UserAdminContext'
import { getPasswordStrength } from '@/app/utils/getPasswordStrength'
import SettingsView from './Design'
import { useGetData } from '@/app/Custome/useGetData'
import i18n from '@/app/i18n'; // تأكد من المسار الصحيح إلى ملف i18n
import { useTranslate } from '@/app/Context/TranslateContext'
export default function SettingsContainer() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { deleteUser ,makeAccountPremiumVerify} = useAdmin()
  const { togglePrivateAccount, updatePassword ,toggleBlockNotification} = useUser()

  const [activeTab, setActiveTab] = useState('appearance')
  const { userData } = useGetData(user?._id)
  const { language, handleLanguageChange } = useTranslate();

  const handlePasswordSubmit = (oldPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    const { score } = getPasswordStrength(newPassword)
    if (score < 2) {
      return { error: 'Choose a stronger password' }
    }

    updatePassword({ newPassword })
    return { success: true }
  }

  const handleDeleteAccount = () => {
    if (user?._id) deleteUser(user._id)
  }

  const handleMakePremiumVerify = (v) => {
    makeAccountPremiumVerify(v)
  }

  const handleTogglePrivate = (v) => {
    togglePrivateAccount(v)
  }

  const handleToggleNotificationBlock = (user) => {
    toggleBlockNotification(user?._id)
  }

  return (
    <SettingsView
      user={userData}
      theme={theme}
      darkMode={theme === 'dark'}
      toggleTheme={toggleTheme}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      loginHistory={userData?.loginHistory || []}
      onChangePassword={handlePasswordSubmit}
      onDeleteAccount={handleDeleteAccount}
      onMakePremiumVerify={handleMakePremiumVerify}
      onTogglePrivate={handleTogglePrivate}
      language={language}
      handleLanguageChange={handleLanguageChange}
      onToggleNotificationBlock={handleToggleNotificationBlock}
    />
  )
}
