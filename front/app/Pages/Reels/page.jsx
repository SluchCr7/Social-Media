'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useReels } from '../../Context/ReelsContext';
import DesignReels from './Design';

const ReelsPage = () => {
  const { reels, isLoading, lastReelRef } = useReels();

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // الصوت يعمل افتراضياً

  const goToReel = (index) => {
    if (index < 0 || index >= reels.length || scrolling) return;
    setScrolling(true);
    setCurrentIndex(index);
    reelRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => setScrolling(false), 500);
  };

  // 🔽 التحكم بالأسهم (للكمبيوتر)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goToReel(currentIndex + 1);
      if (e.key === 'ArrowUp') goToReel(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, reels.length, scrolling , goToReel]);

  // 🖱️ التحكم بعجلة الماوس
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrolling) return;
      if (e.deltaY > 0) goToReel(currentIndex + 1);
      if (e.deltaY < 0) goToReel(currentIndex - 1);
    };
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, scrolling, reels.length , goToReel]);

  // 📱 التحكم بالسحب (Swipe) على الموبايل
  useEffect(() => {
    let startY = 0;
    let endY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      endY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const diff = startY - endY;
      if (Math.abs(diff) < 50 || scrolling) return; // تجاهل السحب الخفيف

      if (diff > 0) {
        // سحب لأعلى → الريل التالي
        goToReel(currentIndex + 1);
      } else {
        // سحب لأسفل → الريل السابق
        goToReel(currentIndex - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentIndex, scrolling, reels.length,goToReel]);

  return (
    <DesignReels
      containerRef={containerRef}
      reels={reels}
      currentIndex={currentIndex}
      reelRefs={reelRefs}
      isLoading={isLoading}
      lastReelRef={lastReelRef}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
    />
  );
};

export default ReelsPage;
