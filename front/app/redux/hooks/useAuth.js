'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectCurrentUser,
  selectUsers,
  selectIsLogin,
  selectIsAuthChecked,
  selectAuthLoading,
  selectAuthStatus,
} from '../features/auth/authSelectors';
import {
  setUser as setAuthUser,
  setUsers as setAuthUsers,
  setIsLogin,
  setIsAuthChecked,
  setIsLoading,
  logoutSuccess,
} from '../features/auth/authSlice';
import api from '@/app/utils/api';
import { advanceAuthSessionVersion, getAuthSessionVersion } from '@/app/utils/authSession';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';



export const useAuth = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();
  const { showToast, confirmAction } = useFeedback();

  const user = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectUsers);
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

  const setUsers = useCallback(
    (usersData) => {
      const currentUsers = selectUsers(store.getState());
      dispatch(setAuthUsers(typeof usersData === 'function' ? usersData(currentUsers) : usersData));
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
        const res = await api.post('/auth/login', { email, password });
        const userData = res.data.user;

        if (!userData) {
          throw new Error('Invalid response from server');
        }

        dispatch(setAuthUser(userData));
        advanceAuthSessionVersion();

        showToast(res.data.message || MESSAGES.AUTH.LOGIN_SUCCESS, 'success', { id: loadingToast });
        if (res.data.verificationInfo?.verificationCode) {
          showToast(`Verify code: ${res.data.verificationInfo.verificationCode}`, 'info');
        }

        router.replace('/');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || MESSAGES.AUTH.LOGIN_ERROR;
        showToast(errorMessage, 'error', { id: loadingToast });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, showToast, router]
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
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
        showToast('Could not sign out. Please check your connection and try again.', 'error');
        return;
      }
      dispatch(logoutSuccess());
      advanceAuthSessionVersion();
      window.location.href = '/Pages/Login';
    }
  }, [confirmAction, dispatch, showToast]);

  const registerNewUser = useCallback(
    async (username, email, password) => {
      dispatch(setIsLoading(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await api.post('/auth/register', { username, email, password });
        const userData = res.data.user;

        if (userData) {
          dispatch(setAuthUser(userData));
          advanceAuthSessionVersion();
        }

        showToast(res.data.message || MESSAGES.AUTH.REGISTRATION_SUCCESS, 'success', { id: loadingToast });
        if (res.data.verificationCode) {
          showToast(`Verify code: ${res.data.verificationCode}`, 'info');
        }

        router.replace('/');
      } catch (err) {
        const errorMessage = err.response?.data?.message || MESSAGES.AUTH.REGISTRATION_ERROR;
        showToast(errorMessage, 'error', { id: loadingToast });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, showToast, router]
  );

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/auth');
      dispatch(setAuthUsers(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [dispatch]);

  // Server-side session verification via HTTP-only cookie on mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        if (isMounted && !selectIsAuthChecked(store.getState()) && res.data?.user) {
          dispatch(setAuthUser(res.data.user));
          dispatch(setIsLogin(true));
          advanceAuthSessionVersion();
        }
      } catch (err) {
        if (isMounted && !selectIsAuthChecked(store.getState())) {
          dispatch(logoutSuccess());
          advanceAuthSessionVersion();
        }
      } finally {
        if (isMounted && !selectIsAuthChecked(store.getState())) {
          dispatch(setIsAuthChecked(true));
          advanceAuthSessionVersion();
        }
      }
    };

    if (!isAuthChecked) {
      checkSession();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthChecked, dispatch, store]);

  useEffect(() => {
    const handleSessionExpired = (event) => {
      if (
        selectCurrentUser(store.getState()) &&
        getAuthSessionVersion() === event.detail?.authSessionVersion
      ) {
        dispatch(logoutSuccess());
        advanceAuthSessionVersion();
      }
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch, store]);

  // Admin users fetch
  useEffect(() => {
    if (isLogin && isAuthChecked && user?.isAdmin) {
      fetchUsers();
    }
  }, [isLogin, isAuthChecked, user?.isAdmin, fetchUsers]);

  return useMemo(
    () => ({
      user,
      users,
      isLogin,
      isAuthChecked,
      isLoading,
      status,
      setUser,
      setUsers,
      login,
      logout,
      registerNewUser,
      fetchUsers,
    }),
    [user, users, isLogin, isAuthChecked, isLoading, status, setUser, setUsers, login, logout, registerNewUser, fetchUsers]
  );
};

export default useAuth;
