import React from 'react';

const StoriesSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-3 shrink-0 animate-pulse snap-start">
      {/* Premium Skeleton Card */}
      <div className="relative w-20 h-20 rounded-[2rem] p-[3px] bg-white/5 border border-white/5 shadow-lg">
        <div className="w-full h-full rounded-[1.8rem] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10" />
      </div>

      {/* Label Placeholder */}
      <div className="w-14 h-2 rounded-full bg-gray-200 dark:bg-white/5" />
    </div>
  );
};

export default StoriesSkeleton;
