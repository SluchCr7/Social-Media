'use client';

import React from 'react';
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useAuth } from '@/app/Context/AuthContext';
import { motion } from 'framer-motion';
import { HiSignal } from 'react-icons/hi2';

const DesignReels = ({
  containerRef,
  reels,
  currentIndex,
  reelRefs,
  isLoading,
  lastReelRef,
  isMuted,
  setIsMuted
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userData } = useGetData(user?._id);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide"
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
            className="snap-start w-full h-screen relative"
          >
            <ReelCard
              key={reel._id}
              userData={userData}
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white space-y-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-indigo-500/20 border-t-indigo-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <HiSignal className="w-12 h-12 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-widest">{t("No Reels Available")}</h3>
            <p className="text-sm text-gray-400 font-medium max-w-sm">{t("The feed is currently empty. Check back soon for new content.")}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DesignReels;