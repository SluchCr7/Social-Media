'use client'

import React, { memo, useCallback } from 'react'
import Image from 'next/image'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'

const PostMusicPlayer = memo(({ music }) => {
  const { current, playing, togglePlay, setTrack } = useMusicPlayer()

  const isCurrent = current?._id === music?._id

  const handleToggle = useCallback(() => {
    if (isCurrent) {
      togglePlay()
    } else {
      setTrack(music)
      // استخدم promise أو event جاهزية الصوت إن وجد
      setTimeout(() => togglePlay(), 300)
    }
  }, [isCurrent, music, setTrack, togglePlay])

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-transparent dark:border-white/5">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={music?.cover || '/default-music.jpg'}
          alt={music?.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1">
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
          {music?.title}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
          {music?.artist}
        </span>
      </div>

      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center transition hover:scale-110"
      >
        {isCurrent && playing ? (
          <FaPause className="text-white dark:text-black text-sm" />
        ) : (
          <FaPlay className="text-white dark:text-black text-sm ml-0.5" />
        )}
      </button>
    </div>
  )
})
PostMusicPlayer.displayName = 'PostMusicPlayer'
export default PostMusicPlayer
