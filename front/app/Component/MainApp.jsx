'use client';
import dynamic from "next/dynamic";

const NotificationMenu = dynamic(() => import('./NotificationMenu'), {
  ssr: false,
});
import React, { useState } from 'react';
import Sluchits from './Sluchits';
import Stories from './Stories';
import { useNotify } from '@/app/redux/hooks';
import { useMessage } from '@/app/redux/hooks';
import Header from './Header';
import { useAuth } from '@/app/redux/hooks';
import LoadingOverlay from './Post/LoadingOverlay';
import { usePost } from '@/app/redux/hooks';


const MainApp = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { isLoadingPostCreated } = usePost();
  const { markAllAsRead, unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { unReadedMessage } = useMessage();
  const [activeTab, setActiveTab] = useState("following");
  return (
    <div className="flex-1 w-full min-h-screen pr-6 pl-8 md:pl-12">
      {/* Container wrapper that aligns both Header and Main content */}
      <div className="max-w-6xl mx-auto w-full flex flex-col">
        {/* Header ثابت أعلى الصفحة */}
        <Header
          unReadedMessage={unReadedMessage}
          setShowNotifications={setShowNotifications}
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          activeTab={isLogin ? activeTab : "forYou"} 
          setActiveTab={setActiveTab}
        />

        {/* محتوى الصفحة الرئيسية */}
        <main className="w-full pt-10 md:pt-6 pb-5">
          <div className='w-full'>
            {isLogin && <Stories />}
          </div>
          <LoadingOverlay isLoading={isLoadingPostCreated} />
          <Sluchits activeTab={activeTab} />
        </main>
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
