'use client'
import React, {
  useState,
  useCallback,
  useMemo,
  Suspense,
  lazy
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

import { TABS, DEFAULT_COLORS } from '@/app/utils/Data'
import MobileBottomNav from '@/app/Component/Setting/MobileBottomNav'

// ✅ Lazy Loading لكل التبويبات لتقليل حجم الصفحة الأولي
const AppearanceTab = lazy(() => import('./Tabs/Apperance'))
const Security = lazy(() => import('./Tabs/Security'))
const AccountTab = lazy(() => import('./Tabs/AccountTab'))
const LanguageTab = lazy(() => import('./Tabs/LanguageTab'))
const HistoryTab = lazy(() => import('./Tabs/HistoryTab'))
const UpdateProfile = lazy(() => import('@/app/Component/AddandUpdateMenus/UpdateProfile'))
const NotificationTab = lazy(() => import('./Tabs/NotificationTab'))
const CommunityTab = lazy(() => import('./Tabs/CommunityTab'))

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
  const { t } = useTranslation()

  // ✅ استخدم useState فقط للحالات الضرورية
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false)

  // ✅ استخدم useCallback لتثبيت الدوال بين الـ re-renders
  const submitPassword = useCallback(
    (e) => {
      e.preventDefault()
      const result = onChangePassword(oldPassword, newPassword, confirmPassword)
      if (result?.error) setPasswordMessage(result.error)
      else {
        setPasswordMessage('')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    },
    [onChangePassword, oldPassword, newPassword, confirmPassword]
  )

  const handleDelete = useCallback(() => {
    onDeleteAccount()
    setShowConfirmDelete(false)
  }, [onDeleteAccount])

  // ✅ تهيئة البيانات الثابتة بمساعدة useMemo لتجنب إعادة الإنشاء
  const username = useMemo(() => user?.username || 'username', [user])
  const displayName = useMemo(() => user?.profileName || user?.username || t('User'), [user, t])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors pb-24 md:pb-8 w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        <div className="flex gap-6 w-full">
          {/* 🧭 Sidebar */}
          <aside className="hidden md:block w-72 sticky top-8 h-[calc(100vh-64px)] self-start">
            <div className="h-full p-4 rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border dark:border-gray-800 shadow-lg flex flex-col justify-between">
              <div>
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-xs text-gray-500">@{username}</div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <nav className="space-y-2 mt-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors duration-200',
                        tab.view === false && 'pointer-events-none opacity-50',
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

              {/* Theme Switch */}
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

          {/* ⚙️ Main Content */}
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
                <div className="font-medium">@{username}</div>
              </div>
            </div>

            {/* Tabs Content with Suspense */}
            <AnimatePresence mode="wait">
              <Suspense fallback={<div className="text-center p-8">{t('Loading...')}</div>}>
                {activeTab === 'appearance' && (
                  <AppearanceTab user={user} darkMode={darkMode} toggleTheme={toggleTheme} />
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

                {activeTab === 'profile' && <UpdateProfile user={user} />}
                {activeTab === 'language' && (
                  <LanguageTab language={language} handleLanguageChange={handleLanguageChange} />
                )}
                {activeTab === 'history' && <HistoryTab loginHistory={loginHistory} />}
                {activeTab === 'notifications' && (
                  <NotificationTab user={user} onToggleNotificationBlock={onToggleNotificationBlock} />
                )}
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
              </Suspense>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* 📱 Bottom Navigation for Mobile */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default React.memo(SettingsView)
