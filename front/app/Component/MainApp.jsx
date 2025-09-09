'use client';
import React, { useState } from 'react';
import Sluchits from './Sluchits';
import Stories from './Stories';
import NotificationMenu from './NotificationMenu';
import { useNotify } from '../Context/NotifyContext';
import Link from 'next/link';
import { useMessage } from '../Context/MessageContext';
import Header from './Header';
import { useAuth } from '../Context/AuthContext';

const MainApp = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    markAllAsRead,
    unreadCount
  } = useNotify();
  const { isLogin } = useAuth();
  const { unReadedMessage } = useMessage();

  return (
    <div className="w-full h-full px-3 py-12 md:py-0">
      {/* Header */}
      <Header unReadedMessage={unReadedMessage} setShowNotifications={setShowNotifications} unreadCount={unreadCount} markAllAsRead={markAllAsRead}/>
      {/* Content */}
      {
        isLogin && (
          <Stories />
        )
      }
      <Sluchits />

      {showNotifications && (
        <NotificationMenu
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
      )}
    </div>
  );
};

export default MainApp;
