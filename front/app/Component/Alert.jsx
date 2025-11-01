'use client';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ notify }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notify) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notify]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-6 right-6 z-[1000] flex items-center gap-3 px-5 py-4 
          md:px-6 md:py-5 w-[90%] md:w-[360px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
          backdrop-blur-xl border border-white/20 bg-gradient-to-br from-emerald-500/80 to-teal-600/80 
          relative overflow-hidden"
        >
          {/* تأثير ضوء متحرك خلفي */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4, x: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
          />

          {/* أيقونة متحركة */}
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute inset-0 blur-md bg-white/30 rounded-full animate-pulse" />
            <FaCheckCircle className="text-white text-3xl drop-shadow-md relative z-10" />
          </motion.div>

          {/* النص */}
          <div className="flex-1">
            <p className="text-white font-semibold text-base md:text-lg drop-shadow-sm">
              {notify}
            </p>
            <motion.span
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-[3px] bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
