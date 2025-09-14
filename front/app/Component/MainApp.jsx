'use client';
import React, { useState } from 'react';
import Sluchits from './Sluchits';
import Stories from './Stories';
import NotificationMenu from './NotificationMenu';
import { useNotify } from '../Context/NotifyContext';
import { useMessage } from '../Context/MessageContext';
import Header from './Header';
import { useAuth } from '../Context/AuthContext';

const MainApp = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { markAllAsRead, unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { unReadedMessage } = useMessage();

  return (
    <div className="flex-1 w-full">
      {/* Header ثابت أعلى الصفحة */}
      <Header
        unReadedMessage={unReadedMessage}
        setShowNotifications={setShowNotifications}
        unreadCount={unreadCount}
        markAllAsRead={markAllAsRead}
      />

      {/* محتوى الصفحة */}
      <div className="max-w-2xl mx-auto w-full px-3 pt-16 md:pt-6">
        {isLogin && <Stories />}
        <Sluchits />
      </div>

      {/* قائمة الإشعارات */}
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
