'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, MessageCircle, Search, Menu } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from 'react-icons/io';
import { useAside } from '../Context/AsideContext';
import { motion } from 'framer-motion';
import { tabsHeader } from '../utils/Data';
import { useTranslation } from 'react-i18next';

const Header = ({ unReadedMessage, setShowNotifications, activeTab, setActiveTab }) => {
  const { unreadCount } = useNotify();
  const { isLogin } = useAuth();
  const { isMobile, setIsMobileMenuOpen } = useAside();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-[#050505cc] backdrop-blur-2xl transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <nav aria-label={t('Feed tabs')} className="hidden md:flex items-center gap-2 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-100/90 dark:bg-white/5 p-1 shadow-sm">
          {tabsHeader.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              className={`relative overflow-hidden rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${activeTab === tab.key
                ? 'text-indigo-600 dark:text-white'
                : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              {activeTab === tab.key && (
                <motion.span
                  layoutId="headerTabPill"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-white/10 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/Pages/Search"
            aria-label={t('Search')}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200/80 bg-gray-100/95 px-3 py-2 text-gray-600 transition-all hover:border-indigo-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
          >
            <Search className="w-5 h-5" />
          </Link>

          {isLogin ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(true)}
                  aria-label={t('Open notifications')}
                  className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-gray-600 transition-all border ${unreadCount > 0
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600'
                    : 'border-gray-200/80 bg-gray-100/95 hover:border-indigo-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </button>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center"
                  >
                    <span className="animate-ping absolute inset-0 rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-black text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </motion.span>
                )}
              </div>

              <Link
                href="/Pages/Messanger"
                aria-label={t('Open messages')}
                className="relative inline-flex items-center justify-center rounded-xl px-3 py-2 border border-gray-200/80 bg-gray-100/95 text-gray-600 transition-all hover:border-purple-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
              >
                <MessageCircle className="w-5 h-5" />
                {unReadedMessage > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[8px] font-black text-white shadow-sm">
                    {unReadedMessage > 9 ? '9+' : unReadedMessage}
                  </span>
                )}
              </Link>

              {isMobile && (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label={t('Open mobile menu')}
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 border border-gray-200/80 bg-gray-100/95 text-gray-600 transition-all hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            <Link
              href="/Pages/Login"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
            >
              <IoIosLogIn size={16} />
              <span>{t('Enter')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
