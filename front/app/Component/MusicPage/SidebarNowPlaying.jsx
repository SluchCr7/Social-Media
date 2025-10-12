import Image from 'next/image'
import React from 'react'

const SidebarNowPlaying = ({ current }) => (
  <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border dark:border-gray-800">
    <div className="text-sm text-gray-500">Now Playing</div>
    <div className="flex items-center gap-3 mt-3">
      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
        {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
      </div>
      <div>
        <div className="font-medium">{current?.title || '—'}</div>
        <div className="text-xs text-gray-500">{current?.artist}</div>
      </div>
    </div>
    <div className="mt-3 text-xs text-gray-500">
      Plays: {current?.views?.length ?? 0} • Likes: {current?.likes?.length ?? 0}
    </div>
  </div>
)



export default SidebarNowPlaying