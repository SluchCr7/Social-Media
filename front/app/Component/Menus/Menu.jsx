'use client'
import React, { useState } from 'react';
import MenuFollowers from './MenuFollowers';
import MenuMessagesFromMe from './MenuMessagesFromMe';
import { useAuth } from '../../Context/AuthContext';
import HashtagsMenu from './HashtagsMenu';
import Communities from './Communities';
import Link from 'next/link';
import News from './News';
import MenuAllNews from '../MenuAllNews';
import MenuFrinds from './MenuFrinds';
import MenuUpComingEvents from './MenuUpComingEvents';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Menu = () => {
  const { user, isLogin } = useAuth();
  const { t } = useTranslation()
  const [showAllNews, setShowAllNews] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hidden xl:flex flex-col items-start gap-8 w-[35%] min-h-screen bg-lightMode-bg dark:bg-darkMode-bg px-8 py-10 transition-colors duration-500"
    >
      {isLogin ? (
        <>
          <MenuUpComingEvents />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/5 to-transparent opacity-50" />

          <HashtagsMenu />
          <News showAllNews={showAllNews} setShowAllNews={setShowAllNews} />

          <div className="w-full grid grid-cols-1 gap-8">
            <MenuMessagesFromMe />
            <Communities />
          </div>

          <MenuFrinds />
          <MenuAllNews showAllNews={showAllNews} setShowAllNews={setShowAllNews} />

          <div className="mt-auto pt-10 pb-4 w-full">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <Link href="/Pages/Privacy" className="hover:text-indigo-500 transition-colors">{t("Privacy")}</Link>
                <Link href="/Pages/Terms" className="hover:text-indigo-500 transition-colors">{t("Terms")}</Link>
                <Link href="/Pages/Help" className="hover:text-indigo-500 transition-colors">{t("Help")}</Link>
              </div>
              <p className="text-[10px] font-medium text-gray-400/60 dark:text-gray-600 text-center leading-relaxed">
                {t("Zocial v1.0.0")} &bull; {t("© 2025 All rights reserved.")}<br />
                {t("Built with passion for real connections.")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl text-center"
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-indigo-500/20 shadow-2xl">
              <span className="text-white text-3xl font-black">Z</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Welcome to Sluchit</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              Join our community to explore curated hashtags, real-time news, and connect with passionate creators worldwide.
            </p>
            <Link
              href="/Pages/Login"
              className="mt-8 inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm hover:shadow-xl transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
