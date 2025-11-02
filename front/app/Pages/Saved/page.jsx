'use client'
import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaBookmark, FaMusic, FaRegImage, FaPlay, FaPause, FaTimes } from 'react-icons/fa'
import { useProfilePosts } from '@/app/Custome/useProfilePosts'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { useAuth } from '@/app/Context/AuthContext'
import { useGetData } from '@/app/Custome/useGetData'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import Image from 'next/image'
import { usePost } from '@/app/Context/PostContext'
import SavedPageSkeleton from '@/app/Skeletons/SavedSkeleton'
import { useTranslation } from 'react-i18next'

// ✅ تحسين الأداء: مكون فارغ مع memo لمنع إعادة الرندر
const EmptyState = React.memo(function EmptyState() {
  const { t } = useTranslation()
  return (
    <div className="col-span-full p-16 rounded-3xl bg-white/3 border border-white/6 text-center shadow-inner">
      <div className="text-5xl mb-4">✨</div>
      <div className="font-bold text-xl mb-2">{t("No saved items yet")}</div>
      <div className="text-md text-lightMode-text2 dark:text-darkMode-text2 mb-6">
        {t("Save posts, tracks and reels to find them quickly later.")}
      </div>
      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-black font-semibold shadow-lg hover:shadow-xl transition">
        {t("Explore Content")}
      </button>
    </div>
  )
})
EmptyState.displayName = 'EmptyState'
export default function SavedPage() {
  const { t } = useTranslation()
  const tabs = useMemo(() => ['posts', 'music', 'reels'], [])
  const [active, setActive] = useState('posts')
  const [query, setQuery] = useState('')
  const [openReel, setOpenReel] = useState(null)

  // ✅ استدعاء السياقات مرة واحدة
  const { posts, isLoading: postsLoading } = usePost()
  const { current, playing, play, pause, setTrack, setSongs, expanded, setExpanded } = useMusicPlayer()
  const { combinedPosts } = useProfilePosts()
  const { user } = useAuth()
  const { userData, loading: userLoading } = useGetData(user?._id)
  const isLoading = postsLoading || userLoading

  // ✅ useMemo: فلاتر محسّنة
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

  // ✅ useCallback: دالة مستقرة لا تُعاد إنشاؤها إلا عند الحاجة
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

      // ✅ تقليل timeout لتقليل التأخير
      setTimeout(() => play(true), 100)
    },
    [current, playing, pause, play, setExpanded, setTrack, filteredMusic]
  )

  // ✅ تحسين مزامنة قائمة الأغاني مع المشغل
  useEffect(() => {
    if (active !== 'music' || !filteredMusic.length) return
    setSongs(filteredMusic)

    if (current && !filteredMusic.some(m => m.id === current.id)) {
      setTrack(filteredMusic[0], 0, filteredMusic)
    }
  }, [active, filteredMusic, setSongs, current, setTrack])

  // ✅ تحسين واجهة التحميل
  if (isLoading) return <SavedPageSkeleton activeTab={active} />

  return (
    <div className="min-h-screen w-full py-12 px-6 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* ✅ Header */}
        <Header t={t} active={active} setActive={setActive} tabs={tabs} query={query} setQuery={setQuery} />

        {/* ✅ Tabs (Responsive) */}
        <div className="flex md:hidden gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                active === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                  : 'bg-white/5 text-lightMode-text dark:text-darkMode-text2 border border-white/5'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {/* ✅ محتوى التبويبات */}
        <div>
          {active === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6">
              {filteredPosts?.filter(p => p?.saved?.includes(userData?._id))?.length === 0 ? (
                <EmptyState />
              ) : (
                filteredPosts
                  ?.filter(p => p?.saved?.includes(userData?._id))
                  ?.map(post => <SluchitEntry key={post?._id} post={post} />)
              )}
            </motion.div>
          )}

          {active === 'music' && (
            <MusicTab
              filteredMusic={filteredMusic}
              current={current}
              playing={playing}
              handleMusicAction={handleMusicAction}
              setExpanded={setExpanded}
            />
          )}

          {active === 'reels' && (
            <ReelsTab filteredReels={filteredReels} setOpenReel={setOpenReel} />
          )}
        </div>

        {/* ✅ Modal للفيديوهات */}
        {openReel && <ReelModal openReel={openReel} setOpenReel={setOpenReel} t={t} />}
      </div>
    </div>
  )
}

// ✅ Header مستقل + memo
const Header = React.memo(({ t, active, setActive, tabs, query, setQuery }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-4">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30">
          <FaBookmark />
        </span>
        {t("Saved Items")}
      </h1>
      <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-2">
        {t("All your saved posts, music and reels in one place.")}
      </p>
    </div>

    <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
      <div className="relative w-full md:w-64">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t("Search saved content...")}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-lightMode-fg/5 dark:bg-white/5 border border-lightMode-fg/10 dark:border-white/10 placeholder:text-lightMode-text2 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner dark:shadow-none"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-lightMode-text2 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="hidden md:flex items-center bg-lightMode-fg/5 dark:bg-white/5 border border-lightMode-fg/10 dark:border-white/10 rounded-xl gap-1 shadow-md backdrop-blur-sm">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              active === tab
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/50'
                : 'text-lightMode-text2 dark:text-darkMode-text2 hover:bg-white/10'
            }`}
          >
            {tab === 'posts' && <span className="inline-flex items-center gap-2"><FaRegImage /> {t("Posts")}</span>}
            {tab === 'music' && <span className="inline-flex items-center gap-2"><FaMusic /> {t("Music")}</span>}
            {tab === 'reels' && <span className="inline-flex items-center gap-2"><FaPlay /> {t("Reels")}</span>}
          </button>
        ))}
      </div>
    </div>
  </div>
))
Header.displayName = 'Header'
// ✅ Music Tab مع memo
const MusicTab = React.memo(({ filteredMusic, current, playing, handleMusicAction, setExpanded }) => {
  if (!filteredMusic?.length) return <EmptyState />
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-white/10 to-white/5 dark:from-black/40 dark:to-black/20 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-xl"
    >
      <div className="space-y-4">
        {filteredMusic.map((track, index) => {
          const isPlayingThis = playing && current && current.id === track.id
          return (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                handleMusicAction(track)
                setExpanded(true)
              }}
              className={`relative flex items-center gap-5 p-4 rounded-2xl border transition-all cursor-pointer ${
                isPlayingThis
                  ? 'bg-gradient-to-r from-indigo-600/70 to-cyan-500/50 border-indigo-400 shadow-lg shadow-indigo-500/40'
                  : 'bg-white/5 hover:bg-white/10 dark:hover:bg-white/5 border-white/10'
              }`}
            >
              <div className="hidden sm:block w-6 text-center text-sm font-semibold text-gray-400">{index + 1}</div>
              <div className="relative flex-shrink-0">
                <Image
                  width={64}
                  height={64}
                  src={track.cover}
                  alt={track.title}
                  className={`w-16 h-16 rounded-xl object-cover shadow-md ${isPlayingThis ? 'ring-2 ring-cyan-400 ring-offset-2' : ''}`}
                />
                {isPlayingThis && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaPause className="text-white text-xl" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate text-lg ${isPlayingThis ? 'text-white drop-shadow-md' : 'text-lightMode-fg dark:text-darkMode-fg'}`}>
                  {track.title}
                </div>
                <div className="text-sm text-gray-400 mt-1 truncate">{track.artist}</div>
              </div>
              <div className="text-sm text-gray-400 hidden md:block">{track.duration}</div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={e => {
                  e.stopPropagation()
                  handleMusicAction(track)
                  setExpanded(true)
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-lg ${
                  isPlayingThis
                    ? 'bg-red-500/90 hover:bg-red-500 text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-black hover:opacity-90'
                }`}
              >
                {isPlayingThis ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-0.5" />}
              </motion.button>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
})
MusicTab.displayName = 'MusicTab'
// ✅ Reels Tab
const ReelsTab = React.memo(({ filteredReels, setOpenReel }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {!filteredReels?.length ? (
      <EmptyState />
    ) : (
      filteredReels.map(r => (
        <motion.div
          key={r.id}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative rounded-2xl overflow-hidden bg-white/3 border border-white/6 group cursor-pointer shadow-xl"
          onClick={() => setOpenReel(r)}
        >
          <div className="relative w-full h-48 md:h-60 overflow-hidden">
            <Image width={500} height={500} src={r.thumbnailUrl} alt={r.caption} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/10 flex items-center justify-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center shadow-2xl opacity-80 group-hover:opacity-100 transition duration-300"
                onClick={e => {
                  e.stopPropagation()
                  setOpenReel(r)
                }}
              >
                <FaPlay className="ml-1" />
              </motion.button>
            </div>
          </div>
          <div className="p-3">
            <div className="font-semibold text-sm truncate">{r.caption}</div>
          </div>
        </motion.div>
      ))
    )}
  </motion.div>
))
ReelsTab.displayName = 'ReelsTab'
// ✅ Reel Modal مع memo
const ReelModal = React.memo(({ openReel, setOpenReel, t }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div onClick={() => setOpenReel(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative z-10 w-full max-w-3xl bg-lightMode-bg dark:bg-darkMode-bg rounded-3xl p-6 shadow-2xl"
    >
      <button
        onClick={() => setOpenReel(null)}
        className="absolute top-3 right-3 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-20"
      >
        <FaTimes />
      </button>
      <video src={openReel.videoUrl} controls className="w-full rounded-xl shadow-xl" />
      <div className="mt-4">
        <div className="font-semibold text-xl">{openReel.caption}</div>
        <div className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mt-1">
          {t("Saved reel —")} {openReel._id}
        </div>
      </div>
    </motion.div>
  </div>
))
ReelModal.displayName = 'ReelModal'