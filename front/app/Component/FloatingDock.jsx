'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaMusic,
  FaPlus,
  FaArrowUp,
  FaUserAlt,
  FaChevronLeft,
  FaChevronRight,
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

  const menuItems = [
    { icon: <FaHome />, color: 'from-blue-500 to-cyan-400', action: () => router.push('/') },
    { icon: <FaPlus />, color: 'from-indigo-500 to-purple-500', action: () => router.push('/Pages/NewPost') },
    { icon: <FaMusic />, color: 'from-pink-500 to-rose-400', action: onOpenMusicPlayer },
    { icon: <FaUserAlt />, color: 'from-green-500 to-emerald-400', action: () => router.push('/Pages/Profile') },
    { icon: <FaArrowUp />, color: 'from-yellow-500 to-orange-400', action: scrollToTop },
  ];

  return (
    <>
      {/* 🔹 زر الفتح / الإغلاق */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 -translate-y-1/2 right-3 z-[100]"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/70 dark:to-gray-900/50 
                     backdrop-blur-md border border-white/20 shadow-lg 
                     p-3 rounded-full hover:shadow-xl transition text-gray-800 dark:text-gray-200"
        >
          {isOpen ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
        </motion.button>
      </motion.div>

      {/* 🌙 Drawer الجانبي */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="fixed top-1/2 -translate-y-1/2 right-6 z-[90]
                       bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-900/80 dark:to-gray-800/60
                       backdrop-blur-2xl border border-white/20 shadow-2xl 
                       rounded-3xl flex flex-col items-center justify-center gap-6 p-5 w-20"
          >
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                onClick={item.action}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`w-11 h-11 flex items-center justify-center 
                            rounded-2xl text-white shadow-md 
                            bg-gradient-to-br ${item.color}
                            transition-transform duration-200 hover:shadow-lg`}
              >
                {item.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
