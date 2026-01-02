'use client'
import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBookmark, FaSearch, FaPlay, FaPause, FaTimes } from 'react-icons/fa'
import { useProfilePosts } from '@/app/Custome/useProfilePosts'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { useAuth } from '@/app/Context/AuthContext'
import { useGetData } from '@/app/Custome/useGetData'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import Image from 'next/image'
import { usePost } from '@/app/Context/PostContext'
import SavedPageSkeleton from '@/app/Skeletons/SavedSkeleton'
import { useTranslation } from 'react-i18next'
import { Disc3, Layers, Film, Grid } from 'lucide-react'

// ✅ Empty State - Futuristic
const EmptyState = React.memo(function EmptyState({ type }) {
  const { t } = useTranslation()
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-20 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10">
        <FaBookmark className="text-4xl text-white/20" />
      </div>
      <div className="font-black text-2xl mb-2 text-white tracking-tight">{t("Vault Empty")}</div>
      <div className="text-sm text-white/40 mb-8 max-w-sm font-medium tracking-wide">
        {t("Your personal collection is waiting. Save content to build your archive.")}
      </div>
      <button className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        {t("Start Collecting")}
      </button>
    </div>
  )
})

export default function SavedPage() {
  const { t } = useTranslation()
  const tabs = useMemo(() => ['posts', 'music', 'reels'], [])
  const [active, setActive] = useState('posts')
  const [query, setQuery] = useState('')
  const [openReel, setOpenReel] = useState(null)

  const { posts, isLoading: postsLoading } = usePost()
  const { current, playing, play, pause, setTrack, setSongs, setExpanded } = useMusicPlayer()
  const { user } = useAuth()
  const { userData, loading: userLoading } = useGetData(user?._id)
  const isLoading = postsLoading || userLoading

  const filteredPosts = useMemo(() => {
    if (!posts?.length) return []
    const q = query.toLowerCase()
    return posts.filter(p => (p.text + p.username).toLowerCase().includes(q))
  }, [query, posts])

  const filteredMusic = useMemo(() => {
    const playlist = userData?.myMusicPlaylist || []
    const q = query.toLowerCase()
    return playlist
      .map(m => ({
        ...m,
        _id: m._id || m.id,
        id: m._id || m.id,
      }))
      .filter(m => (m.title + m.artist).toLowerCase().includes(q))
  }, [query, userData?.myMusicPlaylist])

  const filteredReels = useMemo(() => {
    const reels = userData?.savedReels || []
    const q = query.toLowerCase()
    return reels.filter(r => r.caption.toLowerCase().includes(q))
  }, [query, userData?.savedReels])

  const handleMusicAction = useCallback(
    async (track) => {
      if (!track) return

      if (current && (current._id === track._id || current.id === track.id)) {
        if (playing) {
          pause()
          setExpanded(false)
        } else {
          play(true)
          setExpanded(true)
        }
        return
      }

      pause()
      const trackIndex = filteredMusic.findIndex(m => m?.id === track.id)
      setTrack(track, trackIndex, filteredMusic)
      setExpanded(true)
      setTimeout(() => play(true), 100)
    },
    [current, playing, pause, play, setExpanded, setTrack, filteredMusic]
  )

  useEffect(() => {
    if (active !== 'music' || !filteredMusic.length) return
    setSongs(filteredMusic)
    if (current && !filteredMusic.some(m => m.id === current.id)) {
      setTrack(filteredMusic[0], 0, filteredMusic)
    }
  }, [active, filteredMusic, setSongs, current, setTrack])

  if (isLoading) return <SavedPageSkeleton activeTab={active} />

  return (
    <div className="min-h-screen w-full relative bg-[#050505] text-white overflow-hidden">
      {/* Ambient Backlights */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Header Section */}
        <Header t={t} active={active} setActive={setActive} tabs={tabs} query={query} setQuery={setQuery} />

        {/* Content Container */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {active === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-transparent"
              >
                <div className="grid grid-cols-1 gap-8">
                  {filteredPosts?.filter(p => p?.saved?.includes(userData?._id))?.length === 0 ? (
                    <EmptyState />
                  ) : (
                    filteredPosts
                      ?.filter(p => p?.saved?.includes(userData?._id))
                      ?.map(post => <SluchitEntry key={post?._id} post={post} />)
                  )}
                </div>
              </motion.div>
            )}

            {active === 'music' && (
              <motion.div
                key="music"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MusicTab
                  filteredMusic={filteredMusic}
                  current={current}
                  playing={playing}
                  handleMusicAction={handleMusicAction}
                  setExpanded={setExpanded}
                />
              </motion.div>
            )}

            {active === 'reels' && (
              <motion.div
                key="reels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReelsTab filteredReels={filteredReels} setOpenReel={setOpenReel} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {openReel && <ReelModal openReel={openReel} setOpenReel={setOpenReel} t={t} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ✅ Premium Header
const Header = React.memo(({ t, active, setActive, tabs, query, setQuery }) => (
  <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-8 border-b border-white/5">
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-indigo-400">
        <Layers size={10} />
        Library
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
        Saved <span className="text-white/20">Collection</span>
      </h1>
      <p className="text-sm font-medium text-white/40 max-w-md">
        The archives of your digital journey. Access your favorite resonance, signals, and visuals instantly.
      </p>
    </div>

    <div className="flex flex-col w-full md:w-auto gap-4">
      {/* Search */}
      <div className="relative group w-full md:w-80">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 backdrop-blur-sm group-focus-within:bg-black/50 transition">
          <FaSearch className="text-white/30 mr-3 group-focus-within:text-white transition-colors" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t("Filter archives...")}
            className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-white/20 text-white"
          />
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl backdrop-blur-md">
        {tabs.map(tab => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`
                            flex-1 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 relative
                            ${isActive ? 'text-white' : 'text-white/40 hover:text-white'}
                        `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {tab === 'posts' && <Grid size={14} />}
                {tab === 'music' && <Disc3 size={14} />}
                {tab === 'reels' && <Film size={14} />}
                {t(tab)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  </div>
))
Header.displayName = 'Header'

// ✅ Music Tab - Premium List
const MusicTab = React.memo(({ filteredMusic, current, playing, handleMusicAction, setExpanded }) => {
  if (!filteredMusic?.length) return <EmptyState />
  return (
    <div className="space-y-2">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
        <span className="hidden md:block">#</span>
        <span>Track</span>
        <span className="hidden md:block text-right">Duration</span>
        <span className="text-right">Action</span>
      </div>

      {filteredMusic.map((track, index) => {
        const isPlayingThis = playing && current && current.id === track.id
        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
                group relative grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 
                rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
                ${isPlayingThis
                ? 'bg-neutral-900/80 border-indigo-500/50 shadow-[0_4px_20px_-10px_rgba(99,102,241,0.5)]'
                : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'}
            `}
            onClick={() => {
              handleMusicAction(track)
              setExpanded(true)
            }}
          >
            {/* Progress Bar Background for Active */}
            {isPlayingThis && (
              <motion.div
                layoutId="playingBg"
                className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 z-20"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: "linear" }}
              />
            )}

            <div className="hidden md:block w-8 text-center text-xs font-bold text-white/20">
              {isPlayingThis ? <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse mx-auto" /> : index + 1}
            </div>

            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                <Image src={track.cover} fill className="object-cover" alt="cover" />
                {isPlayingThis && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-1 h-3 bg-white mx-0.5 animate-[music-bar_0.5s_ease-in-out_infinite]" />
                    <div className="w-1 h-4 bg-white mx-0.5 animate-[music-bar_0.7s_ease-in-out_infinite]" />
                    <div className="w-1 h-2 bg-white mx-0.5 animate-[music-bar_0.4s_ease-in-out_infinite]" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className={`text-sm font-bold truncate ${isPlayingThis ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                  {track.title}
                </h3>
                <p className="text-xs text-white/40 truncate">{track.artist}</p>
              </div>
            </div>

            <div className="hidden md:block text-xs font-medium text-white/30 text-right">
              {track.duration || "3:45"}
            </div>

            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMusicAction(track)
                }}
                className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 hover:bg-white text-black
                        ${isPlayingThis ? 'bg-indigo-500 text-white' : 'text-white group-hover:bg-white group-hover:text-black'}
                    `}
              >
                {isPlayingThis ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
              </button>
            </div>

          </motion.div>
        )
      })}
    </div>
  )
})
MusicTab.displayName = 'MusicTab'

// ✅ Reels Tab - Cinematic Grid
const ReelsTab = React.memo(({ filteredReels, setOpenReel }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {!filteredReels?.length ? (
      <EmptyState />
    ) : (
      filteredReels.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/5 cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 shadow-2xl"
          onClick={() => setOpenReel(r)}
        >
          <Image
            src={r.thumbnailUrl}
            fill
            alt={r.caption}
            className="object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <FaPlay className="pl-1" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">Synced Reel</div>
            <p className="text-sm font-bold text-white line-clamp-2 leading-tight">{r.caption}</p>
          </div>
        </motion.div>
      ))
    )}
  </div>
))
ReelsTab.displayName = 'ReelsTab'

// ✅ Cinematic Modal
const ReelModal = React.memo(({ openReel, setOpenReel, t }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/90 backdrop-blur-3xl"
    onClick={() => setOpenReel(null)}
  >
    <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl h-full max-h-[90vh] grid grid-cols-1 md:grid-cols-[1fr_350px] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/10">

      {/* Video Section */}
      <div className="relative bg-black flex items-center justify-center">
        <video src={openReel.videoUrl} controls autoPlay className="max-w-full max-h-full object-contain" />
      </div>

      {/* Info Sidebar */}
      <div className="hidden md:flex flex-col p-8 border-l border-white/5 bg-[#0a0a0a]">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-white/30">Archives Data</span>
          <button onClick={() => setOpenReel(null)} className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition">
            <FaTimes />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 leading-snug">{openReel.caption}</h2>

        <div className="flex-1 overflow-y-auto">
          <p className="text-white/40 text-sm leading-relaxed">
            {t("This content was saved to your private collection. It remains accessible as long as the original creator keeps it public.")}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition">
            {t("View Original Post")}
          </button>
        </div>
      </div>

      {/* Close Button Mob */}
      <button onClick={() => setOpenReel(null)} className="md:hidden absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full">
        <FaTimes />
      </button>
    </div>
  </motion.div>
))
ReelModal.displayName = 'ReelModal'