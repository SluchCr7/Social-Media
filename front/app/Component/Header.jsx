'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from "react-icons/io";

const Header = ({ unReadedMessage, setShowNotifications }) => {
  const { unreadCount } = useNotify();
  const { isLogin } = useAuth();

  const handleBellClick = () => {
    setShowNotifications(true);
  };

  return (
    <div className="w-full flex items-center justify-between mb-4">
      <span className="text-lightMode-text dark:text-darkMode-text font-bold text-xl tracking-[3px] uppercase">
        Home
      </span>
      <div className="flex items-center gap-4">
        {isLogin ? (
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Bell
                onClick={handleBellClick}
                className="text-[24px] text-lightMode-text dark:text-darkMode-text cursor-pointer hover:text-lightMode-text2 dark:hover:text-darkMode-text transition"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>

            {/* Messages */}
            <Link href="/Pages/Messanger" className="relative">
              <MessageCircle className="text-[24px] text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text cursor-pointer transition" />
              {unReadedMessage > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
                  {unReadedMessage > 99 ? '99+' : unReadedMessage}
                </span>
              )}
            </Link>
          </div>
        ) : (
          <Link href="/Pages/Login">
            <IoIosLogIn className="text-[24px] text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text cursor-pointer" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
