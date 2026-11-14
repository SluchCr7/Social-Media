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
import { Upload, Music2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

const GENRES = ['All', 'Pop', 'Rock', 'HipHop', 'Jazz', 'Classical', 'Lo-Fi', 'Electronic', 'Ambient', 'Trap', 'Other'];

function MusicPagePresentation(props) {
  const {
    songs, topCharts, genre, setGenre, current, playing, togglePlay, next, prev, isReady,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, setProgress, duration, volume, setVolume, muted, setMuted,
    setTrack, expanded, setExpanded, shareMusicAsPost,
    userData, search, setSearch, loading, isLoading, hasLoadedOnce, error, retryMusic, openModel, setOpenModel,
    likeMusic, saveMusicInPlayList, queue, myPlaylist, lastMusicRef
  } = props;

  const showSkeleton = (isLoading && !hasLoadedOnce) || (loading && !hasLoadedOnce && (!songs || songs.length === 0));
  const hasMusic = Array.isArray(songs) && songs.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#08080f] text-zinc-100">

      {/* Ambient bg glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.14),transparent)]" />

      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      <HeaderMusic
        search={search}
        setSearch={setSearch}
        setOpenModel={setOpenModel}
        userData={userData}
      />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-24 sm:px-6 lg:px-8">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#1a1a2e] via-[#13131f] to-[#0f0f19] p-6 sm:p-8">
          {/* Decorative orbs */}
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-purple-600/8 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="max-w-lg">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                <Music2 size={12} />
                Your Music Space
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Discover & stream{' '}
                <span className="text-indigo-400">great music</span>
              </h1>
              <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                Explore the library, follow the mood, and keep your listening in one place.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Track count chip */}
              <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5">
                <Music2 size={16} className="text-indigo-400" />
                <div>
                  <p className="text-sm font-bold text-white leading-none">{songs?.length || 0}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">tracks</p>
                </div>
              </div>

              {/* Upload button */}
              <button
                type="button"
                onClick={() => setOpenModel(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-indigo-500 hover:text-white shadow-lg shadow-black/20"
              >
                <Upload size={15} />
                Upload Track
              </button>
            </div>
          </div>
        </section>

        {/* ── Genre Chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={genre === g}
              onClick={() => setGenre(g)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                genre === g
                  ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ── Skeleton ── */}
        {showSkeleton ? (
          <MusicSkeleton />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

            {/* ─── Main Column ─── */}
            <div className="min-w-0 space-y-5">

              {/* Now Playing Player */}
              {hasMusic || current ? (
                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f19] shadow-[0_16px_60px_rgba(0,0,0,0.3)]">
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
              ) : (
                /* Empty player state */
                <section className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Music2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">Your listening space is ready</p>
                    <p className="text-xs text-zinc-600 mt-0.5">Pick a track from the library below to start playing.</p>
                  </div>
                </section>
              )}

              {/* Trending Songs */}
              {topCharts.trending?.length > 0 && genre === 'All' && !search && (
                <section className="rounded-2xl border border-white/[0.07] bg-[#0f0f19] p-5">
                  <TrendingSongs songs={topCharts.trending} setTrack={setTrack} />
                </section>
              )}

              {/* Library Feed */}
              <section className="rounded-2xl border border-white/[0.07] bg-[#0f0f19] overflow-hidden">

                {/* Library header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <TrendingUp size={13} className="text-indigo-400" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Library</span>
                    </div>
                    <h2 className="text-base font-bold text-white">
                      {search ? 'Search Results' : genre === 'All' ? 'All Tracks' : `${genre} Picks`}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLoading && hasLoadedOnce && (
                      <RefreshCw size={14} className="text-zinc-600 animate-spin" />
                    )}
                    <span className="text-xs text-zinc-600 font-medium">
                      {songs?.length || 0} {songs?.length === 1 ? 'track' : 'tracks'}
                    </span>
                  </div>
                </div>

                {/* Error banner */}
                {error && (
                  <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={15} className="text-rose-400 shrink-0" />
                      <p className="text-sm text-rose-300">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={retryMusic}
                      className="shrink-0 rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/15 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Songs list / empty state */}
                <div className="p-5">
                  {!hasMusic ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                        <Music2 size={28} />
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {search ? 'No matching tracks' : 'Nothing here yet'}
                      </h3>
                      <p className="mt-2 max-w-xs text-sm text-zinc-600">
                        {search
                          ? 'Try another artist, title, or keyword.'
                          : 'Try another genre or be the first to add a track.'}
                      </p>
                      <button
                        onClick={() => setOpenModel(true)}
                        className="mt-5 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-indigo-500 hover:text-white shadow-lg shadow-black/20"
                      >
                        Upload Music
                      </button>
                    </div>
                  ) : (
                    <>
                      <AllSongsFeed
                        filtered={songs}
                        current={current}
                        playing={playing}
                        setTrack={setTrack}
                      />
                      <div ref={lastMusicRef} className="mt-4 flex justify-center">
                        {isLoading && (
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>

            {/* ─── Sidebar ─── */}
            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
              {hasMusic ? (
                <>
                  <SidebarNowPlaying current={current} />
                  <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
                  <SidebarQueue queue={queue} setTrack={setTrack} />
                </>
              ) : (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <p className="text-sm font-semibold text-zinc-300">Queue &amp; Playlist</p>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">Your queue and saved playlist will appear here once music is available.</p>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default React.memo(MusicPagePresentation);
