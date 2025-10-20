'use client';
import React from 'react'
import { formatTime } from '@/app/utils/formatTime'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
const SidebarQueue = ({ queue, setTrack }) => {
    const {t} = useTranslation()
  return (
    <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border dark:border-gray-800">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{t("Up Next")}</h4>
        <div className="text-xs text-gray-500">{queue.length} {t("Songs")}</div>
      </div>
      <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
        {queue.map((q) => (
          <div key={q._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg" onClick={() => setTrack(q, 0, queue)}>
            <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
              <Image src={q.cover} alt={q.title} fill className="object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium truncate">{q.title}</div>
              <div className="text-xs text-gray-500 truncate">{q.artist}</div>
            </div>
            <div className="text-xs text-gray-500">{formatTime(q.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}



export default SidebarQueue