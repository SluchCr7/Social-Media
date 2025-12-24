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
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[#050505cc] backdrop-blur-2xl">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">

        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-xl italic">Z</span>
          </div>
          <span className="hidden sm:block text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
            Zocial
          </span>
        </Link>

        {/* Tab Navigation - Professional Pill Design */}
        <nav className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5 hidden md:flex">
          {tabsHeader.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.key
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
                }`}
            >
              <span className="relative z-10">{t(tab.label)}</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="headerTabPill"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 shadow-inner"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Search Trigger */}
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all hover:bg-white/10">
            <Search className="w-5 h-5" />
          </button>

          {isLogin ? (
            <>
              {/* Notification Hub */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className={`p-2.5 rounded-xl border transition-all ${unreadCount > 0 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
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
                  className={`p-2.5 rounded-xl border transition-all ${unReadedMessage > 0 ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
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
                  className="p-2.5 rounded-xl bg-white/10 text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            <Link
              href="/Pages/Login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5"
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
