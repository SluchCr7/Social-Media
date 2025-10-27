'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowUp, FaPlus, FaHome, FaMusic, FaUserAlt, FaBell
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function FloatingDock({ onOpenMusicPlayer }) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  // 📜 إظهار/إخفاء الشريط أثناء التمرير
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setVisible(false); // يخفي عند النزول
      } else {
        setVisible(true); // يظهر عند الصعود
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] 
                 bg-white/80 dark:bg-black/60 backdrop-blur-xl 
                 shadow-lg border border-white/10 
                 flex items-center justify-around gap-3 sm:gap-6 
                 px-4 sm:px-6 py-2.5 sm:py-3 rounded-3xl 
                 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
    >
      {/* 🏠 الصفحة الرئيسية */}
      <button
        onClick={() => router.push('/')}
        className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
      >
        <FaHome size={18} />
      </button>

      {/* ➕ إنشاء منشور جديد */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={()=> router.push('/Pages/NewPost')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                   w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center 
                   shadow-lg hover:shadow-xl transition-all border-2 border-white/30"
      >
        <FaPlus size={20} />
      </motion.button>

      {/* 🎵 مشغل الموسيقى */}
      <button
        onClick={onOpenMusicPlayer}
        className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-pink-500 transition"
      >
        <FaMusic size={18} />
      </button>

      {/* 👤 الملف الشخصي */}
      <button
        onClick={() => router.push('/Pages/Profile')}
        className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-green-500 transition"
      >
        <FaUserAlt size={18} />
      </button>

      {/* 🔼 الرجوع للأعلى */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="hidden sm:flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
      >
        <FaArrowUp size={18} />
      </motion.button>
    </motion.div>
  );
}
