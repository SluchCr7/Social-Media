'use client'
import React, { useState } from 'react'
import { useTheme } from '@/app/Context/ThemeContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useUser } from '@/app/Context/UserContext'
import { useAdmin } from '@/app/Context/UserAdminContext'
import { getPasswordStrength } from '@/app/utils/getPasswordStrength'
import SettingsView from './Design'
import { useGetData } from '@/app/Custome/useGetData'

export default function SettingsContainer() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { deleteUser ,makeAccountPremiumVerify} = useAdmin()
  const { togglePrivateAccount, updatePassword } = useUser()

  const [activeTab, setActiveTab] = useState('appearance')
  const [loginHistory, setLoginHistory] = useState([])
  const {userData} = useGetData(user?._id)
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

  return (
    <SettingsView
      user={user}
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
    />
  )
}
