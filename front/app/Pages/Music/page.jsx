'use client'

import React, { useEffect, useMemo, useState, useCallback, Suspense, useRef } from 'react'
import { useMusic } from '@/app/redux/hooks';
import { useMusicPlayer } from '@/app/redux/hooks';
import { useAuth } from '@/app/redux/hooks';
import { useUser } from '@/app/redux/hooks';
import { useGetData } from '@/app/Custome/useGetData'
import Loading from '@/app/Component/Loading'

import MusicPagePresentation from './MusicPagePresentation'

export default function MusicPageContainer() {
  const {
    music: songs,
    topCharts,
    isLoading,
    error,
    hasLoadedOnce,
    likeMusic,
    shareMusicAsPost,
    genre,
    setGenre,
    searchMusic,
    retryMusic,
    searchQuery,
    setSearchQuery,
    lastMusicRef
  } = useMusic()

  const { user } = useAuth()
  const { saveMusicInPlayList } = useUser()
  const {
    current, playing, togglePlay, next, prev,
    setSongs,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, setCurrentIndex,
    expanded, setExpanded, setProgress, isReady 
  } = useMusicPlayer()

  const { loading, userData } = useGetData(user?._id)
  const [openModel, setOpenModel] = useState(false)
  const [playlistOverride, setPlaylistOverride] = useState(null)
  const searchTimeout = useRef(null)

  useEffect(() => {
    setSongs(songs)
  }, [songs, setSongs])

  useEffect(() => {
    setPlaylistOverride(null)
  }, [user?._id])

  useEffect(() => () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
  }, [])

  const handleSetSearch = useCallback((value) => {
    setSearchQuery(value)

    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      searchMusic(value)
    }, 500)
  }, [searchMusic, setSearchQuery])

  const queue = useMemo(() => {
    if (!songs?.length) return []
    if (currentIndex < 0) return songs
    return [...songs.slice(currentIndex + 1), ...songs.slice(0, currentIndex)]
  }, [songs, currentIndex])

  const myPlaylist = useMemo(() => {
    return playlistOverride ?? userData?.myMusicPlaylist ?? []
  }, [playlistOverride, userData])

  const handleSaveMusicInPlayList = useCallback(async (musicId) => {
    const result = await saveMusicInPlayList(musicId)
    if (Array.isArray(result?.playlist)) setPlaylistOverride(result.playlist)
    return result
  }, [saveMusicInPlayList])

  const handleSetGenre = useCallback((g) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    setGenre(g)
  }, [setGenre])
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
        hasLoadedOnce={hasLoadedOnce}
        error={error}
        retryMusic={retryMusic}
        openModel={openModel}
        setOpenModel={handleSetOpenModel}
        likeMusic={likeMusic}
        shareMusicAsPost={shareMusicAsPost}
        saveMusicInPlayList={handleSaveMusicInPlayList}
        queue={queue}
        myPlaylist={myPlaylist}
        isReady={isReady}
        lastMusicRef={lastMusicRef}
      />
    </Suspense>
  )
}
