'use client';
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosHeart } from 'react-icons/io';
import { RiUserFollowLine } from 'react-icons/ri';
import { BiMessageDetail } from 'react-icons/bi';
import { useNotify } from '../Context/NotifyContext';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

// helper: relative time formatter
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };


  for (const unit in units) {
    const seconds = units[unit];
    const interval = Math.floor(diff / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

// helper: icon by type
const getIcon = (type) => {
  switch (type) {
    case 'comment':
      return <FaRegCommentDots className="text-blue-500" />;
    case 'like':
      return <IoIosHeart className="text-red-500" />;
    case 'follow':
      return <RiUserFollowLine className="text-green-500" />;
    case 'message':
      return <BiMessageDetail className="text-purple-500" />;
    default:
      return <FaRegCommentDots className="text-gray-400" />;
  }
};

const NotificationMenu = ({ showNotifications, setShowNotifications }) => {
  const {
    notificationsByUser,
    markAllAsRead,
    clearAllNotifications,
  } = useNotify();
  const {t} = useTranslation()
  useEffect(() => {
    if (showNotifications) {
      markAllAsRead();
    }
  }, [showNotifications]);

  return (
    <div
      className={`fixed inset-0 z-[999] transition-all duration-500 
        ${showNotifications ? 'backdrop-blur-sm bg-black/30' : 'pointer-events-none opacity-0'}`}
      onClick={() => setShowNotifications(false)}
    >
      <div
        className={`transform transition-all duration-500 ease-in-out 
        ${showNotifications ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} 
        w-[95%] md:w-[40rem] max-w-6xl mx-auto
        bg-lightMode-bg dark:bg-darkMode-bg shadow-2xl rounded-2xl p-6 mt-[10vh] relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-lightMode-fg dark:text-darkMode-fg flex items-center gap-2">
            {t("Notifications")}
            {notificationsByUser.length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {notificationsByUser.length}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {notificationsByUser.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("Mark all as read")}
              </button>
            )}
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              aria-label="Close notifications"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[60vh]">
          {notificationsByUser.length > 0 ? (
            notificationsByUser.map((notif) => (
              <Link
                href={
                  notif.actionModel == 'Post'
                    ? `/Pages/Post/${notif.actionRef}`
                    : notif.actionModel == 'Comment'
                    ? `/Pages/Post/${notif.actionRef.postId}#comment-${notif.actionRef}`
                      // `/Pages/Post/${notif.actionRef.postId}#comment-${notif.actionRef.commentId}`
                    : notif.actionModel == 'Message'
                    ? `/Pages/Messanger?userId=${notif.actionRef}`
                    : notif.actionModel == 'User'
                    ? `/Pages/User/${notif.actionRef}`
                    : '/'
                }
                key={notif._id}
                className={`flex gap-4 p-3 rounded-xl transition cursor-pointer items-start 
                  bg-white dark:bg-darkMode-bg/60 shadow-sm hover:shadow-md
                  hover:scale-[1.01] active:scale-[0.99]
                  ${!notif.isRead ? 'relative' : ''}`}
              >
                {/* unread dot */}
                {!notif.isRead && (
                  <span className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}

                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                  {getIcon(notif.type)}
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    src={notif?.sender?.profilePhoto?.url || '/default-profile.png'}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-lightMode-fg dark:text-darkMode-fg leading-snug">
                    {notif.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-600 text-sm py-20">
              {t("No notifications")}
            </div>
          )}
        </div>

        {/* Footer */}
        {notificationsByUser.length > 0 && (
          <div className="pt-5 border-t mt-4 flex justify-between gap-3">
            <button
              onClick={markAllAsRead}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold py-3 rounded-xl transition hover:opacity-90"
            >
              {t("Mark all as read")}
            </button>
            <button
              onClick={clearAllNotifications}
              className="flex-1 bg-red-500 text-white text-sm font-semibold py-3 rounded-xl transition hover:bg-red-600"
            >
              {t("Clear All")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
