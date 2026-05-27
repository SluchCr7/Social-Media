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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <section className="surface-card border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#0b1220] p-6 sm:p-8 shadow-card">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-indigo-600">
                <Bell className="h-3.5 w-3.5" />
                {t('Activities')}
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">{t('Activity Feed')}</h1>
                <p className="max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                  {notificationsByUser.filter(n => !n.isRead).length} {t('unread notifications')} · {filteredNotifications.length} {t('shown')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                <CheckCheck size={16} />
                {t('Mark all read')}
              </button>
              <button
                type="button"
                onClick={clearAllNotifications}
                className="inline-flex items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                aria-label={t('Clear notifications')}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200/80 dark:border-white/10 pt-4">
            {[
              { id: 'all', label: t('All') },
              { id: 'unread', label: t('Unread') },
              { id: 'mentions', label: t('Mentions') },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${filter === f.id
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-8">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200/80 bg-slate-50 p-16 text-center dark:border-white/10 dark:bg-white/5">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white dark:bg-slate-900 text-slate-400 shadow-sm">
                <Inbox size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t('All caught up!')}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('No new notifications to show.')}</p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([group, notifs]) => (
              <div key={group} className="space-y-4">
                <h3 className="px-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {group}
                </h3>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {notifs.map((n) => (
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
    </div>
  );
}
