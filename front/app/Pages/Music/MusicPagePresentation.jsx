'use client';

import React from 'react';
import AddMusicModal from '../../Component/MusicPage/AddMusicMenu';
import MusicSkeleton from '../../Skeletons/MusicSkeleton';
import HeaderMusic from '../../Component/MusicPage/Header';
import NowPlaying from '../../Component/MusicPage/NowPlayingMusic';
import TrendingSongs from '../../Component/MusicPage/TrendingSongs';
import SidebarPlaylist from '../../Component/MusicPage/SidebarPlayList';
import AllSongsFeed from '../../Component/MusicPage/AllSongsFeed';
import SidebarQueue from '../../Component/MusicPage/SidebarQueue';
import SidebarNowPlaying from '../../Component/MusicPage/SidebarNowPlaying';

const GENRES = ['All', 'Pop', 'Rock', 'HipHop', 'Jazz', 'Classical', 'Other'];

function MusicPagePresentation(props) {
  const {
    songs, topCharts, genre, setGenre, current, playing, togglePlay, next, prev, isReady,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, setProgress, duration, volume, setVolume, muted, setMuted,
    setTrack, expanded, setExpanded, shareMusicAsPost,
    userData, search, setSearch, loading, isLoading, openModel, setOpenModel,
    likeMusic, saveMusicInPlayList, queue, myPlaylist, lastMusicRef
  } = props;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      <HeaderMusic
        search={search}
        setSearch={setSearch}
        setOpenModel={setOpenModel}
        userData={userData}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${genre === g
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100'}`}
            >
              {g}
            </button>
          ))}
        </div>

        {isLoading || loading ? (
          <MusicSkeleton />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
            <div className="space-y-6">
              <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
                <NowPlaying
                  current={current}
                  playing={playing}
                  togglePlay={togglePlay}
                  next={next}
                  prev={prev}
                  isReady={isReady}
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
                  shareMusicAsPost={shareMusicAsPost}
                  saveMusicInPlayList={saveMusicInPlayList}
                  userData={userData}
                  myPlaylist={myPlaylist}
                  setTrack={setTrack}
                  songs={songs}
                />
              </section>

              {topCharts.trending?.length > 0 && genre === 'All' && (
                <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6">
                  <TrendingSongs songs={topCharts.trending} setTrack={setTrack} />
                </section>
              )}

              <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {genre === 'All' ? 'Library' : `${genre} tracks`}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {songs?.length || 0} tracks ready to play
                    </p>
                  </div>
                </div>

                <AllSongsFeed
                  filtered={songs}
                  current={current}
                  setTrack={setTrack}
                  songs={songs}
                />

                <div ref={lastMusicRef} className="mt-4 flex justify-center">
                  {isLoading && <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />}
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <SidebarNowPlaying current={current} />
              <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
              <SidebarQueue queue={queue} setTrack={setTrack} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(MusicPagePresentation);
