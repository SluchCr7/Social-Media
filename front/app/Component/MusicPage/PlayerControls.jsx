import React from 'react'
import { FaPause, FaPlay, FaRandom, FaRedo, FaVolumeUp } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import { formatTime } from '@/app/utils/formatTime'

const PlayerControls = ({
  togglePlay, playing, prev, next, shuffle, setShuffle,
  repeatMode, setRepeatMode, progress, setProgress,
  duration, volume, setVolume, muted, setMuted
}) => (
  <div className="mt-6">
    <div className="flex items-center gap-4 justify-center md:justify-start">
      <button
        onClick={() => setShuffle(!shuffle)}
        className={`p-3 rounded-full transition ${shuffle ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40 hover:bg-blue-500/40'}`}
        title="Shuffle"
      ><FaRandom /></button>
      <button onClick={prev} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-gray-700/40 transition"><FaStepBackward /></button>
      <button onClick={togglePlay} className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl shadow-lg hover:scale-105 transition">
        {playing ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={next} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-gray-700/40 transition"><FaStepForward /></button>
      <button
        onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
        className={`p-3 rounded-full transition ${repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40 hover:bg-blue-500/40'}`}
        title="Repeat"
      ><FaRedo /></button>
    </div>

    {/* Progress */}
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <div className="text-xs w-12 text-right">{formatTime(progress)}</div>
        <ProgressBar
          progress={progress}
          duration={duration}
          seek={(time) => setProgress(time)}
        />
        <div className="text-xs w-12">{formatTime(duration)}</div>
      </div>
      <div className="mt-2 flex items-center gap-3 justify-end">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaVolumeUp />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
          />
        </div>
      </div>
    </div>
  </div>
)

export default PlayerControls