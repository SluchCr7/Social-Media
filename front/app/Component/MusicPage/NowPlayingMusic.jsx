'use client';

import React, { memo } from 'react';
import PlayerHeader from './PlayerHeader';
import PlayerControls from './PlayerControls';
import Image from 'next/image';
import { HiMusicalNote } from 'react-icons/hi2';

const NowPlaying = memo(({
  current, playing, togglePlay, next, prev,
  shuffle, setShuffle, repeatMode, setRepeatMode, shareMusicAsPost,
  progress, setProgress, duration, volume, setVolume, muted, setMuted,
  expanded, setExpanded, likeMusic, saveMusicInPlayList,
  userData, myPlaylist, setTrack, isReady
}) => (
  <div className="w-full bg-gradient-to-br from-[#171721] via-[#111117] to-[#0d0d12] p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="group relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#181821] shadow-[0_24px_70px_rgba(0,0,0,0.4)] md:mx-0 md:max-w-[300px]">
        {current?.cover ? (
          <Image src={current.cover} alt={`${current.title} cover`} fill sizes="(max-width: 768px) 260px, 300px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400/20 to-fuchsia-400/10">
            <HiMusicalNote size={52} className="text-indigo-200/60" />
          </div>
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.03]" />
      </div>

      <div className="flex-1 space-y-4">
        <PlayerHeader
          current={current}
          likeMusic={likeMusic}
          saveMusicInPlayList={saveMusicInPlayList}
          userData={userData}
          myPlaylist={myPlaylist}
          setExpanded={setExpanded}
          shareMusicAsPost={shareMusicAsPost}
        />

        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:p-5">
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