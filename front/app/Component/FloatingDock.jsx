'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

const MenuItem = memo(({ item, index, isOpen }) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        item.action();
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.03
      }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center justify-center w-11 h-11 rounded-2xl
                 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10
                 border border-white/20 dark:border-white/10
                 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400
                 shadow-sm backdrop-blur-md transition-colors"
    >
      <span className="text-xl">{item.icon}</span>

      {/* Tooltip */}
      <div className="absolute right-full mr-4 px-3 py-1.5 rounded-xl
                      bg-gray-900 dark:bg-white text-white dark:text-gray-900
                      text-[10px] font-black uppercase tracking-widest
                      opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                      transition-all duration-200 pointer-events-none whitespace-nowrap
                      shadow-xl border border-white/10">
        {item.label}
      </div>
    </motion.button>
  );
});

MenuItem.displayName = 'MenuItem';

const FloatingDock = ({ onOpenMusicPlayer }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dockRef = useRef(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsVisible(false);
      setIsOpen(false);
    } else {
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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-3 p-2 bg-white/20 dark:bg-black/20 backdrop-blur-2xl
                       rounded-[2.5rem] border border-white/20 dark:border-white/5
                       shadow-[0_20px_50px_rgba(0,0,0,0.1)] mb-2"
          >
            {menuItems.map((item, i) => (
              <MenuItem key={item.label} item={item} index={i} isOpen={isOpen} />
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`relative w-14 h-14 flex items-center justify-center rounded-[1.75rem]
                   transition-all duration-500 shadow-lg group overflow-hidden
                   ${isOpen
            ? 'bg-indigo-600 text-white'
            : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10'}
                  `}
      >
        {/* Subtle Ambient Glow */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 
                         group-hover:opacity-100 transition-opacity duration-500`} />

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative z-10"
        >
          {isOpen ? <HiChevronRight size={22} /> : <HiChevronLeft size={22} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default memo(FloatingDock);

