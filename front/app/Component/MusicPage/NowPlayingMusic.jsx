'use client';

import React, { memo } from 'react';
import PlayerHeader from './PlayerHeader';
import PlayerControls from './PlayerControls';
import Image from 'next/image';
import { Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

const NowPlaying = memo(({
  current, playing, togglePlay, next, prev,
  shuffle, setShuffle, repeatMode, setRepeatMode, shareMusicAsPost,
  progress, setProgress, duration, volume, setVolume, muted, setMuted,
  expanded, setExpanded, likeMusic, saveMusicInPlayList,
  userData, myPlaylist, setTrack, isReady
}) => (
  <div className="w-full bg-gradient-to-br from-[#13131f] via-[#0f0f19] to-[#0a0a12] p-5 sm:p-7">
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

      {/* Cover Art */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="group relative mx-auto sm:mx-0 aspect-square w-full max-w-[200px] sm:max-w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        {current?.cover ? (
          <Image
            key={current._id}
            src={current.cover}
            alt={`${current.title} cover`}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/10">
            <Music2 size={48} className="text-indigo-300/50" />
          </div>
        )}
        {/* Subtle overlay */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </motion.div>

      {/* Info + Controls */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-5">
        <PlayerHeader
          current={current}
          likeMusic={likeMusic}
          saveMusicInPlayList={saveMusicInPlayList}
          userData={userData}
          myPlaylist={myPlaylist}
          setExpanded={setExpanded}
          shareMusicAsPost={shareMusicAsPost}
        />

        <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-4 sm:p-5">
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
));

NowPlaying.displayName = 'NowPlaying';
export default NowPlaying;
