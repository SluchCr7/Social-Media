'use client';

import React from 'react';
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useAuth } from '@/app/Context/AuthContext';
import { motion } from 'framer-motion';
import { HiSignal, HiOutlineFilm } from 'react-icons/hi2';

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
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide no-scrollbar scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* 🌀 Cinematic Background Gradient (Subtle Global Ambience) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black opacity-50 z-0" />

      {reels.filter(Boolean).map((reel, index) => {
        const isLast = index === reels.filter(Boolean).length - 1;
        return (
          <div
            key={reel._id}
            ref={(el) => {
              reelRefs.current[index] = el;
              if (isLast && lastReelRef) lastReelRef(el);
            }}
            className="snap-start w-full h-screen relative z-10"
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

      {isLoading && (
        <div className="snap-start w-full h-screen relative flex items-center justify-center bg-black z-10">
          <ReelSkeleton />
        </div>
      )}

      {reels.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="snap-start w-full h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden z-20"
        >
          {/* Abstract Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
          </div>

          <div className="relative z-10 p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 text-center max-w-md shadow-2xl">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/25">
              <HiOutlineFilm className="text-4xl text-white" />
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {t("Zone Silence")}
            </h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
              {t("The frequency is quiet. Be the first to broadcast a signal.")}
            </p>

            <div className="flex justify-center">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 h-8 bg-indigo-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DesignReels;