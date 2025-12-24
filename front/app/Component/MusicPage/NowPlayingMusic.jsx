'use client';

import React, { memo } from 'react';
import PlayerHeader from './PlayerHeader';
import PlayerControls from './PlayerControls';
import Image from 'next/image';
import { motion } from 'framer-motion';

const NowPlaying = memo(({
  current, playing, togglePlay, next, prev,
  shuffle, setShuffle, repeatMode, setRepeatMode, shareMusicAsPost,
  progress, setProgress, duration, volume, setVolume, muted, setMuted,
  expanded, setExpanded, likeMusic, saveMusicInPlayList,
  userData, myPlaylist, accentStyle, setTrack, songs, currentIndex, isReady
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-[2.5rem] p-8 relative shadow-2xl border border-white/5 bg-white/5 dark:bg-gray-900/40 backdrop-blur-3xl overflow-hidden"
  >
    {/* Background Glow */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ background: accentStyle?.backgroundColor || '#4f46e5' }} />

    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
      <div className="relative group">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-56 h-56 md:w-52 md:h-52 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-gray-200 dark:bg-gray-800 border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
          {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col">
        <PlayerHeader
          current={current}
          likeMusic={likeMusic}
          saveMusicInPlayList={saveMusicInPlayList}
          userData={userData}
          myPlaylist={myPlaylist}
          setExpanded={setExpanded}
          shareMusicAsPost={shareMusicAsPost}
        />
        <div className="mt-4">
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
  </motion.div>
));

NowPlaying.displayName = 'NowPlaying';
export default NowPlaying;