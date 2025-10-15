// LoadingOverlay.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


const LoadingOverlay = ({ isLoading, progress = null }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const {t} = useTranslation()
  const messages = [
    'Preparing your upload...',
    'Uploading to server...',
    'Processing your media...',
    'Almost there...'
  ];
  // تغيير الرسائل تلقائيًا كل 3 ثواني
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Spinner */}
          <motion.div
            className="relative w-24 h-24 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ rotate: 360, scale: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-b-purple-500 border-l-transparent border-r-transparent animate-spin shadow-lg"></div>
            {progress !== null && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {Math.floor(progress)}%
              </div>
            )}
          </motion.div>

          {/* Animated message */}
          <motion.p
            key={msgIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white font-semibold text-lg text-center"
          >
            {progress !== null ? `Uploading... ${Math.floor(progress)}%` : messages[msgIndex]}
          </motion.p>

          {/* Optional subtle animation */}
          <motion.div
            className="absolute bottom-10 flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
