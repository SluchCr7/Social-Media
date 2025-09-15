'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { colors } from '@/app/utils/Data';
import clsx from 'clsx';
import { useMessage } from '@/app/Context/MessageContext';
import SettingPageFront from './Design';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { user, updatePassword, deleteUser, togglePrivateAccount,makeAccountPremiumVerify } = useAuth();
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
    <>
      <SettingPageFront
        handleChangePassword={handleChangePassword} oldPassword={oldPassword}
        newPassword={newPassword} confirmPassword={confirmPassword}
        setPasswordMessage={setPasswordMessage} updatePassword={updatePassword}
        setOldPassword={setOldPassword} setNewPassword={setNewPassword} passwordMessage={passwordMessage} setConfirmPassword={setConfirmPassword} setShowConfirmDelete={setShowConfirmDelete} showConfirmDelete={showConfirmDelete}
        darkMode={darkMode}  handleToggleTheme={handleToggleTheme} deleteUser={deleteUser} colors={colors}
        formattedDate={formattedDate} backgroundValue={backgroundValue} handleBackgroundChange={handleBackgroundChange}
        togglePrivateAccount={togglePrivateAccount} makeAccountPremiumVerify={makeAccountPremiumVerify}
      />
    </>
  );
};

export default SettingsPage;
