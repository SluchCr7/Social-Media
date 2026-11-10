'use client';

import { useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectVerifyStatus } from '../features/verify/verifySelectors';
import { setVerifyStatus as setReduxVerifyStatus } from '../features/verify/verifySlice';



export const useVerify = () => {
  const dispatch = useAppDispatch();
  const { showAlert } = useFeedback();
  const verifyStatus = useAppSelector(selectVerifyStatus);

  const setVerifyStatus = useCallback(
    (status) => {
      dispatch(setReduxVerifyStatus(status));
    },
    [dispatch]
  );

  const ResetPassword = useCallback(
    async (id, token, password) => {
      if (!password) return showAlert('All fields are required');
      try {
        const res = await api.post(`/password/reset-password/${id}/${token}`, { password });
        showAlert(res.data.message || 'Password reset successfully');
      } catch (err) {
        console.error(err);
        showAlert(err.response?.data?.message || 'Failed to reset password');
      }
    },
    [showAlert]
  );

  const ForgetEmail = useCallback(
    async (email) => {
      if (!email) return showAlert('Email field is required');
      try {
        const res = await api.post('/password/reset', { email });
        showAlert(res.data.message || res.data || 'Reset link sent to your email');
      } catch (err) {
        console.error(err);
        showAlert(err.response?.data?.message || 'Failed to send reset email');
      }
    },
    [showAlert]
  );

  const verifyAccount = useCallback(
    async (id, token) => {
      try {
        await api.get(`/auth/${id}/verify/${token}`);
        dispatch(setReduxVerifyStatus(true));
        showAlert('Account Verified');
      } catch (err) {
        console.error(err);
        showAlert(err.response?.data?.message || 'Verification failed');
      }
    },
    [dispatch, showAlert]
  );

  return useMemo(
    () => ({
      verifyAccount,
      ResetPassword,
      ForgetEmail,
      verifyStatus,
      setVerifyStatus,
    }),
    [verifyAccount, ResetPassword, ForgetEmail, verifyStatus, setVerifyStatus]
  );
};

export default useVerify;
