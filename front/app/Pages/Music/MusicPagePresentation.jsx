'use client'

import React from 'react'
import AddMusicModal from '@/app/Component/MusicPage/AddMusicMenu'
import MusicSkeleton from '@/app/Skeletons/MusicSkeleton'
import HeaderMusic from '@/app/Component/MusicPage/Header'
import NowPlaying from '@/app/Component/MusicPage/NowPlayingMusic'
import TrendingSongs from '@/app/Component/MusicPage/TrendingSongs'
import SidebarPlaylist from '@/app/Component/MusicPage/SiedbarPlayList'
import AllSongsFeed from '@/app/Component/MusicPage/AllSongsFeed'
import SidebarQueue from '@/app/Component/MusicPage/SidebarQueue'
import SidebarNowPlaying from '@/app/Component/MusicPage/SidebarNowPlaying'

export default function MusicPagePresentation(props) {
  const {
    songs, filtered, current, playing, togglePlay, next, prev,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, setProgress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, expanded, setExpanded,
    userData, search, setSearch, loading, isLoading, openModel, setOpenModel,
    likeMusic, saveMusicInPlayList, queue, myPlaylist
  } = props

  // Gradient style للأغنية الحالية
  const accentStyle = {
    background: `linear-gradient(90deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))`,
  }

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      {/* Header */}
      <HeaderMusic
        search={search}
        setSearch={setSearch}
        setOpenModel={setOpenModel}
        userData={userData}
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Main Feed */}
        <main className="xl:col-span-9 space-y-8">
          {isLoading || loading ? <MusicSkeleton /> : (
            <div className="space-y-8">
              <NowPlaying
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
                expanded={expanded}
                setExpanded={setExpanded}
                likeMusic={likeMusic}
                saveMusicInPlayList={saveMusicInPlayList}
                userData={userData}
                myPlaylist={myPlaylist}
                accentStyle={accentStyle}
                setTrack={setTrack}
                songs={songs}
                currentIndex={currentIndex}
              />

              <AllSongsFeed
                filtered={filtered}
                current={current}
                setTrack={setTrack}
                songs={songs}
              />

              <TrendingSongs songs={songs} />

            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="xl:col-span-3 space-y-6 sticky top-24 self-start">
          <SidebarNowPlaying current={current} />
          <SidebarQueue queue={queue} setTrack={setTrack} />
          <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
        </aside>

      </div>
    </div>
  )
}



