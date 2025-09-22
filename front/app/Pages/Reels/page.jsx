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

  // Arrow key navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goToReel(currentIndex + 1);
      if (e.key === 'ArrowUp') goToReel(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, reels.length, scrolling]);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrolling) return;
      if (e.deltaY > 0) goToReel(currentIndex + 1);
      if (e.deltaY < 0) goToReel(currentIndex - 1);
    };
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, scrolling, reels.length]);

  return (
    <DesignReels
      containerRef={containerRef}  reels={reels}  currentIndex={currentIndex}  reelRefs={reelRefs}  isLoading={isLoading}  lastReelRef={lastReelRef}  isMuted={isMuted}  setIsMuted={setIsMuted}
    />
  );
};

export default ReelsPage;
