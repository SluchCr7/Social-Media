'use client';

import React, { memo } from 'react';
import PlayerHeader from './PlayerHeader';
import PlayerControls from './PlayerControls';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMusicalNote, HiSparkles } from 'react-icons/hi2';

const NowPlaying = memo(({
  current, playing, togglePlay, next, prev,
  shuffle, setShuffle, repeatMode, setRepeatMode, shareMusicAsPost,
  progress, setProgress, duration, volume, setVolume, muted, setMuted,
  expanded, setExpanded, likeMusic, saveMusicInPlayList,
  userData, myPlaylist, setTrack, songs, currentIndex, isReady
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative min-h-[400px] w-full rounded-[3.5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
  >
    {/* 🌌 Cinematic Background layers */}
    <div className="absolute inset-0 bg-[#0A0A0A]" />
    {current?.cover && (
      <motion.div
        key={current?._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <Image
          src={current.cover}
          alt="bg"
          fill
          className="object-cover blur-[100px] scale-125"
        />
      </motion.div>
    )}

    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

    {/* ✨ Interactive Glass Card */}
    <div className="relative z-10 p-10 h-full flex flex-col justify-end">
      <div className="flex flex-col lg:flex-row items-end lg:items-center gap-10">

        {/* Massive Artwork Display */}
        <div className="relative shrink-0 perspective-1000 group/artwork">
          <motion.div
            animate={playing ? {
              rotateY: [0, 5, -5, 0],
              y: [0, -5, 0]
            } : {}}
            transition={{ duration: 10, repeat: Infinity }}
            className="relative w-72 h-72 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10"
          >
            {current?.cover ? (
              <Image src={current.cover} alt={current.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                <HiMusicalNote size={80} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
          </motion.div>

          {/* Visualizer Overlay (simplified) */}
          {playing && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 h-8 items-end">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '100%', '40%', '80%'] }}
                  transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity, repeatType: 'mirror' }}
                  className="w-1.5 bg-white/60 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Infusion */}
        <div className="flex-1 w-full space-y-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em]"
            >
              <HiSparkles className="animate-pulse" />
              Trending Frequency
            </motion.div>

            <PlayerHeader
              current={current}
              likeMusic={likeMusic}
              saveMusicInPlayList={saveMusicInPlayList}
              userData={userData}
              myPlaylist={myPlaylist}
              setExpanded={setExpanded}
              shareMusicAsPost={shareMusicAsPost}
            />
          </div>

          <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
            <PlayerControls
              togglePlay={togglePlay}
              playing={playing}
              prev={prev}
              next={next}
              shuffle={shuffle}
              setShuffle={setShuffle}
              repeatMode={repeatMode}
              setRepeatMode={setRepeatMode}
              progress={progress}
              setProgress={setProgress}
              duration={duration}
              volume={volume}
              setVolume={setVolume}
              muted={muted}
              setMuted={setMuted}
              isReady={isReady}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Decorative Edge Glow */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
  </motion.div>
));

NowPlaying.displayName = 'NowPlaying';
export default NowPlaying;