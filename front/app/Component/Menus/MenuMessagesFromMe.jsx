'use client';
import React, { memo, useMemo } from 'react';
import { useMessage } from '../../Context/MessageContext';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MenuMessagesFromMe = memo(() => {
  const { messagesByUser } = useMessage();
  const { user } = useAuth();
  const { t } = useTranslation();

  const recentMessages = useMemo(() => {
    const now = Date.now();
    return (
      messagesByUser?.filter((msg) => {
        if (!msg?.createdAt) return false;
        const sentTime = new Date(msg.createdAt).getTime();
        return now - sentTime <= 24 * 60 * 60 * 1000;
      }) || []
    );
  }, [messagesByUser]);

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
      {/* 📬 Header */}
      <div className="px-7 pt-7 pb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
          {t('Recent Activity')}
        </h2>
      </div>

      {/* 💬 Body */}
      <div className="flex flex-col gap-1 px-4 pb-6">
        <AnimatePresence mode="popLayout">
          {recentMessages.length > 0 ? (
            recentMessages.slice(0, 3).map((msg, idx) => (
              <motion.div
                key={msg?._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-1"
              >
                <Link
                  href={{
                    pathname: '/Pages/Messanger',
                    query: { userId: msg?.sender?._id },
                  }}
                  as={`/Pages/Messanger?userId=${msg?.sender?._id}`}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-indigo-500/10"
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-sm transition-transform duration-500 group-hover:scale-110">
                      <Image
                        src={msg?.sender?.profilePhoto?.url || '/default-avatar.png'}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white dark:border-[#0B0F1A] shadow-sm" />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {msg?.sender?.username || t('Creator')}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest tabular-nums">
                        {dayjs(msg?.createdAt).format('HH:mm')}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 truncate leading-relaxed">
                      {msg?.text || t('Shared a thought...')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 dark:text-gray-500 text-[10px] font-bold text-center py-10 uppercase tracking-widest"
            >
              {t('Quiet 24 hours')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🚀 Footer Link */}
      <div className="px-7 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <Link href="/Pages/Messanger" className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors tracking-wide uppercase">
          Jump to inbox
        </Link>
      </div>
    </div>
  );
});

MenuMessagesFromMe.displayName = 'MenuMessagesFromMe'
export default MenuMessagesFromMe;
