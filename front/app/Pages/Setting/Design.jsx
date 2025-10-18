'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

import { TABS, DEFAULT_COLORS } from '@/app/utils/Data'
import MobileBottomNav from '@/app/Component/Setting/MobileBottomNav'
import AppearanceTab from './Tabs/Apperance'
import Security from './Tabs/Security'
import AccountTab from './Tabs/AccountTab'
import LanguageTab from './Tabs/LanguageTab'
import HistoryTab from './Tabs/HistoryTab'

export default function SettingsView({
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
  handleLanguageChange
}) {
  const { t } = useTranslation()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [backgroundValue, setBackgroundValue] = useState(DEFAULT_COLORS[0].value)
  const [customColor, setCustomColor] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false)
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false)

  const submitPassword = (e) => {
    e.preventDefault()
    const result = onChangePassword(oldPassword, newPassword, confirmPassword)
    if (result?.error) {
      setPasswordMessage(result.error)
    } else {
      setPasswordMessage('')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const handleDelete = () => {
    onDeleteAccount()
    setShowConfirmDelete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors pb-24 md:pb-8 w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        <div className="flex gap-6 w-full">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 sticky top-8 h-[calc(100vh-64px)] self-start">
            <div className="h-full p-4 rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border dark:border-gray-800 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {(user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{user?.profileName || user?.username || t('User')}</div>
                    <div className="text-xs text-gray-500">@{user?.username || 'username'}</div>
                  </div>
                </div>

                <nav className="space-y-2 mt-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition',
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <div className="text-lg">{tab.icon}</div>
                      <div className="flex-1 text-left">{t(tab.label)}</div>
                      {activeTab === tab.id && (
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">{t('Theme')}</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md shadow hover:scale-105 transition bg-white/50 dark:bg-gray-800/50"
                  >
                    {darkMode ? <FaMoon /> : <FaSun />}
                  </button>
                  <div className="text-sm">{darkMode ? t('Dark') : t('Light')}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{t('Settings')}</h1>
                <p className="text-sm text-gray-500">
                  {t('Manage your account, privacy and appearance')}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-500">{t('Signed in as')}</div>
                <div className="font-medium">@{user?.username || 'username'}</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'appearance' && (
                <AppearanceTab darkMode={darkMode} toggleTheme={toggleTheme} />
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

              {activeTab === 'language' && (
                <LanguageTab language={language} handleLanguageChange={handleLanguageChange} />
              )}

              {activeTab === 'history' && (
                <HistoryTab loginHistory={loginHistory} />
              )}

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
            </AnimatePresence>
          </main>
        </div>
      </div>

      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
