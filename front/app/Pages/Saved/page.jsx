'use client'

import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaBookmark, FaMusic, FaRegImage, FaPlay, FaPause, FaTimes, FaShareAlt, FaHeart } from 'react-icons/fa'

/*
  SavedPage.Dark.jsx
  - صفحة Saved احترافية (Dark) متوافقة مع نظام الألوان الحالي للموقع
  - متطلبات: TailwindCSS, Framer Motion, react-icons
  - تحتوي على بيانات static arrays لتجربة الصفحة
  - استخدم الفئات اللونية الموجودة في المشروع: (مثلاً) bg-lightMode-bg dark:bg-darkMode-bg و text-lightMode-fg dark:text-darkMode-fg
*/

const savedPosts = [
  {
    id: 'p1',
    user: 'Ahmed',
    avatar: '/Home.jpg',
    image: '/Home.jpg',
    caption: 'Sunset vibes at the coast 🌅 — a short story about the day.',
    date: 'Oct 12, 2025',
  },
  {
    id: 'p2',
    user: 'Lina',
    avatar: '/Home.jpg',
    image: '/Home.jpg',
    caption: "My workspace — minimal and cozy.",
    date: 'Sep 20, 2025'
  },
  {
    id: 'p3',
    user: 'Mona',
    avatar: '/Home.jpg',
    image: '/Home.jpg',
    caption: 'Street photography — light & shadow.',
    date: 'Aug 14, 2025'
  }
]

const savedMusic = [
  {
    id: 'm1',
    title: 'Lost in Time',
    artist: 'Nova',
    cover: '/Home.jpg',
    url: '/song1.mp3',
    duration: '3:42'
  },
  {
    id: 'm2',
    title: 'Dreamstate',
    artist: 'Orion',
    cover: '/Home.jpg',
    url: '/song2.mp3',
    duration: '4:05'
  },
  {
    id: 'm3',
    title: 'Midnight Loop',
    artist: 'Echoes',
    cover: '/Home.jpg',
    url: '/song3.mp3',
    duration: '2:58'
  }
]

const savedReels = [
  {
    id: 'r1',
    thumbnail: '/reels/thumb1.jpg',
    video: '/video1.mp4',
    title: 'Quick Tips for Productivity'
  },
  {
    id: 'r2',
    thumbnail: '/reels/thumb2.jpg',
    video: '/video2.mp4',
    title: 'Street Photography - 60s'
  },
  {
    id: 'r3',
    thumbnail: '/reels/thumb3.jpg',
    video: '/video3.mp4',
    title: 'Mini-Recipe: 1 minute pasta'
  }
]

export default function SavedPage() {
  const tabs = ['posts', 'music', 'reels']
  const [active, setActive] = useState('posts')
  const [query, setQuery] = useState('')

  // audio player state
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)

  // reel modal
  const [openReel, setOpenReel] = useState(null)

  const filteredPosts = useMemo(() => savedPosts.filter(p => (p.caption + p.user).toLowerCase().includes(query.toLowerCase())), [query])
  const filteredMusic = useMemo(() => savedMusic.filter(m => (m.title + m.artist).toLowerCase().includes(query.toLowerCase())), [query])
  const filteredReels = useMemo(() => savedReels.filter(r => (r.title).toLowerCase().includes(query.toLowerCase())), [query])

  // play/pause logic for saved music (single audio element)
  const handlePlay = async (track) => {
    if (!audioRef.current) return

    // if clicking the same track toggle pause/play
    if (playingId === track.id) {
      if (!audioRef.current.paused) {
        audioRef.current.pause()
        setPlayingId(null)
      } else {
        try {
          await audioRef.current.play()
          setPlayingId(track.id)
        } catch (e) {
          console.warn('playback blocked')
        }
      }
      return
    }

    // new track
    audioRef.current.src = track.url
    audioRef.current.load()
    try {
      await audioRef.current.play()
      setPlayingId(track.id)
    } catch (err) {
      console.warn('playback blocked')
    }
  }

  const handlePause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlayingId(null)
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow"> 
                <FaBookmark />
              </span>
              {"Saved"}
            </h1>
            <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-1">All your saved posts, music and reels in one place.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your saved items..." className="pl-4 pr-4 py-2 rounded-lg bg-white/5 border border-white/6 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>
            <div className="hidden md:flex items-center bg-white/5 border border-white/6 rounded-xl px-3 py-2 gap-2">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActive(tab)} className={`px-3 py-1 rounded-lg font-medium ${active === tab ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-black' : 'text-lightMode-text dark:text-darkMode-text2'}`}>
                  {tab === 'posts' && <span className="inline-flex items-center gap-2"> <FaRegImage /> Posts</span>}
                  {tab === 'music' && <span className="inline-flex items-center gap-2"> <FaMusic /> Music</span>}
                  {tab === 'reels' && <span className="inline-flex items-center gap-2"> <FaPlay /> Reels</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* tabs for mobile */}
        <div className="flex md:hidden gap-3 mb-6">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${active === tab ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-black' : 'bg-white/5 text-lightMode-text dark:text-darkMode-text2'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* content */}
        <div>
          {active === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length === 0 ? (
                <EmptyState />
              ) : (
                filteredPosts.map(p => (
                  <motion.article key={p.id} whileHover={{ translateY: -6 }} className="rounded-2xl overflow-hidden bg-white/3 border border-white/6 backdrop-blur-md shadow-lg">
                    <div className="relative">
                      <img src={p.image} alt={p.caption} className="w-full h-52 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition flex items-end p-4">
                        <div className="flex-1 text-white">
                          <div className="font-semibold">{p.user}</div>
                          <div className="text-xs mt-1">{p.date}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg bg-white/10"><FaHeart /></button>
                          <button className="p-2 rounded-lg bg-white/10"><FaShareAlt /></button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{p.caption}</p>
                    </div>
                  </motion.article>
                ))
              )}
            </motion.div>
          )}

          {active === 'music' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/3 border border-white/6 rounded-2xl p-4 backdrop-blur-md shadow-lg">
              {filteredMusic.length === 0 ? <EmptyState /> : (
                <div className="space-y-3">
                  {filteredMusic.map(track => (
                    <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <img src={track.cover} alt={track.title} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2">{track.artist}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mr-2">{track.duration}</div>
                        {playingId === track.id ? (
                          <button onClick={handlePause} className="px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-black"><FaPause /></button>
                        ) : (
                          <button onClick={() => handlePlay(track)} className="px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-black"><FaPlay /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* hidden audio element */}
              <audio ref={audioRef} preload="metadata" />
            </motion.div>
          )}

          {active === 'reels' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredReels.length === 0 ? <EmptyState /> : (
                filteredReels.map(r => (
                  <motion.div key={r.id} whileHover={{ scale: 1.02 }} className="relative rounded-2xl overflow-hidden bg-white/3 border border-white/6">
                    <img src={r.thumbnail} alt={r.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button onClick={() => setOpenReel(r)} className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-black flex items-center justify-center shadow-lg"><FaPlay /></button>
                    </div>
                    <div className="p-3">
                      <div className="font-medium">{r.title}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Reel Modal */}
        {openReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div onClick={() => setOpenReel(null)} className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-3xl bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl p-4">
              <button onClick={() => setOpenReel(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/6"><FaTimes /></button>
              <video src={openReel.video} controls className="w-full rounded-lg" />
              <div className="mt-3">
                <div className="font-semibold">{openReel.title}</div>
                <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-1">Saved reel — {openReel.id}</div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full p-12 rounded-2xl bg-white/3 border border-white/6 text-center">
      <div className="text-4xl mb-4">📁</div>
      <div className="font-semibold mb-2">No saved items yet</div>
      <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mb-4">Save posts, tracks and reels to find them quickly later.</div>
      <button className="px-4 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-black">Explore Content</button>
    </div>
  )
}
