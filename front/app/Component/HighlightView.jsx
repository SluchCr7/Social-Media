'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

export default function HighlightViewerModal({ highlight, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const stories = highlight?.stories || [];

  // توحيد شكل الصورة
  const getPhoto = (story) => {
    if (!story) return '/placeholder.jpg';
    return Array.isArray(story.Photo) ? story.Photo[0] : story.Photo;
  };

  useEffect(() => {
    if (!stories.length) return;

    clearInterval(intervalRef.current);
    setProgress(0);

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 70); // سرعة الشريط (كل 70ms)
    }

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
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
        <div
          className="relative w-full max-w-sm h-[80vh] flex flex-col items-center justify-center"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute top-3 left-0 right-0 flex gap-1 px-4 z-20">
            {stories.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 bg-white/30 h-1 rounded-full overflow-hidden"
              >
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
                  transition={{ ease: 'linear', duration: 0.05 }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 flex items-center gap-3 z-20">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50">
              <Image
                src={highlight.coverImage || '/placeholder.jpg'}
                alt="Highlight cover"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="text-white">
              <h3 className="text-sm font-semibold leading-none">
                {highlight.title}
              </h3>
              <p className="text-xs opacity-70">
                {currentIndex + 1}/{stories.length}
              </p>
            </div>
          </div>

          {/* الصورة */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={getPhoto(stories[currentIndex])}
                  alt={`Story ${currentIndex + 1}`}
                  fill
                  className="object-cover select-none"
                  draggable={false}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* أزرار التنقل */}
          <div className="absolute inset-0 flex justify-between items-center text-white px-2 z-30">
            <div
              onClick={handlePrev}
              className="w-1/3 h-full flex items-center justify-start cursor-pointer"
            >
              <FaChevronLeft className="opacity-60 hover:opacity-100 transition" />
            </div>
            <div
              onClick={handleNext}
              className="w-1/3 h-full flex items-center justify-end cursor-pointer"
            >
              <FaChevronRight className="opacity-60 hover:opacity-100 transition" />
            </div>
          </div>

          {/* ظل جميل أسفل القصة */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
