'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  FaSun, FaMoon, FaLock, FaUserCog, FaTrashAlt, FaHistory
} from 'react-icons/fa'
import { CiChat1 } from 'react-icons/ci'
import { MdLanguage } from 'react-icons/md'
import { TABS, DEFAULT_COLORS, LANGUAGES } from '@/app/utils/Data'
import MobileBottomNav from '@/app/Component/Setting/MobileBottomNav'
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch'
import PasswordStrength from '@/app/Component/Setting/PasswordStrength'
import LanguageCard from '@/app/Component/Setting/LanguageCard'
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline'
import AppearanceTab from './Tabs/Apperance'
import Security from './Tabs/Security'
import ChatTab from './Tabs/ChatTab'
import AccountTab from './Tabs/AccountTab'

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
}) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [backgroundValue, setBackgroundValue] = useState(DEFAULT_COLORS[0].value)
  const [customColor, setCustomColor] = useState('')
  const [language, setLanguage] = useState('en')
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

  const handleBackgroundChange = (type, value) => {
    if (type === 'color') {
      setBackgroundValue(value)
    } else if (type === 'custom') {
      setBackgroundValue(value)
      setCustomColor(value)
    }
  }

  const handleDelete = () => {
    onDeleteAccount()
    setShowConfirmDelete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 sticky top-8 h-[calc(100vh-64px)] self-start">
            <div className="h-full p-4 rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border dark:border-gray-800 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {(user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{user?.profileName || user?.username || 'User'}</div>
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
                      <div className="flex-1 text-left">{tab.label}</div>
                      {activeTab === tab.id && (
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Theme</div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-md shadow hover:scale-105 transition bg-white/50 dark:bg-gray-800/50"
                  >
                    {darkMode ? <FaMoon /> : <FaSun />}
                  </button>
                  <div className="text-sm">{darkMode ? 'Dark' : 'Light'}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-gray-500">
                  Manage your account, privacy and appearance
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-500">Signed in as</div>
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

              {activeTab === 'chat' && (
                <ChatTab 
                  handleBackgroundChange={handleBackgroundChange}
                  colors={colors}
                  customColor={customColor}
                  backgroundValue={backgroundValue}
                />
              )}

              {activeTab === 'language' && (
                <motion.section
                  key="language"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg"><MdLanguage /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Language</h2>
                      <p className="text-sm text-gray-500">Select your preferred language for the UI.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LANGUAGES.map((l) => (
                      <LanguageCard key={l.code} lang={l} active={language === l.code} onClick={setLanguage} />
                    ))}
                  </div>
                </motion.section>
              )}

              {activeTab === 'history' && (
                <motion.section
                  key="history"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg"><FaHistory /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Login History</h2>
                      <p className="text-sm text-gray-500">Recent sign-ins and devices.</p>
                    </div>
                  </div>

                  <LoginHistoryTimeline items={loginHistory} />
                </motion.section>
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
