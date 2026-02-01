'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiPlus,
  HiMusicalNote,
  HiUser,
  HiArrowUp,
  HiChevronRight,
  HiChevronLeft,
} from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

const MenuItem = memo(({ item, index }) => (
  <motion.button
    onClick={(e) => {
      e.stopPropagation();
      item.action();
    }}
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.5, y: 20 }}
    transition={{
      type: 'spring',
      stiffness: 400,
      damping: 30,
      delay: index * 0.04
    }}
    whileHover={{ scale: 1.15, y: -4 }}
    whileTap={{ scale: 0.9 }}
    className="group relative flex items-center justify-center w-12 h-12 rounded-[1.25rem]
               bg-white/40 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1]
               border border-white/20 dark:border-white/10
               text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400
               shadow-sm backdrop-blur-2xl transition-all duration-300"
  >
    <span className="text-xl">{item.icon}</span>

    {/* Refined Tooltip */}
    <div className="absolute right-full mr-4 px-3 py-1.5 rounded-xl
                    bg-gray-900/90 dark:bg-white/95 text-white dark:text-gray-900
                    text-[9px] font-black uppercase tracking-[0.15em]
                    opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                    transition-all duration-300 pointer-events-none whitespace-nowrap
                    shadow-2xl border border-white/10">
      {item.label}
    </div>

    {/* Bottom Indicator Dot */}
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.button>
));

MenuItem.displayName = 'MenuItem';

const FloatingDock = ({ onOpenMusicPlayer }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dockRef = useRef(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
      setIsVisible(false);
      setIsOpen(false);
    } else if (currentScrollY < lastScrollY.current) {
      setIsVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  const menuItems = [
    { icon: <HiHome />, label: 'Home', action: () => router.push('/') },
    { icon: <HiPlus />, label: 'Post', action: () => router.push('/Pages/NewPost') },
    { icon: <HiMusicalNote />, label: 'Music', action: onOpenMusicPlayer },
    { icon: <HiUser />, label: 'Profile', action: () => router.push('/Pages/Profile') },
    { icon: <HiArrowUp />, label: 'Top', action: scrollToTop },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dockRef.current && !dockRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div
      ref={dockRef}
      className="fixed bottom-10 right-6 sm:right-10 z-[100] flex flex-col items-center gap-4"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
            className="flex flex-col gap-3 p-2.5 bg-white/20 dark:bg-black/10 backdrop-blur-3xl
                       rounded-[2.5rem] border border-white/20 dark:border-white/5
                       shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] mb-1"
          >
            {menuItems.map((item, i) => (
              <MenuItem key={item.label} item={item} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 50,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`relative w-15 h-15 w-14 h-14 flex items-center justify-center rounded-[1.5rem]
                   transition-all duration-500 shadow-2xl group overflow-hidden
                   ${isOpen
            ? 'bg-indigo-600 text-white shadow-indigo-500/30'
            : 'bg-white dark:bg-[#0E1117] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10'}
                  `}
      >
        {/* Animated Background Mesh */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 
                         group-hover:opacity-100 transition-opacity duration-700`} />

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative z-10"
        >
          {isOpen ? <HiChevronRight size={24} /> : <HiChevronLeft size={24} />}
        </motion.div>

        {/* Glow effect on hover */}
        {!isOpen && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/5 blur-xl pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
};

export default memo(FloatingDock);


