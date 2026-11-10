'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import SocketBridge from './SocketBridge';
import FeedbackBridge from './features/feedback/FeedbackBridge';
import AudioBridge from './features/musicPlayer/AudioBridge';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <SocketBridge />
      <FeedbackBridge />
      <AudioBridge />
      {children}
    </Provider>
  );
}
