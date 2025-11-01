'use client';
import React, { memo, useMemo } from 'react';
import { useMessage } from '../../Context/MessageContext';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from 'react-i18next';

const MenuMessagesFromMe = memo(() => {
  const { messagesByUser } = useMessage();
  const { user } = useAuth();
  const { t } = useTranslation();

  // ✅ استخدم useMemo لتصفية الرسائل مرة واحدة فقط عند التغير
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
    <div className="w-full bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 border-b border-gray-300/30">
        <h2 className="text-white font-semibold text-base md:text-lg">
          {t('Messages from Last 24 Hours')}
        </h2>
      </div>

      {/* Body */}
      <ul className="flex flex-col gap-3 px-4 py-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {recentMessages.length > 0 ? (
          recentMessages.map((msg) => (
            <Link
              key={msg?._id}
              href={{
                pathname: '/Pages/Messanger',
                query: { userId: msg?.sender?._id },
              }}
              as={`/Pages/Messanger?userId=${msg?.sender?._id}`}
              className="group flex items-start gap-3 bg-gray-50 dark:bg-[#1c1e22] p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#25282c] transition-all duration-200 border border-transparent hover:border-blue-500/30"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Image
                  src={msg?.sender?.profilePhoto?.url || '/default-avatar.png'}
                  alt="avatar"
                  width={44}
                  height={44}
                  className="rounded-full object-cover border border-gray-300 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#16181c]" />
              </div>

              {/* Message Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {msg?.sender?.username || t('Unknown')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(msg?.createdAt).format('HH:mm')}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words line-clamp-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  {msg?.text || t('No message content')}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400 text-center py-8">
            {t('No messages from the past 24 hours.')}
          </li>
        )}
      </ul>
    </div>
  );
});

export default MenuMessagesFromMe;
