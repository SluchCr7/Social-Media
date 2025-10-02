'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { useAside } from '../Context/AsideContext';
import { motion } from "framer-motion";

const Header = ({ unReadedMessage, setShowNotifications, activeTab, setActiveTab }) => {
  const { unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { isMobile, setIsMobileMenuOpen } = useAside();

  const handleBellClick = () => {
    setShowNotifications(true);
  };

  const tabs = [
    { key: "following", label: "Following" },
    { key: "forYou", label: "For You" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-darkMode-bg/70 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="w-full flex items-center justify-between px-3 md:px-6 h-14">
        
        {/* ✅ Tabs */}
        <div className="relative flex gap-6 h-full items-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-1 font-medium transition-colors h-full flex items-center ${
                activeTab === tab.key
                  ? "text-lightMode-text dark:text-darkMode-text"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-blue-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ✅ Actions */}
        <div className="flex items-center gap-3 h-full">
          {isLogin ? (
            <>
              {/* Notifications */}
              <div className="relative h-full flex items-center">
                <button
                  onClick={handleBellClick}
                  aria-label="Notifications"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-105"
                >
                  <Bell className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                </button>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* Messenger */}
              <Link href="/Pages/Messanger" className="relative h-full flex items-center">
                <button
                  aria-label="Messenger"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                </button>
                {unReadedMessage > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {unReadedMessage > 99 ? '99+' : unReadedMessage}
                  </span>
                )}
              </Link>

              {/* Menu (Mobile Only) */}
              {isMobile && (
                <div className="flex lg:hidden h-full items-center">
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Menu"
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkMode-bg2 transition-all duration-200 ease-in-out hover:scale-105"
                  >
                    <FiMenu className="w-5 h-5 text-lightMode-text dark:text-darkMode-text" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/Pages/Login" className="h-full flex items-center">
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
