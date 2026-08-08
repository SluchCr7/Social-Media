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
  userData, myPlaylist, setTrack, songs, isReady
}) => (
  <div className="w-full bg-zinc-900/80 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
      <div className="relative h-48 w-full max-w-[220px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 sm:h-56 sm:max-w-[260px]">
        {current?.cover ? (
          <Image src={current.cover} alt={current.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <HiMusicalNote size={48} className="text-zinc-600" />
          </div>
        )}
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

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
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