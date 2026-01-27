'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { useAlert } from './AlertContext';

const VerifyContext = createContext();

export const useVerify = () => {
  const context = useContext(VerifyContext);
  if (!context) {
    throw new Error('useVerify must be used within a VerifyContextProvider');
  }
  return context;
};

export const VerifyContextProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [verifyStatus, setVerifyStatus] = useState(false);

  const ResetPassword = useCallback(async (id, token, password) => {
    if (!password) return showAlert('All fields are required');
    try {
      // Correcting to POST since we are sending a password
      const res = await api.post(`/password/reset-password/${id}/${token}`, { password });
      showAlert(res.data.message || 'Password reset successfully');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to reset password');
    }
  }, [showAlert]);

  const ForgetEmail = useCallback(async (email) => {
    if (!email) return showAlert('Email field is required');
    try {
      const res = await api.post('/password/reset', { email });
      showAlert(res.data.message || res.data || 'Reset link sent to your email');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to send reset email');
    }
  }, [showAlert]);

  const verifyAccount = useCallback(async (id, token) => {
    try {
      await api.get(`/auth/${id}/verify/${token}`);
      setVerifyStatus(true);
      showAlert('Account Verified');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Verification failed');
    }
  }, [showAlert]);

  const value = useMemo(() => ({
    verifyAccount,
    ResetPassword,
    ForgetEmail,
    verifyStatus,
    setVerifyStatus
  }), [verifyAccount, ResetPassword, ForgetEmail, verifyStatus]);

  return (
    <VerifyContext.Provider value={value}>
      {children}
    </VerifyContext.Provider>
  );
};
