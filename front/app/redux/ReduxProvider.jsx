'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import SocketBridge from './SocketBridge';
import FeedbackBridge from './features/feedback/FeedbackBridge';
import AudioBridge from './features/musicPlayer/AudioBridge';
import { authApi } from './features/auth/authApi';
import { logoutSuccess } from './features/auth/authSlice';
import { baseApi } from './api/baseApi';

function AuthSessionInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      ['auth_user', 'access_token', 'refresh_token'].forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Unable to remove legacy authentication storage:', error);
    }

    dispatch(authApi.endpoints.getMe.initiate(undefined, { subscribe: false }));

    const handleSessionExpired = () => {
      dispatch(logoutSuccess());
      dispatch(baseApi.util.resetApiState());
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthSessionInitializer />
      <SocketBridge />
      <FeedbackBridge />
      <AudioBridge />
      {children}
    </Provider>
  );
}
