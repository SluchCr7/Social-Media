

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaRandom, FaRedo, FaHeart, FaShareAlt,
  FaVolumeUp, FaSearch, FaExpand
} from 'react-icons/fa'
import { CiHeart, CiBookmark } from 'react-icons/ci'
import Image from 'next/image'
import { useMusic } from '../../Context/MusicContext'
import { useMusicPlayer } from '../../Context/MusicPlayerContext'
import { useAuth } from '@/app/Context/AuthContext'
import AddMusicModal from '@/app/Component/MusicPage/AddMusicMenu'
import { formatTime } from '@/app/utils/formatTime'
import Link from 'next/link'

export default function MusicPage() {
  const { music: songs, isLoading, likeMusic } = useMusic()
  const { user, getUserById, saveMusicInPlayList } = useAuth()
  const {
    current, playing, togglePlay, next, prev,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, setCurrentIndex,
    expanded, setExpanded
  } = useMusicPlayer()

  const [userData, setUserData] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [openModel, setOpenModel] = useState(false)

  // جلب بيانات اليوزر عند وجود user._id
  useEffect(() => {
    if (!user?._id) return
    setLoading(true)
    getUserById(user._id)
      .then(res => setUserData(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?._id])

  // قائمة الأغاني المفلترة بالبحث
  const filtered = useMemo(() => {
    if (!search) return songs
    const q = search.toLowerCase()
    return songs.filter(
      s => s.title.toLowerCase().includes(q) ||
           s.artist.toLowerCase().includes(q) ||
           s.album.toLowerCase().includes(q)
    )
  }, [songs, search])

  // أسلوب التمييز للأغنية الحالية
  const accentStyle = useMemo(() => ({
    background: `linear-gradient(90deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))`,
  }), [current?.cover])

  // قائمة الانتظار
  const queue = useMemo(() => {
    if (!songs.length) return []
    return songs.slice(currentIndex + 1).concat(songs.slice(0, currentIndex))
  }, [songs, currentIndex])

  // الموسيقى المحفوظة في Playlist من userData
  const myPlaylist = useMemo(() => {
    if (!userData?.myMusicPlaylist?.length) return []
    return userData.myMusicPlaylist
  }, [userData])

  return (
    <div className="min-h-screen w-full relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold">Zocial</Link>
            <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/60 rounded-full px-3 py-1 border">
              <FaSearch className="text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className="bg-transparent outline-none w-64 text-sm text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setOpenModel(true)} className="px-3 py-1 rounded-md border">Upload</button>
            <div className="hidden md:block text-sm text-gray-500">{userData?.username}</div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Center Feed */}
        <main className="lg:col-span-7 space-y-6">
          {/* Featured Now Playing */}
          <div className="rounded-2xl p-6 relative" style={accentStyle}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-48 h-48 md:w-40 md:h-40 rounded-xl shadow-2xl overflow-hidden bg-gray-200">
                {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Now Playing</div>
                    <h2 className="text-2xl font-semibold">{current?.title || 'Select a song'}</h2>
                    <div className="text-sm text-gray-500 mt-1">{current?.artist} • {current?.album}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => current?._id && likeMusic(current._id)}
                      className={`p-3 rounded-lg ${current?.likes?.includes(userData?._id) ? 'bg-red-500 text-white' : 'bg-white/30 dark:bg-gray-800/40'}`}
                    >
                      <FaHeart />
                    </button>
                    <button 
                      onClick={() => current?._id && saveMusicInPlayList(current._id)}
                      className={`p-3 rounded-lg ${myPlaylist?.includes(current?._id) ? 'bg-yellow-500 text-white' : 'bg-white/30 dark:bg-gray-800/40'}`}
                    >
                      <CiBookmark />
                    </button>
                    <button className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40">
                      <FaShareAlt />
                    </button>
                    <button onClick={() => setExpanded(true)} className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40">
                      <FaExpand />
                    </button>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => setShuffle(!shuffle)}
                      className={`p-3 rounded-full ${shuffle ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`}
                      title="Shuffle"
                    ><FaRandom /></button>
                    <button onClick={prev} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"><FaStepBackward /></button>
                    <button onClick={togglePlay} className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl shadow-lg">
                      {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={next} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"><FaStepForward /></button>
                    <button
                      onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                      className={`p-3 rounded-full ${repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`}
                      title="Repeat"
                    ><FaRedo /></button>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs w-12 text-right">{formatTime(progress)}</div>
                      <div className="flex-1 cursor-pointer" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const pct = Math.max(0, Math.min(1, x / rect.width))
                        setTrack({ ...current, seek: pct * (duration || current?.duration || 0) })
                      }}>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full relative">
                          <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.45)]" />
                        </div>
                      </div>
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
              </div>
            </div>

            {/* Songs Feed */}
            <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
              <h3 className="text-lg font-semibold mb-3">All Songs</h3>
              {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : (
                <div className="space-y-2">
                  {filtered.map((s, i) => (
                    <div key={s._id} onClick={() => setTrack(s, i, songs)} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${current?._id === s._id ? 'ring-2 ring-blue-400 bg-white/30' : ''}`}>
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                        <Image src={s.cover} alt={s.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-gray-500">{s.artist}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
                        <button className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40"><FaPlay /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
          
          {/* Right Playlist */}
          <aside className="lg:col-span-3 space-y-6 sticky top-20">
            <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
              <div className="text-sm text-gray-500">Now Playing</div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                  {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
                </div>
                <div>
                  <div className="font-medium">{current?.title || '—'}</div>
                    <div className="text-xs text-gray-500">{current?.artist}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Plays: {current?.views?.length ?? 0} • Likes: {current?.likes?.length ?? 0}
                </div>
            </div>

            <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Up Next</h4>
                <div className="text-xs text-gray-500">{queue.length} songs</div>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {queue.map((q) => (
                    <div key={q._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
                        <Image src={q.cover} alt={q.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium truncate">{q.title}</div>
                        <div className="text-xs text-gray-500 truncate">{q.artist}</div>
                      </div>
                      <div className="text-xs text-gray-500">{formatTime(q.duration)}</div>
                    </div>
                  ))}
                </div>
            </div>

            <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
              <h4 className="font-semibold mb-3">My Playlist</h4>
              {myPlaylist?.length ? (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {myPlaylist.map((s, i) => (
                    <div key={s._id} onClick={() => setTrack(s, i, myPlaylist)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                      <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
                        <Image src={s.cover} alt={s.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium truncate">{s.title}</div>
                        <div className="text-xs text-gray-500 truncate">{s.artist}</div>
                      </div>
                      <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No saved songs yet.</div>
              )}
            </div>
          </aside>
      </div>
    </div>
  )
}
