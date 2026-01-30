'use client';

import React, { memo } from 'react';
import { HiPlay, HiPause, HiForward, HiBackward, HiArrowsRightLeft, HiArrowPath, HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { formatTime } from '@/app/utils/formatTime';

const PlayerControls = memo(({
  togglePlay, playing, prev, next, shuffle, setShuffle,
  repeatMode, setRepeatMode, progress, setProgress,
  duration, volume, setVolume, muted, setMuted,
  isReady
}) => {

  const isBuffering = playing && !isReady;

  return (
    <div className="space-y-6">
      {/* 🛠️ Primary Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Playback Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`p-3 rounded-xl transition-all ${shuffle ? 'text-indigo-500 bg-indigo-500/10' : 'text-white/20 hover:text-white'}`}
            title="Shuffle"
          >
            <HiArrowsRightLeft size={20} />
          </button>

          <button
            onClick={prev}
            className="p-3 text-white/40 hover:text-white transition-all transform hover:-translate-x-1"
            title="Previous Track"
          >
            <HiBackward size={28} />
          </button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={!isBuffering ? togglePlay : undefined}
            disabled={isBuffering}
            className={`relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${isBuffering
              ? 'bg-white/5 cursor-not-allowed'
              : 'bg-white text-black shadow-[0_15px_30px_-5px_rgba(255,255,255,0.2)]'
              }`}
          >
            <AnimatePresence mode="wait">
              {isBuffering ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                />
              ) : (
                <motion.div
                  key={playing ? 'pause' : 'play'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {playing ? <HiPause size={32} /> : <HiPlay size={32} className="ml-1" />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={next}
            className="p-3 text-white/40 hover:text-white transition-all transform hover:translate-x-1"
            title="Next Track"
          >
            <HiForward size={28} />
          </button>

          <button
            onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
            className={`p-3 rounded-xl transition-all ${repeatMode !== 'off' ? 'text-indigo-500 bg-indigo-500/10' : 'text-white/20 hover:text-white'}`}
            title={`Repeat: ${repeatMode}`}
          >
            <HiArrowPath size={20} className={repeatMode === 'one' ? 'animate-spin-slow' : ''} />
          </button>
        </div>

        {/* 🔊 Pro Volume Module */}
        <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-white/5 flex-1 max-w-[200px]">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 text-white/40 hover:text-white transition-all"
          >
            {muted ? <HiSpeakerXMark size={20} /> : <HiSpeakerWave size={20} />}
          </button>
          <div className="relative flex-1 group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-indigo-500 transition-all"
              disabled={muted}
            />
          </div>
        </div>
      </div>

      {/* 🎢 Precision Progress Bar */}
      <div className="space-y-4">
        <ProgressBar
          progress={progress}
          duration={duration}
          seek={setProgress}
        />
      </div>
    </div>
  )
})

PlayerControls.displayName = 'PlayerControls';
export default PlayerControls;