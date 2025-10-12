import React from 'react'
import SongItem from './SongItem'

const AllSongsFeed = ({ filtered, current, setTrack, songs }) => (
  <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border dark:border-gray-800">
    <h3 className="text-lg font-semibold mb-3">All Songs</h3>
    <div className="space-y-2">
      {filtered.map((s, i) => (
        <SongItem key={s._id} song={s} index={i} setTrack={setTrack} current={current} songs={songs} />
      ))}
    </div>
  </div>
)

export default AllSongsFeed