'use client';

import { useCallback, useMemo } from 'react';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectVerifyStatus } from '../features/verify/verifySelectors';
import { setVerifyStatus as setReduxVerifyStatus } from '../features/verify/verifySlice';
import {
  useResetPasswordMutation,
  useRequestPasswordResetMutation,
  useLazyVerifyAccountQuery,
} from '../features/auth/authApi';


export const useVerify = () => {
  const dispatch = useAppDispatch();
  const { showAlert } = useFeedback();
  const verifyStatus = useAppSelector(selectVerifyStatus);
  const [resetPassword] = useResetPasswordMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [verifyAccountRequest] = useLazyVerifyAccountQuery();

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
        const res = await resetPassword({ id, token, password }).unwrap();
        showAlert(res.message || 'Password reset successfully');
      } catch (err) {
        console.error(err);
        showAlert(err.data?.message || 'Failed to reset password');
      }
    },
    [resetPassword, showAlert]
  );

  const ForgetEmail = useCallback(
    async (email) => {
      if (!email) return showAlert('Email field is required');
      try {
        const res = await requestPasswordReset(email).unwrap();
        showAlert(res.message || res || 'Reset link sent to your email');
      } catch (err) {
        console.error(err);
        showAlert(err.data?.message || 'Failed to send reset email');
      }
    },
    [requestPasswordReset, showAlert]
  );

  const verifyAccount = useCallback(
    async (id, token) => {
      try {
        await verifyAccountRequest({ id, token }).unwrap();
        dispatch(setReduxVerifyStatus(true));
        showAlert('Account Verified');
      } catch (err) {
        console.error(err);
        showAlert(err.data?.message || 'Verification failed');
      }
    },
    [dispatch, showAlert, verifyAccountRequest]
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
