'use client';

import React from 'react';
import Link from 'next/link';
import ReelCard from '../../Component/ReelCard';
import ReelSkeleton from '../../Skeletons/ReelSkeleton';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useAuth } from '@/app/Context/AuthContext';
import { useReels } from '@/app/Context/ReelsContext';
import { motion } from 'framer-motion';
import { HiOutlineFilm, HiPlus, HiHome } from 'react-icons/hi2';

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
  const { setShowModelAddReel } = useReels();

  const visibleReels = reels.filter(Boolean);
  const hasReels = visibleReels.length > 0;

  const openCreateReel = () => setShowModelAddReel(true);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide no-scrollbar scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* 🌀 Cinematic Background Gradient (Subtle Global Ambience) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black opacity-50 z-0" />

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={openCreateReel}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:bg-indigo-500 hover:text-white"
      >
        <HiPlus size={18} />
        <span>{t('New Reel')}</span>
      </motion.button>

      {visibleReels.map((reel, index) => {
        const isLast = index === visibleReels.length - 1;
        return (
          <div
            key={reel._id}
            ref={(el) => {
              reelRefs.current[index] = el;
              if (isLast && lastReelRef) lastReelRef(el);
            }}
            className="snap-start w-full h-screen relative z-40"
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

      {!hasReels && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="snap-start relative z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 text-white"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute left-[-10%] top-[-10%] h-[45%] w-[45%] rounded-full bg-indigo-600/10 blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[45%] w-[45%] rounded-full bg-blue-600/10 blur-[140px]" />
          </div>

          <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/8 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/25">
                <HiOutlineFilm className="text-3xl text-white" />
              </div>
            </div>

            <h2 className="mb-3 text-2xl font-semibold text-white">
              {t('No reels yet')}
            </h2>
            <p className="mb-8 text-sm leading-6 text-zinc-400">
              {t('Start with a short video and share it with your audience in a clean, polished way.')}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={openCreateReel}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-indigo-500 hover:text-white"
              >
                <HiPlus size={16} />
                {t('Create reel')}
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
              >
                <HiHome size={16} />
                {t('Back home')}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DesignReels;