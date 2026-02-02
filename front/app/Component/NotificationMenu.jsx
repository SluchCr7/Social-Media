'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiBell,
  HiHeart,
  HiChatBubbleLeftRight,
  HiUserPlus,
  HiEnvelope,
  HiTrash,
  HiCheckCircle,
  HiInboxStack
} from 'react-icons/hi2';
import { useNotify } from '../Context/NotifyContext';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getIcon = (type) => {
  switch (type) {
    case 'comment':
      return <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><HiChatBubbleLeftRight size={18} /></div>;
    case 'like':
      return <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><HiHeart size={18} /></div>;
    case 'follow':
      return <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><HiUserPlus size={18} /></div>;
    case 'message':
      return <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><HiEnvelope size={18} /></div>;
    default:
      return <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl"><HiBell size={18} /></div>;
  }
};

const NotificationMenu = ({ showNotifications, setShowNotifications }) => {
  const {
    notificationsByUser,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
    deleteNotify
  } = useNotify();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notificationsByUser.filter(n => !n.isRead);
    }
    return notificationsByUser;
  }, [notificationsByUser, filter]);

  useEffect(() => {
    if (showNotifications) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showNotifications]);

  return (
    <AnimatePresence>
      {showNotifications && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Side Menu */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full sm:w-[480px] h-full bg-white dark:bg-[#0B0F1A] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-8 pb-6 border-b border-gray-100 dark:border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    {t("Notifications")}
                    {notificationsByUser.some(n => !n.isRead) && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    )}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mt-1">
                    {notificationsByUser.length} {t("Total Activities")}
                  </p>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-500/20"
                >
                  <HiXMark size={20} />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
                {[
                  { id: 'all', label: t('All'), count: notificationsByUser.length },
                  { id: 'unread', label: t('Unread'), count: notificationsByUser.filter(n => !n.isRead).length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${filter === tab.id
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${filter === tab.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                        }`}>
                        {tab.count}
                      </span>
                    )}
                    {filter === tab.id && (
                      <motion.div
                        layoutId="navTab"
                        className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm -z-10 border border-gray-100 dark:border-white/5"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      key={notif._id}
                    >
                      <Link
                        href={
                          notif.actionModel === 'Post'
                            ? `/Pages/Post/${notif.actionRef}`
                            : notif.actionModel === 'Comment'
                              ? `/Pages/Post/${notif.actionRef.postId}#comment-${notif.actionRef}`
                              : notif.actionModel === 'Message'
                                ? `/Pages/Messanger?userId=${notif.actionRef}`
                                : notif.actionModel === 'User'
                                  ? `/Pages/User/${notif.actionRef}`
                                  : '/'
                        }
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif._id);
                          setShowNotifications(false);
                        }}
                        className={`group relative flex gap-4 p-4 rounded-3xl transition-all border ${!notif.isRead
                            ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-600/5 dark:to-purple-600/5 border-indigo-100 dark:border-indigo-500/20 shadow-sm'
                            : 'bg-white dark:bg-white/[0.02] border-gray-100 dark:border-white/5 hover:border-indigo-500/30'
                          }`}
                      >
                        {/* Unread Indicator */}
                        {!notif.isRead && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        )}

                        {/* Sender Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white dark:border-[#0B0F1A] shadow-md group-hover:scale-110 transition-transform">
                            <Image
                              src={notif?.sender?.profilePhoto?.url || '/default-profile.png'}
                              alt="Sender"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 ring-4 ring-white dark:ring-[#0B0F1A] rounded-xl overflow-hidden shadow-sm scale-75">
                            {getIcon(notif.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 dark:text-white/90 leading-relaxed mb-1">
                            {notif.content}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              {dayjs(notif.createdAt).fromNow()}
                            </span>
                            {!notif.isRead && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  markAsRead(notif._id);
                                }}
                                className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600"
                              >
                                {t("Mark Read")}
                              </button>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6"
                  >
                    <div className="w-24 h-24 rounded-[3rem] bg-indigo-500/5 flex items-center justify-center text-indigo-500/20 border-2 border-dashed border-indigo-500/10">
                      <HiInboxStack size={48} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        {t("Inner Peace")}
                      </h3>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest leading-loose">
                        {t("No notifications found under this filter")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAllAsRead}
                  disabled={notificationsByUser.length === 0}
                  className="flex-1 py-4 px-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-gray-900 dark:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <HiCheckCircle size={16} />
                  {t("Mark All Read")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAllNotifications}
                  disabled={notificationsByUser.length === 0}
                  className="w-16 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                  title={t("Clear All")}
                >
                  <HiTrash size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationMenu;
