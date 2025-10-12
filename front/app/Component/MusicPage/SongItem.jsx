import Image from 'next/image'
import React from 'react'
import { formatTime } from '@/app/utils/formatTime'
import { FaPlay } from 'react-icons/fa'
const SongItem = ({ song, index, setTrack, current, songs }) => (
  <div
    onClick={() => setTrack(song, index, songs)}
    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer ${current?._id === song._id ? 'ring-2 ring-blue-400 bg-white/30' : ''}`}
  >
    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
      <Image src={song.cover} alt={song.title} fill className="object-cover" />
    </div>
    <div className="flex-1">
      <div className="font-medium">{song.title}</div>
      <div className="text-sm text-gray-500">{song.artist}</div>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-xs text-gray-500">{formatTime(song.duration)}</div>
      <button className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40"><FaPlay /></button>
    </div>
  </div>
)


export default SongItem