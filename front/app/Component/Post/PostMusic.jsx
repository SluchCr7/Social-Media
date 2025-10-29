'use client'

import React from 'react'
import Image from 'next/image'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'

const PostMusicPlayer = ({ music }) => {
  const { current, playing, togglePlay, setTrack } = useMusicPlayer()

  const isCurrent = current?._id === music?._id

  const handleToggle = () => {
    if (isCurrent) {
      togglePlay()
    } else {
      setTrack(music)
      setTimeout(() => togglePlay(), 100) // لتشغيلها بعد تعيينها مباشرة
    }
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-all">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={music?.cover || '/default-music.jpg'}
          alt={music?.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1">
        <span className="font-semibold text-lightMode-text2 dark:text-darkMode-text2 text-sm truncate">
          {music?.title}
        </span>
        <span className="text-gray-400 text-xs truncate">
          {music?.artist}
        </span>
      </div>

      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-lightMode-text dark:bg-darkMode-text flex items-center justify-center transition"
      >
        {isCurrent && playing ? (
          <FaPause className="text-white text-sm" />
        ) : (
          <FaPlay className="text-white text-sm ml-0.5" />
        )}
      </button>
    </div>
  )
}

export default PostMusicPlayer
