import Image from 'next/image'
import React from 'react'

const TrendingSongs = ({ songs }) => (
  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">🔥 Trending Now</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {songs.slice(0, 8).map((s) => (
        <div key={s._id} className="p-3 rounded-xl bg-white/40 dark:bg-gray-900/40 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:scale-[1.02] transition-all duration-300">
          <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-2">
            <Image src={s.cover} alt={s.title} fill className="object-cover" />
          </div>
          <div className="text-sm font-medium truncate">{s.title}</div>
          <div className="text-xs text-gray-500 truncate">{s.artist}</div>
        </div>
      ))}
    </div>
  </div>
)

export default TrendingSongs