'use client';

import React, { memo } from 'react';
import {
  Play, Pause, SkipForward, SkipBack,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const PlayerControls = memo(({
  togglePlay, playing, prev, next, shuffle, setShuffle,
  repeatMode, setRepeatMode, progress, setProgress,
  duration, volume, setVolume, muted, setMuted,
  isReady
}) => {

  const isBuffering = playing && !isReady;

  const cycleRepeat = () => {
    setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off');
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div dir="ltr">
        <ProgressBar progress={progress} duration={duration} seek={setProgress} />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-3">

        {/* Shuffle */}
        <button
          onClick={() => setShuffle(!shuffle)}
          aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          aria-pressed={shuffle}
          title="Shuffle"
          className={`p-2 rounded-lg transition-all ${
            shuffle
              ? 'text-indigo-400 bg-indigo-500/15'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Shuffle size={17} strokeWidth={2} />
        </button>

        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous track"
          className="p-2 text-zinc-400 hover:text-white transition-all hover:-translate-x-0.5"
        >
          <SkipBack size={22} strokeWidth={2} />
        </button>

        {/* Play / Pause */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={!isBuffering ? togglePlay : undefined}
          disabled={isBuffering}
          aria-label={playing ? 'Pause' : 'Play'}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isBuffering
              ? 'bg-white/5 cursor-not-allowed'
              : 'bg-white text-zinc-900 shadow-[0_8px_24px_-4px_rgba(255,255,255,0.2)] hover:bg-indigo-100'
          }`}
        >
          <AnimatePresence mode="wait">
            {isBuffering ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key={playing ? 'pause' : 'play'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {playing
                  ? <Pause size={24} strokeWidth={2.5} />
                  : <Play size={24} className="ml-0.5" strokeWidth={2.5} />
                }
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next track"
          className="p-2 text-zinc-400 hover:text-white transition-all hover:translate-x-0.5"
        >
          <SkipForward size={22} strokeWidth={2} />
        </button>

        {/* Repeat */}
        <button
          onClick={cycleRepeat}
          aria-label={`Repeat mode: ${repeatMode}`}
          aria-pressed={repeatMode !== 'off'}
          title={`Repeat: ${repeatMode}`}
          className={`p-2 rounded-lg transition-all ${
            repeatMode !== 'off'
              ? 'text-indigo-400 bg-indigo-500/15'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          {repeatMode === 'one'
            ? <Repeat1 size={17} strokeWidth={2} />
            : <Repeat size={17} strokeWidth={2} />
          }
        </button>

        {/* Volume — desktop only */}
        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/[0.07]">
          <button
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            aria-pressed={muted}
            className="p-1.5 text-zinc-500 hover:text-white transition-all"
          >
            {muted ? <VolumeX size={18} strokeWidth={2} /> : <Volume2 size={18} strokeWidth={2} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-400 transition-all"
            disabled={muted}
          />
        </div>
      </div>
    </div>
  );
});

PlayerControls.displayName = 'PlayerControls';
export default PlayerControls;
