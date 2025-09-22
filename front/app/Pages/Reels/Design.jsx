import React from 'react'
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';
const DesignReels = ({
    containerRef , reels , currentIndex , reelRefs , isLoading , lastReelRef , isMuted , setIsMuted
}) => {
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
  )
}

export default DesignReels