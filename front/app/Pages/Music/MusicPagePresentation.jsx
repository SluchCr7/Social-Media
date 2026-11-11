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
import { ArrowUpRight, Headphones, Music2, Sparkles, Upload } from 'lucide-react';

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
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#09090d] text-zinc-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_55%_0%,rgba(99,102,241,0.2),transparent_58%)]" />
      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      <HeaderMusic
        search={search}
        setSearch={setSearch}
        setOpenModel={setOpenModel}
        userData={userData}
      />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-6 pb-16 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#17172a] via-[#11111a] to-[#101016] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-9">
          <div aria-hidden="true" className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-[-8rem] right-[22%] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/[0.08] px-3 py-1.5 text-xs font-medium text-indigo-200">
                <Sparkles size={14} />
                A little space for your sound
              </div>
              <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Find your next <span className="text-indigo-300">favorite</span> track.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                Explore new releases, follow the mood, and keep your listening in one simple place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 sm:flex">
                <Headphones className="text-indigo-300" size={19} />
                <div>
                  <p className="text-sm font-semibold text-white">{songs?.length || 0}</p>
                  <p className="text-[11px] text-zinc-500">Tracks in view</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenModel(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                <Upload size={16} />
                Share a track
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={genre === g}
              onClick={() => setGenre(g)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${genre === g
                ? 'border-indigo-300/30 bg-indigo-300/15 text-indigo-100'
                : 'border-white/[0.08] bg-white/[0.025] text-zinc-400 hover:border-white/20 hover:text-white'}`}
            >
              {g}
            </button>
          ))}
        </div>

        {showSkeleton ? (
          <MusicSkeleton />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              {hasMusic || current ? (
                <section className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#111117] shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
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
                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Your listening space is ready</p>
                      <p className="text-sm text-zinc-500">Explore the library or share a track of your own.</p>
                    </div>
                  </div>
                </section>
              )}

              {topCharts.trending?.length > 0 && genre === 'All' && !search && (
                <section className="rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-4 sm:p-6">
                  <TrendingSongs songs={topCharts.trending} setTrack={setTrack} />
                </section>
              )}

              <section className="rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-indigo-300">
                      <Music2 size={14} />
                      LISTEN YOUR WAY
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                      {search ? 'Search results' : genre === 'All' ? 'Your library' : `${genre} picks`}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {songs?.length || 0} {songs?.length === 1 ? 'track' : 'tracks'}
                    </p>
                  </div>
                  {isLoading && hasLoadedOnce && (
                    <span className="text-xs text-zinc-500" role="status">Updating library…</span>
                  )}
                </div>

                {error && (
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3">
                    <p className="text-sm text-rose-200">{error}</p>
                    <button type="button" onClick={retryMusic} className="rounded-full border border-rose-300/20 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-300/10">
                      Try again
                    </button>
                  </div>
                )}

                {!hasMusic ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/70 px-6 py-14 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{search ? 'No matching tracks' : 'Nothing here yet'}</h3>
                    <p className="mt-2 max-w-md text-sm text-zinc-500">
                      {search ? 'Try another artist, title, or keyword.' : 'Try another genre or add the first track to your library.'}
                    </p>
                    <button
                      onClick={() => setOpenModel(true)}
                      className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-indigo-500 hover:text-white"
                    >
                      Upload music
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
                      {isLoading && <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />}
                    </div>
                  </>
                )}
              </section>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              {hasMusic ? (
                <>
                  <SidebarNowPlaying current={current} />
                  <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
                  <SidebarQueue queue={queue} setTrack={setTrack} />
                </>
              ) : (
                <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                  <p className="font-semibold text-zinc-300">No active queue yet</p>
                  <p className="mt-2">Once music is available, your listening queue and playlist will appear here.</p>
                </section>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default React.memo(MusicPagePresentation);
