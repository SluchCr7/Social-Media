'use client';

import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Trash2, 
  CheckCheck,
  MoreHorizontal,
  Inbox,
  Lock
} from 'lucide-react';
import { useNotify } from '@/app/Context/NotifyContext';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import Link from 'next/link';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const NotificationItem = memo(({ notif, isRead, onRead, onDelete }) => {
  const { t } = useTranslation();
  
  const getIcon = (type) => {
    switch (type) {
      case 'comment': return <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><MessageSquare size={16} /></div>;
      case 'like': return <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><Heart size={16} /></div>;
      case 'follow': return <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><UserPlus size={16} /></div>;
      default: return <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl"><Bell size={16} /></div>;
    }
  };

  const getLink = () => {
    if (notif.actionModel === 'Post') return `/Pages/Post/${notif.actionRef}`;
    if (notif.actionModel === 'Comment') return `/Pages/Post/${notif.actionRef.postId}#comment-${notif.actionRef}`;
    if (notif.actionModel === 'Message') return `/Pages/Messanger?userId=${notif.actionRef}`;
    if (notif.actionModel === 'User') return `/Pages/User/${notif.actionRef}`;
    return '/';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        group relative flex items-start gap-4 p-5 rounded-[2rem] transition-all
        ${!isRead ? 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] border border-transparent'}
      `}
    >
      <Link href={getLink()} onClick={() => !isRead && onRead(notif._id)} className="flex-1 flex gap-4">
        <div className="relative shrink-0">
          <Avatar src={notif?.sender?.profilePhoto?.url} size="md" />
          <div className="absolute -bottom-1 -right-1 ring-4 ring-white dark:ring-black rounded-xl overflow-hidden scale-75">
            {getIcon(notif.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <p className={`text-[15px] leading-relaxed ${!isRead ? 'font-bold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 font-medium'}`}>
            {notif.content}
          </p>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-2 block">
            {dayjs(notif.createdAt).fromNow()}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
             e.preventDefault();
             onDelete(notif._id);
          }}
          className="p-2 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      {!isRead && (
        <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-500 rounded-full" />
      )}
    </motion.div>
  );
});

NotificationItem.displayName = 'NotificationItem';

export default function NotificationPage() {
  const { notificationsByUser, markAllAsRead, clearAllNotifications, markAsRead, deleteNotify } = useNotify();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = useMemo(() => {
    let list = notificationsByUser || [];
    if (filter === 'unread') list = list.filter(n => !n.isRead);
    return list;
  }, [notificationsByUser, filter]);

  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((acc, n) => {
      const date = dayjs(n.createdAt);
      let group = t('Earlier');
      if (date.isToday()) group = t('Today');
      else if (date.isYesterday()) group = t('Yesterday');
      
      if (!acc[group]) acc[group] = [];
      acc[group].push(n);
      return acc;
    }, {});
  }, [filteredNotifications, t]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black pb-24">
      {/* Premium Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{t("Activities")}</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">
              {notificationsByUser.filter(n => !n.isRead).length} {t("Unread notifications")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              <CheckCheck size={16} />
              <span className="hidden sm:inline">{t("Mark all read")}</span>
            </button>
            <button 
              onClick={clearAllNotifications}
              className="p-2 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-threads-border">
          {[
            { id: 'all', label: t('All') },
            { id: 'unread', label: t('Unread') },
            { id: 'mentions', label: t('Mentions') },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`pb-4 px-2 text-[13px] font-bold transition-all relative ${filter === f.id ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              {f.label}
              {filter === f.id && (
                <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-3xl mx-auto px-6 mt-8 space-y-12">
        {filteredNotifications.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 rounded-[3rem] bg-gray-50 dark:bg-white/5 mx-auto flex items-center justify-center text-gray-300 border border-dashed border-gray-200 dark:border-white/10">
              <Inbox size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t("All caught up!")}</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">{t("No new notifications to show.")}</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, notifs]) => (
            <div key={group} className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-4">{group}</h3>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {notifs.map(n => (
                    <NotificationItem 
                      key={n._id} 
                      notif={n} 
                      isRead={n.isRead} 
                      onRead={markAsRead}
                      onDelete={deleteNotify}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
