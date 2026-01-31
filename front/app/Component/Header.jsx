'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, MessageCircle, Search, Menu } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from "react-icons/io";
import { useAside } from '../Context/AsideContext';
import { motion } from "framer-motion";
import { tabsHeader } from '../utils/Data';
import { useTranslation } from 'react-i18next';

const Header = ({ unReadedMessage, setShowNotifications, activeTab, setActiveTab }) => {
  const { unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { isMobile, setIsMobileMenuOpen } = useAside();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#050505cc] backdrop-blur-2xl transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">

        {/* Brand/Logo - Optional: You can uncomment or add a logo here if needed */}

        {/* Tab Navigation - Professional Pill Design */}
        <nav className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/5 hidden md:flex transition-colors">
          {tabsHeader.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.key
                ? "text-indigo-600 dark:text-white"
                : "text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                }`}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="headerTabPill"
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-inner"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Search Trigger */}
          <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white transition-all hover:bg-gray-200 dark:hover:bg-white/10">
            <Link href="/Pages/Search"><Search className="w-5 h-5" /></Link>
          </button>

          {isLogin ? (
            <>
              {/* Notification Hub */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className={`p-2.5 rounded-xl border transition-all ${unreadCount > 0
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  <Bell className="w-5 h-5" />
                </button>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[8px] font-black text-white items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </motion.span>
                )}
              </div>

              {/* Messenger Port */}
              <Link href="/Pages/Messanger" className="relative">
                <button
                  className={`p-2.5 rounded-xl border transition-all ${unReadedMessage > 0
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-purple-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                {unReadedMessage > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[8px] font-black text-white shadow-lg">
                    {unReadedMessage > 9 ? '9+' : unReadedMessage}
                  </span>
                )}
              </Link>

              {/* Mobile Menu */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            <Link
              href="/Pages/Login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
            >
              <IoIosLogIn size={18} />
              <span>Enter</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
