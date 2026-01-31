'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { useFeedback } from './FeedbackContext';
import { MESSAGES } from '../utils/messages';

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
    if (!email || !password) {
      showToast('Please provide both email and password.', 'error');
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const res = await api.post('/auth/login', { email, password });

      const userData = res.data.user;
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginState', 'true');
      setIsLogin(true);

      showToast(res.data.message || MESSAGES.AUTH.LOGIN_SUCCESS, 'success', { id: loadingToast });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || MESSAGES.AUTH.LOGIN_ERROR;
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
      const res = await api.post('/auth/register', { username, email, password });

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

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/auth');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  // --- Initialization ---

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const loginState = localStorage.getItem('loginState');

        if (storedUser && loginState === 'true') {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.token) {
            setUser(parsedUser);
            setIsLogin(true);
          } else {
            // Invalid data in localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('loginState');
          }
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('loginState');
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  // Fetch users list for authenticated users (ADMIN ONLY)
  useEffect(() => {
    if (isLogin && isAuthChecked && user?.isAdmin) {
      fetchUsers();
    }
  }, [isLogin, isAuthChecked, user?.isAdmin, fetchUsers]);

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
    logout,
    registerNewUser,
    fetchUsers,
  }), [
    user, users, isLogin, isAuthChecked, isLoading,
    setUser, setUsers, login, logout, registerNewUser, fetchUsers
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
