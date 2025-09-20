'use client';

import React from 'react';
import { useReels } from '../../Context/ReelsContext';
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';

const ReelsPage = () => {
  const { reels, isLoading, lastReelRef } = useReels();

  return (
    <div className="w-full h-screen overflow-y-auto bg-lightMode-bg dark:bg-darkMode-bg">
      {reels.filter(Boolean).map((reel, index) => {
        const isLast = index === reels.filter(Boolean).length - 1;
        return <ReelCard ref={isLast ? lastReelRef : null} key={reel._id} reel={reel} />;
      })}
      {isLoading && Array.from({ length: 2 }).map((_, i) => <ReelSkeleton key={i} />)}
      {reels.length === 0 && !isLoading && (
        <p className="text-lightMode-fg dark:text-darkMode-fg text-center py-10">No reels available</p>
      )}
    </div>
  );
};

export default ReelsPage;
