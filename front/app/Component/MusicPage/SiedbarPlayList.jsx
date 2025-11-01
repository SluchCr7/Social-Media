'use client';
import Image from 'next/image'
import React , { memo } from 'react'
import { formatTime } from '@/app/utils/formatTime'
import { useTranslation } from 'react-i18next'


const SidebarPlaylist = memo(({ myPlaylist, setTrack }) => {
  const {t} = useTranslation()
  return (    
    <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border dark:border-gray-800">
      <h4 className="font-semibold mb-3">{t("My Playlist")}</h4>
      {myPlaylist?.length ? (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {myPlaylist.map((s, i) => (
            <div key={s._id} onClick={() => setTrack(s, i, myPlaylist)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
              <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
                <Image src={s.cover} alt={s.title} fill className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-xs text-gray-500 truncate">{s.artist}</div>
              </div>
              <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No saved songs yet.</div>
      )}
    </div>
  )
})

SidebarPlaylist.displayName = 'SidebarPlaylist'
export default SidebarPlaylist