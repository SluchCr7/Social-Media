'use client';
import React, { useEffect, useState } from 'react';
import {
  FaMoon,
  FaSun,
  FaLock,
  FaUserCog,
  FaTrashAlt,
} from 'react-icons/fa';
import { CiChat1 } from "react-icons/ci";
import { useAuth } from '@/app/Context/AuthContext';
import { colors } from '@/app/utils/Data';
import clsx from 'clsx';
import { useMessage } from '@/app/Context/MessageContext';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { user, updatePassword, deleteUser } = useAuth();
  const { backgroundStyle, handleBackgroundChange, backgroundValue } = useMessage();

  // ✅ 1. Load dark mode from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // ✅ 2. Toggle dark mode and save to localStorage
  const handleToggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  const formattedDate = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString()
    : 'No login history found.';

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
    } else {
      updatePassword(newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('');
    }
  };

  return (
    <div className="min-h-screen p-8 text-gray-900 dark:text-white w-full transition-all">
      <h1 className="text-3xl font-bold mb-10">⚙️ Settings</h1>
      <span className="text-sm font-semibold mb-4 pl-2">Hello {user?.username}</span>

      {/* Appearance */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu p-6 rounded-2xl shadow mb-6">
        <div className="flex items-start flex-col md:items-center md:flex-row justify-between">
          <div className="flex items-center gap-4">
            {darkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark mode
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            className={`w-12 h-6 flex items-center ${darkMode ? 'bg-yellow-400' : 'bg-gray-300'} rounded-full p-1 transition-all`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>


      
      {/* Security */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu p-6 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-4 mb-4">
          <FaLock className="text-xl" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        <form onSubmit={handleChangePassword} className="grid gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-2 rounded border dark:border-gray-700 dark:bg-transparent"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 rounded border dark:border-gray-700 dark:bg-transparent"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 rounded border dark:border-gray-700 dark:bg-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleChangePassword} className="self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Change Password
          </button>
          {passwordMessage && (
            <p className="text-sm mt-1 text-red-500 dark:text-red-400">{passwordMessage}</p>
          )}
        </form>
      </section>


      {/* Chat Colors */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu p-6 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-4 mb-4">
          <CiChat1 className="text-xl" />
          <h2 className="text-lg font-semibold">Chat Colors</h2>
        </div>
        <div className="flex items-start flex-col gap-4 mb-4">
          <label className="text-base font-semibold text-lightMode-text dark:text-darkMode-text" htmlFor="color">Color Chat</label>
          {/* Chat Colors */}
          <div className="flex flex-wrap gap-4 mb-4">
            {colors.map(({ name, value }) => (
              <div
                key={name}
                title={name}
                onClick={()=> handleBackgroundChange('color', value)}
                className={clsx(
                  'w-10 h-10 rounded-full border-2 cursor-pointer transition-all',
                  backgroundValue === value
                    ? 'ring-2 ring-offset-2 ring-blue-500 border-white'
                    : 'border-gray-300'
                )}
                style={{ backgroundColor: value }}
              ></div>
            ))}
          </div>
        </div>

        {/* Preview or label */}
        <p className="text-sm text-gray-600">
          Selected:{" "}
          <span className="font-semibold" style={{ color: backgroundValue }}>
            {
              colors.find((c) => c.value === backgroundValue)?.name ||
              'Unknown'
            }
          </span>
        </p>
      </section>

      {/* Last Login */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu p-6 rounded-2xl shadow mb-6">
      <div className="flex items-center gap-4 mb-4">
        <CiChat1 className="text-xl" />
        <h2 className="text-lg font-semibold">Last Login History</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Your last login was on: <span className="font-medium text-lightMode-fg dark:text-darkMode-fg">{formattedDate}</span>
      </p>
      </section>


      {/* Account */}
      <section className="bg-lightMode-menu dark:bg-darkMode-menu p-6 rounded-2xl shadow">
        <div className="flex items-center gap-4 mb-4">
          <FaUserCog className="text-xl" />
          <h2 className="text-lg font-semibold">Account</h2>
        </div>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
        >
          <FaTrashAlt />
          Delete Account
        </button>

        {/* Confirm Delete */}
        {showConfirmDelete && (
          <div className="mt-4 p-4 border border-red-600 bg-red-50 dark:bg-red-900/30 rounded">
            <p className="text-sm mb-3">Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="flex gap-4">
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Delete</button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded border dark:border-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>


    </div>
  );
};

export default SettingsPage;
