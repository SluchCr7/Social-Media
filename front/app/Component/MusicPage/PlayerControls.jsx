import React, { memo } from 'react'
import { FaPause, FaPlay, FaRandom, FaRedo, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im'; // ✅ أيقونة التحميل
import ProgressBar from './ProgressBar';
import { formatTime } from '@/app/utils/formatTime'

const PlayerControls = memo(({
  togglePlay, playing, prev, next, shuffle, setShuffle,
  repeatMode, setRepeatMode, progress, setProgress,
  duration, volume, setVolume, muted, setMuted,
  // ✅ استقبال isReady
  isReady 
}) => {

  // 💡 تحديد ما إذا كان المشغل يحاول التشغيل ولكنه ليس جاهزاً بعد
  const isBuffering = playing && !isReady;
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 justify-center md:justify-start">
        
        {/* زر التبديل العشوائي (Shuffle) */}
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-3 rounded-full transition ${shuffle ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40 hover:bg-blue-500/40'}`}
          title="Shuffle"
        >
          <FaRandom />
        </button>
        
        {/* زر السابق (Previous) */}
        <button 
          onClick={prev} 
          className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-gray-700/40 transition"
          title="Previous Track"
        >
          <FaStepBackward />
        </button>
        
        {/* زر التشغيل/الإيقاف (Play/Pause/Buffering) */}
        <button 
          // منع النقر أثناء التحميل (isBuffering)
          onClick={!isBuffering ? togglePlay : undefined} 
          disabled={isBuffering} 
          className={`p-4 rounded-full text-white text-2xl shadow-lg transition ${
            isBuffering 
              ? 'bg-gray-500/80 cursor-not-allowed animate-pulse' // حالة التحميل
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:scale-105' // الحالة العادية
          }`}
          title={isBuffering ? 'Loading...' : playing ? 'Pause' : 'Play'}
        >
          {isBuffering ? ( // ✅ إظهار مؤشر التحميل
            <ImSpinner2 className="animate-spin" />
          ) : (
            playing ? <FaPause /> : <FaPlay />
          )}
        </button>
        
        {/* زر التالي (Next) */}
        <button 
          onClick={next} 
          className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-gray-700/40 transition"
          title="Next Track"
        >
          <FaStepForward />
        </button>
        
        {/* زر التكرار (Repeat) */}
        <button
          onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
          className={`p-3 rounded-full transition ${repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40 hover:bg-blue-500/40'}`}
          title={`Repeat: ${repeatMode}`}
        >
          <FaRedo />
        </button>
      </div>

      {/* شريط التقدم (Progress Bar) */}
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <div className="text-xs w-12 text-right">
            {formatTime(progress)}
          </div>
          <ProgressBar
            progress={progress}
            duration={duration}
            // افترض أن `seek` هي دالة موجودة في MusicPlayerContext 
            // وتم تمريرها كـ prop باسم `setProgress` لتغيير التقدم
            // (يفضل تغيير اسم الـ prop إلى seek في الكود الخارجي لمزيد من الوضوح)
            seek={(time) => setProgress(time)} 
          />
          <div className="text-xs w-12">
            {formatTime(duration)}
          </div>
        </div>
        
        {/* التحكم بالصوت (Volume Control) */}
        <div className="mt-2 flex items-center gap-3 justify-end">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button 
              onClick={() => setMuted(!muted)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={muted ? 'Unmute' : 'Mute'}
            >
              <FaVolumeUp className={muted ? 'text-red-500' : ''} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
              disabled={muted}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
PlayerControls.displayName = 'PlayerControls'
export default PlayerControls