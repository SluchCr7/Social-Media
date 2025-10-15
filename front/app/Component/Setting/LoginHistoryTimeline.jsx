'use client'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)
dayjs.locale('en')

function LoginHistoryTimeline({ items = [] }) {
  const {t} = useTranslation()
  if (!items.length)
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
        {t("No recent login activity found.")}
      </div>
    )

  return (
    <ul className="relative border-l border-gray-200 dark:border-gray-700 pl-6 space-y-6">
      {items.map((it, idx) => (
        <li key={idx} className="relative">
          {/* 🔵 النقطة الزرقاء */}
          <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/30" />

          {/* 💬 المحتوى */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {it.device || 'Unknown device'}
              {it.location && (
                <span className="text-gray-500 dark:text-gray-400">
                  {' '}
                  • {it.location}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {it.date
                ? dayjs(it.date).fromNow()
                : 'Unknown time'}
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">
            {it.ip || 'No IP info'}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default LoginHistoryTimeline
