'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectCurrentUser,
  selectIsLogin,
  selectIsAuthChecked,
  selectAuthLoading,
  selectAuthStatus,
} from '../features/auth/authSelectors';
import {
  setUser as setAuthUser,
  setIsLoading,
} from '../features/auth/authSlice';
import { baseApi } from '../api/baseApi';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '../features/auth/authApi';



export const useAuth = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();
  const { showToast, confirmAction } = useFeedback();
  const [loginRequest] = useLoginMutation();
  const [logoutRequest] = useLogoutMutation();
  const [registerRequest] = useRegisterMutation();

  const user = useAppSelector(selectCurrentUser);
  const isLogin = useAppSelector(selectIsLogin);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isLoading = useAppSelector(selectAuthLoading);
  const status = useAppSelector(selectAuthStatus);

  const setUser = useCallback(
    (userData) => {
      const currentUser = selectCurrentUser(store.getState());
      dispatch(setAuthUser(typeof userData === 'function' ? userData(currentUser) : userData));
    },
    [dispatch, store]
  );

  const login = useCallback(
    async (email, password) => {
      if (!email || !password) {
        showToast('Please provide both email and password.', 'error');
        return;
      }

      dispatch(setIsLoading(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await loginRequest({ email, password }).unwrap();
        if (!res.user) throw new Error('Invalid response from server');
        dispatch(baseApi.util.resetApiState());

        showToast(res.message || MESSAGES.AUTH.LOGIN_SUCCESS, 'success', { id: loadingToast });
        if (res.verificationInfo?.verificationCode) {
          showToast(`Verify code: ${res.verificationInfo.verificationCode}`, 'info');
        }

        router.replace('/');
      } catch (err) {
        const errorMessage = err.data?.message || err.message || MESSAGES.AUTH.LOGIN_ERROR;
        showToast(errorMessage, 'error', { id: loadingToast });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, showToast, router, loginRequest]
  );

  const logout = useCallback(async () => {
    const isConfirmed = await confirmAction({
      title: 'Sign Out',
      text: MESSAGES.AUTH.LOGOUT_CONFIRM,
      confirmButtonText: 'Log Out',
      cancelButtonText: 'Stay Logged In',
    });

    if (isConfirmed) {
      try {
        await logoutRequest().unwrap();
        window.location.href = '/Pages/Login';
      } catch (error) {
        console.error('Logout error:', error);
        showToast('Unable to sign out. Please check your connection and try again.', 'error');
      }
    }
  }, [confirmAction, showToast, logoutRequest]);

  const registerNewUser = useCallback(
    async (username, email, password) => {
      dispatch(setIsLoading(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await registerRequest({ username, email, password }).unwrap();
        if (res.user) {
          dispatch(baseApi.util.resetApiState());
        }

        if (!res.user) {
          throw new Error('Invalid response from server');
        }

        showToast(res.message || MESSAGES.AUTH.REGISTRATION_SUCCESS, 'success', { id: loadingToast });
        if (res.verificationCode) {
          showToast(`Verify code: ${res.verificationCode}`, 'info');
        }

        router.replace('/');
      } catch (err) {
        const errorMessage = err.data?.message || MESSAGES.AUTH.REGISTRATION_ERROR;
        showToast(errorMessage, 'error', { id: loadingToast });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, showToast, router, registerRequest]
  );

  return useMemo(
    () => ({
      user,
      isLogin,
      isAuthChecked,
      isLoading,
      status,
      setUser,
      login,
      logout,
      registerNewUser,
    }),
    [user, isLogin, isAuthChecked, isLoading, status, setUser, login, logout, registerNewUser]
  );
};

export default useAuth;
