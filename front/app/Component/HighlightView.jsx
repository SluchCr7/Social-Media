'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

export default function HighlightViewerModal({ highlight, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const stories = highlight?.stories || [];

  useEffect(() => {
    if (!stories.length) return;

    // Reset progress when story changes
    setProgress(0);
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1.5;
      });
    }, 80); // سرعة الشريط

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose(); // اغلاق المودال بعد آخر قصة
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  if (!highlight) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white hover:opacity-80 z-[110]"
        >
          <FaTimes size={22} />
        </button>

        {/* محتوى العرض */}
        <div className="relative w-full max-w-sm h-[80vh] flex flex-col items-center justify-center">
          {/* Progress bars */}
          <div className="absolute top-3 left-0 right-0 flex gap-1 px-4">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 bg-gray-600 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            ))}
          </div>

          {/* الصورة */}
          <motion.div
            key={stories[currentIndex]?._id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={stories[currentIndex]?.Photo || '/placeholder.jpg'}
                alt={`Story ${currentIndex + 1}`}
                fill
                className="object-cover select-none"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* عنوان الـ highlight */}
          <div className="absolute bottom-5 text-center w-full text-white">
            <h3 className="text-lg font-semibold">{highlight.title}</h3>
            <p className="text-sm opacity-80 mt-1">
              {currentIndex + 1} / {stories.length}
            </p>
          </div>

          {/* أزرار التنقل */}
          <div className="absolute inset-0 flex justify-between items-center px-4 text-white">
            <button
              onClick={handlePrev}
              className="w-1/3 h-full cursor-pointer flex items-center"
            >
              <FaChevronLeft className="opacity-70 hover:opacity-100" />
            </button>
            <button
              onClick={handleNext}
              className="w-1/3 h-full cursor-pointer flex items-center justify-end"
            >
              <FaChevronRight className="opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
