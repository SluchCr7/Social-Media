'use client';
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useNotify } from '../Context/NotifyContext';
import Image from 'next/image';

const NotificationMenu = ({ showNotifications, setShowNotifications }) => {
  const {
    notificationsByUser,
    markAllAsRead,
    clearAllNotifications,
  } = useNotify();

  useEffect(() => {
    if (showNotifications) {
      markAllAsRead(); // تعليم الكل كمقروء عند الفتح
    }
  }, [showNotifications]);

  return (
    <div className={`fixed inset-0 z-[999] transition-all duration-500 ${showNotifications ? 'backdrop-blur-sm bg-black/30' : 'pointer-events-none opacity-0'}`}>
      <div className={`transform transition-all duration-700 ease-in-out 
        ${showNotifications ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} 
        w-[95%] md:w-[40rem] max-w-6xl mx-auto
        bg-lightMode-bg dark:bg-darkMode-bg shadow-2xl rounded-xl p-6 mt-[10vh] relative`}>

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl text-lightMode-fg dark:text-darkMode-fg font-bold">Notifications</h2>
          <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 transition">
            <FiX size={24} />
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 max-h-[60vh]">
          {notificationsByUser.length > 0 ? (
            notificationsByUser.map((notif) => (
              <div
                key={notif._id}
                className={`flex gap-4 p-3 rounded-xl transition cursor-pointer items-start hover:bg-gray-200 dark:hover:bg-gray-700
                  ${!notif.isRead ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Image
                  src={notif.sender?.profilePhoto?.url || '/default-avatar.png'}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-full object-cover shadow-sm"
                />
                <div className="flex-1">
                  <p className="text-base font-medium text-lightMode-fg dark:text-darkMode-fg leading-snug">{notif.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 text-sm py-20">
              No notifications
            </div>
          )}
        </div>

        {/* Footer */}
        {notificationsByUser.length > 0 && (
          <div className="pt-5 border-t mt-4">
            <button
              onClick={clearAllNotifications}
              className="w-full bg-white dark:bg-black text-black dark:text-white text-sm font-semibold py-3 rounded-xl transition hover:opacity-90"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
