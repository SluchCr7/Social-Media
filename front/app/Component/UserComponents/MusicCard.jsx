'use client';

import Image from 'next/image';
import React from 'react';
import { FaMusic, FaPause, FaPlay } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useMusicPlayer } from '@/app/redux/hooks';

const MusicCard = ({ music }) => {
  const { t } = useTranslation();
  const { current, playing, setTrack, togglePlay } = useMusicPlayer();
  const isCurrent = current?._id === music?._id;

  const handlePlay = () => {
    if (!music?._id || !music.url) return;
    if (isCurrent) togglePlay();
    else setTrack(music);
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={!music?.url}
      aria-label={`${isCurrent && playing ? t('Pause') : t('Play')} ${music?.title || t('Unknown Track')}`}
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 text-left transition hover:border-indigo-300/25 hover:bg-indigo-300/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
        {music?.cover ? (
          <Image
            src={music.cover}
            alt={`${music?.title || t('Music')} cover`}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-zinc-500">
            <FaMusic />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${isCurrent ? 'text-indigo-200' : 'text-white'}`}>
          {music?.title || t('Unknown Track')}
        </span>
        <span className="mt-1 block truncate text-xs text-zinc-500">
          {music?.artist || t('Unknown Artist')}
        </span>
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 transition group-hover:bg-indigo-300 group-hover:text-zinc-950">
        {isCurrent && playing ? <FaPause size={13} /> : <FaPlay size={13} />}
      </span>
    </button>
  );
};

export default React.memo(MusicCard);
