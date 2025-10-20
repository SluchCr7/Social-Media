'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CiBookmark } from 'react-icons/ci'
import { FaExpand, FaHeart, FaShareAlt } from 'react-icons/fa'

const PlayerHeader = ({ current, likeMusic, saveMusicInPlayList, userData, myPlaylist, setExpanded }) => {
  const {t} = useTranslation()
  return (
    <div className="flex items-center gap-4 justify-between flex-wrap mt-4 md:mt-0">
      <div>
        <div className="text-sm text-gray-500">{t("Now Playing")}</div>
        <h2 className="text-2xl font-semibold">{current?.title || 'Select a song'}</h2>
        <div className="text-sm text-gray-500 mt-1">{current?.artist} • {current?.album}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => current?._id && likeMusic(current._id)}
          className={`p-3 rounded-lg transition ${current?.likes?.includes(userData?._id) ? 'bg-red-500 text-white' : 'bg-white/30 dark:bg-gray-800/40 hover:bg-red-500/70 hover:text-white'}`}
        >
          <FaHeart />
        </button>
        <button
          onClick={() => current?._id && saveMusicInPlayList(current._id)}
          className={`p-3 rounded-lg transition ${myPlaylist?.some(s => s._id === current._id) ? 'bg-yellow-500 text-white' : 'bg-white/30 dark:bg-gray-800/40 hover:bg-yellow-400/60 hover:text-white'}`}
        >
          <CiBookmark />
        </button>
        <button className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40 hover:bg-blue-500/70 hover:text-white transition"><FaShareAlt /></button>
        <button onClick={() => setExpanded(true)} className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40 hover:bg-indigo-500/70 hover:text-white transition"><FaExpand /></button>
      </div>
    </div>
  )
}

export default PlayerHeader