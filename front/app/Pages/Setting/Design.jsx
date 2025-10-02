'use client';

import React, { useState } from 'react';
import {
  FaMoon,
  FaSun,
  FaLock,
  FaUserCog,
  FaTrashAlt,
  FaHistory,
} from 'react-icons/fa';
import { CiChat1 } from 'react-icons/ci';
import { MdLanguage } from 'react-icons/md';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: <FaSun /> },
  { id: 'security', label: 'Security', icon: <FaLock /> },
  { id: 'chat', label: 'Chat Colors', icon: <CiChat1 /> },
  { id: 'language', label: 'Language', icon: <MdLanguage /> },
  { id: 'history', label: 'Login History', icon: <FaHistory /> },
  { id: 'account', label: 'Account', icon: <FaUserCog /> },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
];

const SettingPageFront = ({
  darkMode,
  user,
  handleToggleTheme,
  handleChangePassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordMessage,
  colors,
  handleBackgroundChange,
  setShowConfirmDelete,
  deleteUser,
  showConfirmDelete,
  formattedDate,
  backgroundValue,
  togglePrivateAccount,
  makeAccountPremiumVerify
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile drawer

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Mobile Overlay */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:static z-30 inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-md transform md:translate-x-0 transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">⚙️ Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Hello <span className="font-medium text-black dark:text-white">{user?.username}</span>
            </p>
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium whitespace-nowrap w-full text-left',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <svg
          className="w-6 h-6 text-gray-900 dark:text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Content */}
      <main className="flex-1 p-6 flex flex-col items-center md:items-start">
        <AnimatePresence mode="wait">
          {/* Appearance */}
          {activeTab === 'appearance' && (
            <motion.section
              key="appearance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
            >
              <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {darkMode ? (
                    <FaMoon className="text-2xl text-yellow-400" />
                  ) : (
                    <FaSun className="text-2xl text-orange-400" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">Appearance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between Light and Dark theme
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleTheme}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${darkMode ? 'bg-yellow-400' : 'bg-gray-300'}`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}
                  />
                </button>
              </header>
            </motion.section>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <motion.section
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
            >
              <header className="flex items-center gap-4 mb-6">
                <FaLock className="text-2xl" />
                <h2 className="text-xl font-semibold">Security</h2>
              </header>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Change Password</h3>
                <form onSubmit={handleChangePassword} className="grid gap-4">
                  <input
                    type="password"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current Password"
                    required
                  />
                  <input
                    type="password"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                  />
                  <input
                    type="password"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                  />
                  <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                    Update Password
                  </button>
                  {passwordMessage && (
                    <p className="text-sm mt-1 text-red-500 dark:text-red-400">{passwordMessage}</p>
                  )}
                </form>
              </div>
            </motion.section>
          )}

          {/* Chat Colors */}
          {activeTab === 'chat' && (
            <motion.section
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <CiChat1 className="text-2xl" />
                <h2 className="text-xl font-semibold">Chat Colors</h2>
              </header>
              <div className="flex flex-wrap gap-4 mb-4">
                {colors.map(({ name, value }) => (
                  <div
                    key={name}
                    title={name}
                    onClick={() => handleBackgroundChange('color', value)}
                    className={clsx(
                      'w-10 h-10 rounded-full border-2 cursor-pointer transition-all',
                      backgroundValue === value
                        ? 'ring-2 ring-offset-2 ring-blue-500 border-white'
                        : 'border-gray-300'
                    )}
                    style={{ backgroundColor: value }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected:{' '}
                <span className="font-semibold" style={{ color: backgroundValue }}>
                  {colors.find((c) => c.value === backgroundValue)?.name || 'Unknown'}
                </span>
              </p>
            </motion.section>
          )}

          {/* Language */}
          {activeTab === 'language' && (
            <motion.section
              key="language"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <MdLanguage className="text-2xl" />
                <h2 className="text-xl font-semibold">Language</h2>
              </header>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {languages.map(({ code, name }) => (
                  <div
                    key={code}
                    className="cursor-pointer p-4 border rounded-lg text-center hover:shadow-lg transition bg-gray-50 dark:bg-gray-800"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Login History */}
          {activeTab === 'history' && (
            <motion.section
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <FaHistory className="text-2xl" />
                <h2 className="text-xl font-semibold">Last Login</h2>
              </header>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your last login was on:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">{formattedDate}</span>
              </p>
            </motion.section>
          )}

          

          {/* Account */}
          {activeTab === 'account' && (
            <motion.section
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6 space-y-4"
            >
              <header className="flex items-center gap-4 mb-4">
                <FaUserCog className="text-2xl" />
                <h2 className="text-xl font-semibold">Account</h2>
              </header>

              {/* Delete Account */}
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <FaTrashAlt />
                Delete Account
              </button>
              {showConfirmDelete && (
                <div className="mt-4 p-4 border border-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-sm mb-3">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={deleteUser}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-4 py-2 rounded border dark:border-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Private Account Toggle */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Private Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only approved followers can see your posts and profile.
                  </p>
                </div>
                <button
                  onClick={togglePrivateAccount}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${user?.isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${user?.isPrivate ? 'translate-x-7' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Premium Verified Account Toggle */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Verified Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Activate premium verification to get a verified badge.
                  </p>
                </div>
                <button
                  onClick={makeAccountPremiumVerify}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${user?.isAccountWithPremiumVerify ? 'bg-yellow-400' : 'bg-gray-300'}`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${user?.isAccountWithPremiumVerify ? 'translate-x-7' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default SettingPageFront;
