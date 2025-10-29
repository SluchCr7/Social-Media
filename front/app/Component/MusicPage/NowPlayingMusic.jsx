import React from 'react'
import PlayerHeader from './PlayerHeader'
import PlayerControls from './PlayerControls'
import Image from 'next/image'

const NowPlaying = ({
  current, playing, togglePlay, next, prev,
  shuffle, setShuffle, repeatMode, setRepeatMode,shareMusicAsPost,
  progress, setProgress, duration, volume, setVolume, muted, setMuted,
  expanded, setExpanded, likeMusic, saveMusicInPlayList,
  userData, myPlaylist, accentStyle, setTrack, songs, currentIndex,isReady
}) => (
  <div className="rounded-2xl p-6 relative shadow-sm border dark:border-gray-800" style={accentStyle}>
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-48 h-48 md:w-44 md:h-44 rounded-xl shadow-xl overflow-hidden bg-gray-200">
        {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
      </div>
      <div className="flex-1">
        <PlayerHeader
          current={current}
          likeMusic={likeMusic}
          saveMusicInPlayList={saveMusicInPlayList}
          userData={userData}
          myPlaylist={myPlaylist}
          setExpanded={setExpanded}
          shareMusicAsPost={shareMusicAsPost}
        />
        <PlayerControls
          togglePlay={togglePlay}
          playing={playing}
          prev={prev}
          next={next}
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
          isReady={isReady}
        />
      </div>
    </div>
  </div>
)


export default NowPlaying