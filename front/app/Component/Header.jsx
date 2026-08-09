'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, MessageCircle, Search, Menu, PlusSquare , ShieldCheck } from 'lucide-react';
import { useNotify } from '../Context/NotifyContext';
import { useAuth } from '../Context/AuthContext';
import { IoIosLogIn } from 'react-icons/io';
import { useAside } from '../Context/AsideContext';
import { motion } from 'framer-motion';
import { tabsHeader } from '../utils/Data';
import { useTranslation } from 'react-i18next';

const Header = ({ unReadedMessage, setShowNotifications, activeTab, setActiveTab }) => {
  const { unreadCount } = useNotify();
  const { isLogin , user } = useAuth();
  const { isMobile, setIsMobileMenuOpen } = useAside();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-[#050505e6] dark:text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <nav
          aria-label={t('Feed tabs')}
          className="hidden items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-100/90 p-1 shadow-sm shadow-slate-200/60 backdrop-blur-md md:flex dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
        >
          {tabsHeader.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              className={`relative overflow-hidden rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${activeTab === tab.key
                ? 'text-indigo-600 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/70 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              {activeTab === tab.key && (
                <motion.span
                  layoutId="headerTabPill"
                  className="absolute inset-0 rounded-xl bg-white/95 shadow-sm shadow-slate-200/70 dark:bg-white/10 dark:shadow-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {user?.isAdmin && (
            <Link
              href="/Admin"
              aria-label={t('Admin')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/95 px-3 py-2 text-slate-600 transition-all hover:border-indigo-300 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>
          )}
          <Link
            href="/Pages/Search"
            aria-label={t('Search')}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/95 px-3 py-2 text-slate-600 transition-all hover:border-indigo-300 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Link>

          {isLogin ? (
            <>
              <Link
                href="/Pages/NewPost"
                aria-label={t('Create New Post')}
                className="inline-flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-indigo-600 transition-all hover:bg-indigo-500/20 hover:text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
              >
                <PlusSquare className="h-5 w-5" />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(true)}
                  aria-label={t('Open notifications')}
                  className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 transition-all ${unreadCount > 0
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 shadow-sm shadow-indigo-500/10 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'border-slate-200/80 bg-slate-100/95 text-slate-600 hover:border-indigo-300 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                </button>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-black text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </motion.span>
                )}
              </div>

              <Link
                href="/Pages/Messanger"
                aria-label={t('Open messages')}
                className="relative inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/95 px-3 py-2 text-slate-600 transition-all hover:border-purple-300 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
                {unReadedMessage > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[8px] font-black text-white shadow-sm">
                    {unReadedMessage > 9 ? '9+' : unReadedMessage}
                  </span>
                )}
              </Link>

              {isMobile && (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label={t('Open mobile menu')}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/95 px-3 py-2 text-slate-600 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
            </>
          ) : (
            <Link
              href="/Pages/Login"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
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