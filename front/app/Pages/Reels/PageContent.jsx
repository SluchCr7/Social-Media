'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReels } from '@/app/redux/hooks';
import DesignReels from './Design';

const ReelsPage = () => {
  const { reels, isLoading, error, lastReelRef, fetchReels, page } = useReels();

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const goToReel = useCallback((index) => {
    if (index < 0 || index >= reels.length || scrolling) return;
    setScrolling(true);
    setCurrentIndex(index);
    reelRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => setScrolling(false), 500);
  }, [reels.length, scrolling]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target instanceof HTMLElement && (
        e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      )) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToReel(currentIndex + 1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToReel(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, goToReel]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !reels.length) return undefined;
    const intersectionObserver = new IntersectionObserver((entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (!activeEntry) return;
      const index = reelRefs.current.indexOf(activeEntry.target);
      if (index >= 0) setCurrentIndex(index);
    }, { root, threshold: [0.6, 0.8] });

    reelRefs.current.forEach((element) => {
      if (element) intersectionObserver.observe(element);
    });
    return () => intersectionObserver.disconnect();
  }, [reels]);

  return (
    <DesignReels
      containerRef={containerRef}
      reels={reels}
      currentIndex={currentIndex}
      reelRefs={reelRefs}
      isLoading={isLoading}
      error={error}
      retry={() => (error ? fetchReels(page) : null)}
      lastReelRef={lastReelRef}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
    />
  );
};

export default ReelsPage;
