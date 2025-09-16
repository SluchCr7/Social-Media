'use client'
import React, { useEffect, useMemo } from 'react';
import { useMessage } from '../Context/MessageContext';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useAuth } from '../Context/AuthContext';

const MenuMessagesFromMe = () => {
  const { messagesByUser } = useMessage();
  const {user}= useAuth();
  // Filter messages from last 24 hours
  const recentMessages = useMemo(() => {
    const now = new Date().getTime();
    return messagesByUser?.filter((msg) => {
      const sentTime = new Date(msg?.createdAt).getTime();
      return now - sentTime <= 24 * 60 * 60 * 1000;
    }) || [];
  }, [messagesByUser]);
  
  return (
    <div className="w-full flex bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-col gap-3 py-3 ">
      <div className="w-full p-4 border-b  border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-base font-semibold">Messages from Last 24 Hours</h2>
      </div>

      <ul className="flex flex-col w-full text-sm text-text px-4 py-2 gap-4 max-h-60 overflow-y-auto">
        {recentMessages.length > 0 ? (
          recentMessages.map((msg, index) => (
            <Link href={`/Pages/Messanger?userId=${msg?.sender?._id}`} key={index} className="flex items-start gap-3 w-full bg-darkMode-bgSecondary p-3 rounded-lg hover:bg-darkMode-bgHover transition">
              <Image
                src={msg?.sender?.profilePhoto?.url || '/default-avatar.png'}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lightMode-fg dark:text-darkMode-fg font-semibold">{msg?.sender?.username}</span>
                  <span className="text-xs text-gray-500">{dayjs(msg?.createdAt).format('HH:mm')}</span>
                </div>
                <p className="text-gray-300 mt-1">{msg?.text}</p>
              </div>
            </Link>
          ))
        ) : (
          <li className="text-gray-400">No messages from the past 24 hours.</li>
        )}
      </ul>
    </div>
  );
};

export default MenuMessagesFromMe;
