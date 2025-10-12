'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useMusic } from '../../Context/MusicContext'
import { useMusicPlayer } from '../../Context/MusicPlayerContext'
import { useAuth } from '@/app/Context/AuthContext'
import MusicPagePresentation from './MusicPage.presentation'
import { useUser } from '@/app/Context/UserContext'
import { useGetData } from '@/app/Custome/useGetData'

export default function MusicPageContainer() {
  const { music: songs, isLoading, likeMusic } = useMusic()
  const { user } = useAuth()
  const { getUserById, saveMusicInPlayList} = useUser()
  const {
    current, playing, togglePlay, next, prev,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, setCurrentIndex,
    expanded, setExpanded, setProgress
  } = useMusicPlayer()

  const {loading , userData} = useGetData(user?._id)
  const [search, setSearch] = useState('')
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
    <MusicPagePresentation
      songs={songs}
      filtered={filtered}
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
      setProgress={setProgress}
      duration={duration}
      volume={volume}
      setVolume={setVolume}
      muted={muted}
      setMuted={setMuted}
      setTrack={setTrack}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      expanded={expanded}
      setExpanded={setExpanded}
      userData={userData}
      search={search}
      setSearch={setSearch}
      loading={loading}
      isLoading={isLoading}
      openModel={openModel}
      setOpenModel={setOpenModel}
      likeMusic={likeMusic}
      saveMusicInPlayList={saveMusicInPlayList}
      queue={queue}
      myPlaylist={myPlaylist}
    />
  )
}
