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
      }, 3000); // إخفاء بعد 3 ثوانٍ
      return () => clearTimeout(timer);
    }
  }, [notify]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 right-6 z-[1000] flex items-center gap-3 p-4 md:p-5 
          w-[90%] md:w-[350px] rounded-2xl shadow-2xl backdrop-blur-md 
          bg-gradient-to-r from-green-500/90 to-emerald-600/90 border border-white/20"
        >
          <FaCheckCircle className="text-white text-2xl animate-pulse" />
          <p className="text-white font-medium text-sm md:text-base">{notify}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
