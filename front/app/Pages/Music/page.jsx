'use client'

import React, { useEffect, useMemo, useState, useCallback, Suspense, useRef } from 'react'
import { useMusic } from '../../Context/MusicContext'
import { useMusicPlayer } from '../../Context/MusicPlayerContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useUser } from '@/app/Context/UserContext'
import { useGetData } from '@/app/Custome/useGetData'
import Loading from '@/app/Component/Loading'

import MusicPagePresentation from './MusicPagePresentation'

export default function MusicPageContainer() {
  const {
    music: songs,
    topCharts,
    isLoading,
    likeMusic,
    shareMusicAsPost,
    genre,
    setGenre,
    searchMusic,
    searchQuery,
    setSearchQuery,
    lastMusicRef
  } = useMusic()

  const { user } = useAuth()
  const { saveMusicInPlayList } = useUser()
  const {
    current, playing, togglePlay, next, prev,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, setCurrentIndex,
    expanded, setExpanded, setProgress, isReady
  } = useMusicPlayer()

  const { loading, userData } = useGetData(user?._id)
  const [openModel, setOpenModel] = useState(false)
  const searchTimeout = useRef(null)

  /* ---------------- 🔍 تحسين البحث الـ Server Side ---------------- */
  const handleSetSearch = useCallback((value) => {
    setSearchQuery(value)

    // Debounce search
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      searchMusic(value)
    }, 500)
  }, [searchMusic, setSearchQuery])

  /* ---------------- 🎵 تحسين قائمة الانتظار ---------------- */
  const queue = useMemo(() => {
    if (!songs?.length) return []
    return [...songs.slice(currentIndex + 1), ...songs.slice(0, currentIndex)]
  }, [songs, currentIndex])

  /* ---------------- 🎶 قائمة المستخدم ---------------- */
  const myPlaylist = useMemo(() => {
    return userData?.myMusicPlaylist?.length ? userData.myMusicPlaylist : []
  }, [userData])

  /* ---------------- ⚡ تحسين الأداء عبر useCallback ---------------- */
  const handleSetGenre = useCallback((g) => setGenre(g), [setGenre])
  const handleSetOpenModel = useCallback((state) => setOpenModel(state), [])
  const handleSetVolume = useCallback((v) => setVolume(v), [setVolume])
  const handleSetMuted = useCallback((v) => setMuted(v), [setMuted])
  const handleSetExpanded = useCallback((v) => setExpanded(v), [setExpanded])
  const handleSetProgress = useCallback((v) => setProgress(v), [setProgress])
  const handleSetCurrentIndex = useCallback((i) => setCurrentIndex(i), [setCurrentIndex])

  return (
    <Suspense fallback={<Loading />}>
      <MusicPagePresentation
        songs={songs}
        topCharts={topCharts}
        genre={genre}
        setGenre={handleSetGenre}
        current={current}
        playing={playing}
        togglePlay={togglePlay}
        next={next}
        prev={prev}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeatMode={repeatMode}
        setRepeatMode={setRepeatMode}
        progress={progress}
        setProgress={handleSetProgress}
        duration={duration}
        volume={volume}
        setVolume={handleSetVolume}
        muted={muted}
        setMuted={handleSetMuted}
        setTrack={setTrack}
        currentIndex={currentIndex}
        setCurrentIndex={handleSetCurrentIndex}
        expanded={expanded}
        setExpanded={handleSetExpanded}
        userData={userData}
        search={searchQuery}
        setSearch={handleSetSearch}
        loading={loading}
        isLoading={isLoading}
        openModel={openModel}
        setOpenModel={handleSetOpenModel}
        likeMusic={likeMusic}
        shareMusicAsPost={shareMusicAsPost}
        saveMusicInPlayList={saveMusicInPlayList}
        queue={queue}
        myPlaylist={myPlaylist}
        isReady={isReady}
        lastMusicRef={lastMusicRef}
      />
    </Suspense>
  )
}
