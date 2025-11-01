'use client';
import React, { useEffect, useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = memo(function LoadingOverlay({ isLoading, progress = null }) {
  const { t } = useTranslation();
  const [msgIndex, setMsgIndex] = useState(0);

  // ✅ تثبيت الرسائل في الذاكرة
  const messages = useMemo(
    () => [
      t('Preparing your upload...'),
      t('Uploading to server...'),
      t('Processing your media...'),
      t('Almost there...'),
    ],
    [t]
  );

  // ✅ تغيير الرسائل تلقائيًا
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading, messages.length]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center 
                     bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70 
                     backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* 🔵 Spinner */}
          <motion.div
            className="relative w-24 h-24 mb-6"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-4 
                            border-t-blue-400 border-b-purple-500 
                            border-l-transparent border-r-transparent 
                            shadow-md shadow-blue-400/20" />
            {progress !== null && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {Math.floor(progress)}%
              </div>
            )}
          </motion.div>

          {/* ✨ الرسالة */}
          <motion.p
            key={msgIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white font-semibold text-lg text-center"
          >
            {progress !== null
              ? `${t('Uploading...')} ${Math.floor(progress)}%`
              : messages[msgIndex]}
          </motion.p>

          {/* ⚪ النقاط المتحركة بالأسفل */}
          <motion.div
            className="absolute bottom-10 flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default LoadingOverlay;
