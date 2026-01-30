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

function MusicPagePresentation(props) {
  const {
    songs, filtered, current, playing, togglePlay, next, prev, isReady,
    shuffle, setShuffle, repeatMode, setRepeatMode,
    progress, setProgress, duration, volume, setVolume, muted, setMuted,
    setTrack, currentIndex, expanded, setExpanded, shareMusicAsPost,
    userData, search, setSearch, loading, isLoading, openModel, setOpenModel,
    likeMusic, saveMusicInPlayList, queue, myPlaylist
  } = props;

  // Use the song's primary color or fallback to indigo/purple
  const auroraGlow = useMemo(() => {
    return 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.05) 100%)';
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-[#050505] text-gray-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* 🔮 Immersive Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30" style={{ background: auroraGlow }} />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
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

      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8 px-6 py-8 relative z-10">
        <aside className="xl:w-80 space-y-8 hidden xl:block sticky top-28 self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
          <SidebarNowPlaying current={current} />
          <SidebarPlaylist myPlaylist={myPlaylist} setTrack={setTrack} />
        </aside>

        <main className="flex-1 space-y-12">
          {isLoading || loading ? (
            <MusicSkeleton />
          ) : (
            <div className="space-y-12 pb-24">
              <section className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
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

          <div className="space-y-16">
            <TrendingSongs songs={songs} setTrack={setTrack} />
            <AllSongsFeed
              filtered={filtered}
              current={current}
              setTrack={setTrack}
              songs={songs}
            />
          </div>
        )}
      </main>

        <aside className="xl:w-80 space-y-8 hidden 2xl:block sticky top-28 self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
          <SidebarQueue queue={queue} setTrack={setTrack} />

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-lg font-black text-white mb-2 leading-tight">Elevate Your Sound</h4>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-6">Unlock lossless audio and custom themes.</p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
              Try Premium For Free
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default React.memo(MusicPagePresentation);
