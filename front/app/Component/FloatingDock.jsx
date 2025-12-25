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
  const drawerRef = useRef(null);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setVisible(false);
        setIsOpen(false); // Close drawer on scroll down for better UX
      } else {
        setVisible(true);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const menuItems = [
    { icon: <FaHome />, label: 'Home', action: () => router.push('/') },
    { icon: <FaPlus />, label: 'Post', action: () => router.push('/Pages/NewPost') },
    { icon: <FaMusic />, label: 'Music', action: onOpenMusicPlayer },
    { icon: <FaUserAlt />, label: 'Profile', action: () => router.push('/Pages/Profile') },
    { icon: <FaArrowUp />, label: 'Top', action: scrollToTop },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={drawerRef}
      className="fixed top-1/2 right-4 -translate-y-1/2 z-[100] flex items-center gap-4"
    >
      {/* 🚀 Hoverable Item Labels & Menu Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, x: 20, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex flex-col items-center gap-3 p-3 
                       bg-white/10 dark:bg-black/20
                       backdrop-blur-3xl border border-white/20 dark:border-white/5 
                       shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
                       rounded-[2rem]"
          >
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                whileTap={{ scale: 0.9 }}
                className="group relative w-12 h-12 flex items-center justify-center 
                           rounded-2xl text-gray-700 dark:text-gray-300
                           transition-all duration-300"
              >
                <span className="text-xl group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {item.icon}
                </span>

                {/* Tooltip-like label */}
                <span className="absolute right-full mr-4 px-3 py-1.5 rounded-xl bg-gray-900/80 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔘 Main Toggle Button */}
      <motion.div
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? 0 : 40,
          scale: visible ? 1 : 0.8
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-14 h-14 flex items-center justify-center 
            bg-white dark:bg-[#0B0F1A]
            border border-gray-100 dark:border-white/10
            shadow-[0_8px_20px_rgba(0,0,0,0.1)] dark:shadow-none
            rounded-[1.25rem] transition-all duration-500
            ${isOpen ? 'ring-2 ring-indigo-500/20' : ''}
          `}
        >
          {/* Animated Background Mesh for the button */}
          <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden opacity-0 dark:opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="absolute -top-full -left-full w-[300%] h-[300%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent animate-spin-slow" />
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="relative z-10 text-gray-500 dark:text-gray-400"
          >
            {isOpen ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}

