'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useReels } from '../../Context/ReelsContext';
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';

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
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-hidden snap-y snap-mandatory bg-lightMode-bg dark:bg-darkMode-bg"
    >
      {reels.filter(Boolean).map((reel, index) => {
        const isLast = index === reels.filter(Boolean).length - 1;
        return (
          <div
            key={reel._id}
            ref={(el) => {
              reelRefs.current[index] = el;
              if (isLast && lastReelRef) lastReelRef(el);
            }}
            className="snap-start w-full h-screen"
          >
            <ReelCard
              reel={reel}
              isActive={index === currentIndex}
              isMuted={isMuted}
              toggleMute={() => setIsMuted(prev => !prev)}
            />
          </div>
        );
      })}

      {isLoading &&
        Array.from({ length: 2 }).map((_, i) => <ReelSkeleton key={i} />)}

      {reels.length === 0 && !isLoading && (
        <p className="text-lightMode-fg dark:text-darkMode-fg text-center py-10">
          No reels available
        </p>
      )}
    </div>
  );
};

export default ReelsPage;
