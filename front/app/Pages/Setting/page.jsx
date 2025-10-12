'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  FaSun,
  FaMoon,
  FaLock,
  FaUserCog,
  FaTrashAlt,
  FaHistory,
} from 'react-icons/fa'
import { CiChat1 } from 'react-icons/ci'
import { MdLanguage } from 'react-icons/md'
import { useTheme } from '@/app/Context/ThemeContext'
import { TABS ,DEFAULT_COLORS, LANGUAGES } from '@/app/utils/Data'
import MobileBottomNav from '@/app/Component/Setting/MobileBottomNav'
import { getPasswordStrength } from '@/app/utils/getPasswordStrength'
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch'
import PasswordStrength from '@/app/Component/Setting/PasswordStrength'
import LanguageCard from '@/app/Component/Setting/LanguageCard'
import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline'

// small helper: password strength

export default function SettingsPage({
  user = {},
  onToggleTheme = () => {},
  onChangePassword = () => {},
  onDeleteAccount = () => {},
  onTogglePrivate = () => {},
  onMakePremiumVerify = () => {},
  colors = DEFAULT_COLORS,
  loginHistory = [],
}) {
  const [activeTab, setActiveTab] = useState('appearance')
  // استخدم الـ Context
  const { theme, toggleTheme } = useTheme()

  // نعرف متغير بسيط لسهولة التعامل
  const darkMode = theme === 'dark'
  // security form
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  // chat colors
  const [backgroundValue, setBackgroundValue] = useState(colors[0].value)
  const [customColor, setCustomColor] = useState('')

  // language
  const [language, setLanguage] = useState('en')

  // account
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false)
  const [isVerified, setIsVerified] = useState(user?.isAccountWithPremiumVerify || false)


  const submitPassword = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match')
      return
    }
    const { score } = getPasswordStrength(newPassword)
    if (score < 2) {
      setPasswordMessage('Choose a stronger password')
      return
    }
    setPasswordMessage('')
    onChangePassword({ oldPassword, newPassword })
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
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
      {/* Page container */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 sticky top-8 h-[calc(100vh-64px)] self-start">
            <div className="h-full p-4 rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border dark:border-gray-800 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">{(user?.username || 'U').charAt(0).toUpperCase()}</div>
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
                      {activeTab === tab.id && <div className="w-2 h-2 rounded-full bg-white/40" />}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Theme</div>
                <div className="flex items-center gap-3">
                  <button onClick={toggleTheme} className="p-2 rounded-md shadow hover:scale-105 transition bg-white/50 dark:bg-gray-800/50">
                    {darkMode ? <FaMoon /> : <FaSun />}
                  </button>
                  <div className="text-sm">{darkMode ? 'Dark' : 'Light'}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-gray-500">Manage your account, privacy and appearance</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-500">Signed in as</div>
                <div className="font-medium">@{user?.username || 'username'}</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'appearance' && (
                <motion.section
                  key="appearance"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-white/60 to-blue-50 dark:from-gray-900/60 dark:to-gray-900/40 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg">
                      <FaSun />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Appearance</h2>
                      <p className="text-sm text-gray-500">Personalize theme, layout and accent color.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Theme</div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500">Light</div>
                            <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
                            <div className="text-xs text-gray-500">Dark</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Toggle dark mode across the site.</p>
                      </div>

                      <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
                        <div className="font-medium mb-2">Accent color</div>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((c) => (
                            <button
                              key={c.value}
                              title={c.name}
                              onClick={() => handleBackgroundChange('color', c.value)}
                              className={clsx('w-10 h-10 rounded-full border-2 transition-transform', backgroundValue === c.value ? 'scale-105 ring-2 ring-offset-2 ring-blue-400 border-white' : 'border-gray-200')}
                              style={{ backgroundColor: c.value }}
                            />
                          ))}
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customColor || '#000000'}
                              onChange={(e) => handleBackgroundChange('custom', e.target.value)}
                              className="w-10 h-10 p-0 border-none bg-transparent"
                              aria-label="Choose custom accent color"
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-500">Selected: <span className="font-medium" style={{ color: backgroundValue }}>{backgroundValue}</span></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
                        <div className="font-medium">Layout</div>
                        <p className="text-sm text-gray-500 mt-2">Choose a compact or relaxed layout for lists and posts.</p>
                        <div className="mt-3 flex gap-3">
                          <button className="px-3 py-2 rounded-lg border">Compact</button>
                          <button className="px-3 py-2 rounded-lg border bg-gradient-to-r from-blue-500 to-indigo-500 text-white">Relaxed</button>
                        </div>
                      </div>

                      <div className="rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 border">
                        <div className="font-medium">Preview</div>
                        <div className="mt-3 p-3 rounded-lg border bg-white/30 dark:bg-gray-800/30">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: backgroundValue }} />
                            <div>
                              <div className="font-medium">Preview name</div>
                              <div className="text-xs text-gray-500">@preview</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeTab === 'security' && (
                <motion.section
                  key="security"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg"><FaLock /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Security</h2>
                      <p className="text-sm text-gray-500">Manage password, two-factor and account safety.</p>
                    </div>
                  </div>

                  <form onSubmit={submitPassword} className="grid gap-4">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />

                    <PasswordStrength password={newPassword} />

                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Update password</button>
                      <button onClick={() => { setOldPassword(''); setNewPassword(''); setConfirmPassword('') }} type="button" className="px-4 py-2 rounded-lg border">Reset</button>
                    </div>
                    {passwordMessage && <div className="text-sm text-red-500">{passwordMessage}</div>}
                  </form>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-factor Authentication</div>
                        <div className="text-sm text-gray-500">Add an extra layer of protection to your account.</div>
                      </div>
                      <div>
                        <button className="px-3 py-2 rounded-lg border">Manage</button>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeTab === 'chat' && (
                <motion.section
                  key="chat"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg"><CiChat1 /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Chat Colors</h2>
                      <p className="text-sm text-gray-500">Choose bubble colors and accents used in chat previews.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {colors.map((c) => (
                      <div key={c.value} className="text-center">
                        <button onClick={() => handleBackgroundChange('color', c.value)} className="flex flex-col items-center gap-2">
                          <div className={clsx('h-12 w-12 rounded-lg border-2')} style={{ backgroundColor: c.value }} />
                          <div className="text-xs text-gray-500">{c.name}</div>
                        </button>
                      </div>
                    ))}
                    <div className="col-span-full md:col-auto p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50">
                      <div className="text-sm font-medium mb-2">Custom color</div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={customColor || '#000000'} onChange={(e) => handleBackgroundChange('custom', e.target.value)} className="w-12 h-10" />
                        <div className="flex-1 text-sm text-gray-500">Pick any color to be used as your chat accent.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg border bg-white/30 dark:bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md" style={{ background: backgroundValue }} />
                      <div className="flex-1">
                        <div className="font-medium">This is how your chat accent looks</div>
                        <div className="text-xs text-gray-500">Applied across message bubbles and highlights.</div>
                      </div>
                    </div>
                  </div>
                </motion.section>
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
                <motion.section
                  key="account"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow space-y-4"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg"><FaUserCog /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Account</h2>
                      <p className="text-sm text-gray-500">Manage privacy, verification and account actions.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg p-4 border bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Private account</div>
                          <div className="text-sm text-gray-500">Only approved followers can see your posts.</div>
                        </div>
                        <ToggleSwitch checked={isPrivate} onChange={(v) => { setIsPrivate(v); onTogglePrivate(v) }} />
                      </div>
                    </div>

                    <div className="rounded-lg p-4 border bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Premium verified</div>
                          <div className="text-sm text-gray-500">Get a verified badge and priority support.</div>
                        </div>
                        <ToggleSwitch checked={isVerified} onChange={(v) => { setIsVerified(v); onMakePremiumVerify(v) }} onColor={'bg-yellow-400'} />
                      </div>
                    </div>

                    <div className="md:col-span-2 rounded-lg p-4 border bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Danger zone</div>
                          <div className="text-sm text-gray-500">Delete account and data permanently.</div>
                        </div>
                        <button onClick={() => setShowConfirmDelete(true)} className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg">
                          <FaTrashAlt /> Delete account
                        </button>
                      </div>

                      <AnimatePresence>
                        {showConfirmDelete && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-600">
                            <div className="text-sm">Are you sure? This action cannot be undone.</div>
                            <div className="flex gap-3 mt-3">
                              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Yes, delete</button>
                              <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
