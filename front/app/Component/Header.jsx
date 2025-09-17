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
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-darkMode-bg/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full flex items-center justify-between py-4 md:px-6 ">
        {/* Title */}
        <span className="text-lightMode-text dark:text-darkMode-text font-bold text-lg md:text-xl tracking-[3px] uppercase">
          Home
        </span>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isLogin ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <Bell
                  aria-label="Notifications"
                  onClick={handleBellClick}
                  className="w-6 h-6 text-lightMode-text dark:text-darkMode-text cursor-pointer hover:text-lightMode-text2 dark:hover:text-darkMode-text hover:scale-110 transition-transform"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* Messages */}
              <Link href="/Pages/Messanger" className="relative">
                <MessageCircle
                  aria-label="Messages"
                  className="w-6 h-6 text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text hover:scale-110 transition-transform"
                />
                {unReadedMessage > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-bounce">
                    {unReadedMessage > 99 ? '99+' : unReadedMessage}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link href="/Pages/Login">
              <IoIosLogIn
                aria-label="Login"
                className="w-6 h-6 text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text2 dark:hover:text-darkMode-text hover:scale-110 transition-transform"
              />
            </Link>
          )}
        </div>
      </div>
    </header>

  );
};

export default Header;
