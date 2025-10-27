'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaMusic, FaPlus, FaArrowUp, FaUserAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function FloatingDrawer({ onOpenMusicPlayer }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  // 📜 إخفاء السهم أثناء التمرير للأسفل
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) setVisible(false);
      else setVisible(true);
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* 🔹 زر الفتح / الإغلاق */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 -translate-y-1/2 right-2 z-[100] cursor-pointer"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/80 dark:bg-black/70 backdrop-blur-md border border-white/20 shadow-md 
                     p-2 rounded-full hover:shadow-lg text-gray-800 dark:text-gray-200 transition"
        >
          {isOpen ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </motion.button>
      </motion.div>

      {/* 🌙 Drawer الجانبي */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-[90]
                       bg-white/90 dark:bg-black/70 backdrop-blur-2xl 
                       border border-white/20 shadow-2xl 
                       rounded-2xl flex flex-col items-center gap-6 p-4 w-16 sm:w-20"
          >
            {/* 🏠 الرئيسية */}
            <button
              onClick={() => router.push('/')}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
            >
              <FaHome size={18} />
            </button>

            {/* ✍️ منشور جديد */}
            <button
              onClick={() => router.push('/Pages/NewPost')}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
            >
              <FaPlus size={18} />
            </button>

            {/* 🎵 الموسيقى */}
            <button
              onClick={onOpenMusicPlayer}
              className="text-gray-700 dark:text-gray-200 hover:text-pink-500 transition"
            >
              <FaMusic size={18} />
            </button>

            {/* 👤 البروفايل */}
            <button
              onClick={() => router.push('/Pages/Profile')}
              className="text-gray-700 dark:text-gray-200 hover:text-green-500 transition"
            >
              <FaUserAlt size={18} />
            </button>

            {/* 🔼 لأعلى */}
            <button
              onClick={scrollToTop}
              className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition"
            >
              <FaArrowUp size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
