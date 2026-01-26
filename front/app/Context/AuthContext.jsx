'use client';

import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useFeedback } from './FeedbackContext';
import { MESSAGES } from '../utils/messages';
import getData from '../utils/getData';

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  // --- State ---
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast, confirmAction } = useFeedback();

  // --- Auth Actions ---

  /**
   * Authenticate user with email and password
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login`, {
        email,
        password,
      });

      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginState', 'true');
      setIsLogin(true);

      showToast(res.data.message || MESSAGES.AUTH.LOGIN_SUCCESS, 'success', { id: loadingToast });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.AUTH.LOGIN_ERROR;
      showToast(errorMessage, 'error', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  /**
   * Logout current user with confirmation
   */
  const logout = useCallback(async () => {
    const isConfirmed = await confirmAction({
      title: 'Sign Out',
      text: MESSAGES.AUTH.LOGOUT_CONFIRM,
      confirmButtonText: 'Log Out',
      cancelButtonText: 'Stay Logged In'
    });

    if (isConfirmed) {
      setUser(null);
      setIsLogin(false);
      localStorage.removeItem('user');
      localStorage.removeItem('loginState');
      window.location.href = '/Pages/Login';
    }
  }, [confirmAction]);

  /**
   * Register a new user
   */
  const registerNewUser = useCallback(async (username, email, password) => {
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/register`, {
        username, email, password
      });

      showToast(res.data.message || MESSAGES.AUTH.REGISTRATION_SUCCESS, 'success', { id: loadingToast });

      setTimeout(() => {
        window.location.href = '/Pages/Login';
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.AUTH.REGISTRATION_ERROR;
      showToast(errorMessage, 'error', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // --- Initialization ---

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const loginState = localStorage.getItem('loginState');

        if (storedUser && loginState === 'true') {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLogin(true);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  // Fetch all users (admin/list view)
  useEffect(() => {
    if (isLogin) {
      getData('auth', setUsers);
    }
  }, [isLogin]);

  // --- Context Value ---
  const value = useMemo(() => ({
    user,
    users,
    isLogin,
    isAuthChecked,
    isLoading,
    setUser,
    setUsers,
    login,
    Logout: logout, // alias for backward compatibility
    logout,
    registerNewUser,
  }), [
    user, users, isLogin, isAuthChecked, isLoading,
    setUser, setUsers, login, logout, registerNewUser
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
