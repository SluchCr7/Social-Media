'use client';

import React, { useEffect, useLayoutEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import SocketBridge from './SocketBridge';
import FeedbackBridge from './features/feedback/FeedbackBridge';
import AudioBridge from './features/musicPlayer/AudioBridge';
import { authApi } from './features/auth/authApi';
import { logoutSuccess } from './features/auth/authSlice';
import { baseApi } from './api/baseApi';
import { selectAccentColor, selectTheme } from './features/theme/themeSelectors';
import { applyAccentPalette } from '../utils/accentColor';

function AccentPaletteBridge() {
  const accentColor = useSelector(selectAccentColor);
  const theme = useSelector(selectTheme);

  useLayoutEffect(() => {
    applyAccentPalette(document.documentElement, accentColor, theme);
  }, [accentColor, theme]);

  return null;
}

function AuthSessionInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      ['auth_user', 'access_token', 'refresh_token'].forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Unable to remove legacy authentication storage:', error);
    }

    const authSessionQuery = dispatch(authApi.endpoints.getMe.initiate(undefined, {
      subscriptionOptions: {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    }));

    const handleSessionExpired = () => {
      dispatch(logoutSuccess());
      dispatch(baseApi.util.resetApiState());
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      authSessionQuery.unsubscribe();
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AccentPaletteBridge />
      <AuthSessionInitializer />
      <SocketBridge />
      <FeedbackBridge />
      <AudioBridge />
      {children}
    </Provider>
  );
}
