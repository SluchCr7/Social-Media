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
    const [activeTab, setActiveTab] = useState("following");
  return (
    <div className="flex-1 w-full">
      {/* Header ثابت أعلى الصفحة */}
      <Header
        unReadedMessage={unReadedMessage}
        setShowNotifications={setShowNotifications}
        unreadCount={unreadCount}
        markAllAsRead={markAllAsRead}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* محتوى الصفحة */}
      <div className="w-full pt-10 md:pt-6 pb-5">
        {isLogin && <Stories />}
        <Sluchits activeTab={activeTab} />
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
