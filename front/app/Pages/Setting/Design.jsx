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
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: <FaSun /> },
  { id: 'security', label: 'Security', icon: <FaLock /> },
  { id: 'chat', label: 'Chat Colors', icon: <CiChat1 /> },
  { id: 'history', label: 'Login History', icon: <FaHistory /> },
  { id: 'account', label: 'Account', icon: <FaUserCog /> },
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
}) => {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Hello <span className="font-medium text-black dark:text-white">{user?.username}</span>
          </p>
          <nav className="flex md:flex-col gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {/* Appearance */}
          {activeTab === 'appearance' && (
            <motion.section
              key="appearance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
            >
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {darkMode ? (
                    <FaMoon className="text-xl" />
                  ) : (
                    <FaSun className="text-xl" />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">Appearance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between Light and Dark theme
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleTheme}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-all ${
                    darkMode ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                      darkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
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
              className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
            >
              <header className="flex items-center gap-4 mb-6">
                <FaLock className="text-xl" />
                <h2 className="text-lg font-semibold">Security</h2>
              </header>

              {/* Change Password */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Change Password</h3>
                <form onSubmit={handleChangePassword} className="grid gap-4">
                  <div>
                    <label className="text-sm mb-1 block">Current Password</label>
                    <input
                      type="password"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1 block">New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters, include a number & a capital letter.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="self-start bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Update Password
                  </button>
                  {passwordMessage && (
                    <p className="text-sm mt-1 text-red-500 dark:text-red-400">
                      {passwordMessage}
                    </p>
                  )}
                </form>
              </div>

              {/* Two Factor Authentication */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Add an extra layer of security to your account by enabling 2FA.
                </p>
                <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                  Enable 2FA
                </button>
              </div>

              {/* Active Sessions */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Active Sessions</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Chrome on Windows 10 · Cairo, Egypt · Active now</li>
                  <li>Safari on iPhone 14 · Giza, Egypt · 2 hours ago</li>
                </ul>
                <button className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                  Log out from all devices
                </button>
              </div>

              {/* Security Alerts */}
              <div>
                <h3 className="font-medium mb-2">Security Alerts</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Email me when a new device logs in
                </label>
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" className="rounded" />
                  Notify me of failed login attempts
                </label>
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
              className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <CiChat1 className="text-xl" />
                <h2 className="text-lg font-semibold">Chat Colors</h2>
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
                <span
                  className="font-semibold"
                  style={{ color: backgroundValue }}
                >
                  {colors.find((c) => c.value === backgroundValue)?.name ||
                    'Unknown'}
                </span>
              </p>
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
              className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <FaHistory className="text-xl" />
                <h2 className="text-lg font-semibold">Last Login</h2>
              </header>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your last login was on:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formattedDate}
                </span>
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
              className="max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
            >
              <header className="flex items-center gap-4 mb-4">
                <FaUserCog className="text-xl" />
                <h2 className="text-lg font-semibold">Account</h2>
              </header>
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
                    Are you sure you want to delete your account? This action
                    cannot be undone.
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
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SettingPageFront;
