'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';

export default function HighlightViewerModal({ highlight, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const stories = highlight?.stories || [];

  const intervalRef = useRef(null);

  const getPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';
    return Array.isArray(story.Photo) ? story.Photo[0] : story.Photo;
  }, []);

  // Auto Progress
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
          return prev + 1.2;
        });
      }, 70);
    }

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, isPaused, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // Swipe for mobile
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 60) handlePrev();
    if (diff < -60) handleNext();
  };

  if (!highlight) return null;
  const currentStory = stories[currentIndex];
  const currentPhoto = getPhoto(currentStory);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
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

        {/* الخلفية الديناميكية */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 -z-10 blur-3xl"
          style={{
            backgroundImage: `url(${currentPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Story Container */}
        <div
          className="relative w-full max-w-sm h-[80vh] flex flex-col items-center justify-center select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Bar */}
          <div className="absolute top-3 left-0 right-0 flex gap-1 px-4 z-30">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 bg-white/25 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  animate={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 flex items-center gap-3 z-30">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-md">
              <Image
                src={highlight.coverImage || '/placeholder.jpg'}
                alt="Highlight cover"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="text-white">
              <h3 className="text-sm font-semibold leading-none">{highlight.title}</h3>
              <p className="text-xs opacity-70 pt-1">
                {currentIndex + 1}/{stories.length}
              </p>
            </div>
          </div>

          {/* الصورة */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
                <Image
                  src={currentPhoto}
                  alt={`Story ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  draggable={false}
                />

                {/* النص إن وُجد */}
                {currentStory?.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                    className="absolute bottom-8 left-0 right-0 px-5 text-center z-20"
                  >
                    <p className="text-white text-lg font-medium drop-shadow-md leading-snug">
                      {currentStory.text}
                    </p>
                  </motion.div>
                )}

                {/* تدرج سفلي ناعم */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* مناطق التنقل الخفية */}
          <div className="absolute inset-0 flex justify-between items-center z-40">
            <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
            <div onClick={handleNext} className="w-1/3 h-full cursor-pointer ml-auto" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
