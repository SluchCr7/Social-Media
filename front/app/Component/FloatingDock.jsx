'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const drawerRef = useRef(null); // ✅ المرجع للمكون

  // 📜 إخفاء الزر أثناء التمرير للأسفل
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

  // 🧠 إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={drawerRef} // ✅ أضف المرجع هنا
      className="fixed top-1/2 right-3 -translate-y-1/2 z-[100] 
                 flex items-center gap-3"
    >
      {/* 🌙 Drawer الجانبي */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="flex flex-col items-center justify-center gap-4 
                       bg-gradient-to-br from-white/60 to-white/30 
                       dark:from-gray-900/80 dark:to-gray-800/60 
                       backdrop-blur-2xl border border-white/20 shadow-2xl 
                       rounded-3xl p-4 w-20"
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

      {/* 🔹 زر الفتح / الإغلاق */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-white/60 to-white/30 
                     dark:from-gray-800/70 dark:to-gray-900/50 
                     backdrop-blur-md border border-white/20 shadow-lg 
                     p-3 rounded-full hover:shadow-xl transition 
                     text-gray-800 dark:text-gray-200"
        >
          {isOpen ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
        </motion.button>
      </motion.div>
    </div>
  );
}
