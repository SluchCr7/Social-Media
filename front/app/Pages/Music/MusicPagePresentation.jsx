'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMusicModal from '../../Component/MusicPage/AddMusicMenu';
import MusicSkeleton from '../../Skeletons/MusicSkeleton';
import HeaderMusic from '../../Component/MusicPage/Header';
import NowPlaying from '../../Component/MusicPage/NowPlayingMusic';
import TrendingSongs from '../../Component/MusicPage/TrendingSongs';
import SidebarPlaylist from '../../Component/MusicPage/SidebarPlayList';
import AllSongsFeed from '../../Component/MusicPage/AllSongsFeed';
import SidebarQueue from '../../Component/MusicPage/SidebarQueue';
import SidebarNowPlaying from '../../Component/MusicPage/SidebarNowPlaying';

const GENRES = ["All", "Pop", "Rock", "HipHop", "Jazz", "Classical", "Other"];

function MusicPagePresentation(props) {
  const {
    songs, topCharts, genre, setGenre, current, playing, togglePlay, next, prev, isReady,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, setProgress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, expanded, setExpanded, shareMusicAsPost,
    userData, search, setSearch, loading, isLoading, openModel, setOpenModel,
    likeMusic, saveMusicInPlayList, queue, myPlaylist, lastMusicRef
  } = props;

  const auroraGlow = useMemo(() => {
    return 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.05) 100%)';
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-[#050505] text-gray-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* 🔮 Immersive Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30" style={{ background: auroraGlow }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full"
        />
      </div>

      <AddMusicModal isOpen={openModel} onClose={() => setOpenModel(false)} />

      <HeaderMusic
        search={search}
        setSearch={setSearch}
        setOpenModel={setOpenModel}
        userData={userData}
      />

      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-8 px-4 py-8 relative z-10">

        {/* Left Sidebar */}
        <aside className="xl:w-80 space-y-8 hidden xl:block sticky top-28 self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
          <SidebarNowPlaying current={current} />
          <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Genre Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${genre === g
                    ? "bg-white text-black shadow-xl shadow-white/5 scale-105"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>

          {isLoading || loading ? (
            <MusicSkeleton />
          ) : (
            <div className="space-y-16 pb-24">
              {/* Featured / Now Playing Hero */}
              <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl transition-all hover:border-white/10">
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
                  currentIndex={currentIndex}
                />
              </section>

              {/* Dynamic Content */}
              <div className="space-y-20">
                {topCharts.trending?.length > 0 && genre === "All" && (
                  <TrendingSongs songs={topCharts.trending} setTrack={setTrack} />
                )}

                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                      {genre === "All" ? "Exploration" : `${genre} Vibes`}
                    </h2>
                  </div>
                  <AllSongsFeed
                    filtered={songs}
                    current={current}
                    setTrack={setTrack}
                    songs={songs}
                  />
                  {/* Infinite Scroll Trigger */}
                  <div ref={lastMusicRef} className="h-20 flex items-center justify-center">
                    {isLoading && <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />}
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="xl:w-80 space-y-8 hidden 2xl:block sticky top-28 self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
          <SidebarQueue queue={queue} setTrack={setTrack} />

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-800 relative overflow-hidden group shadow-2xl shadow-indigo-500/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-xl font-black text-white mb-3 leading-tight uppercase tracking-tighter">Ultra High Fidelity</h4>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-8">Experience sound in its purest form with lossless encryption.</p>
            <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:text-white transition-all">
              Go Premium
            </button>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

export default React.memo(MusicPagePresentation);
