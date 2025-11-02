'use client'
import React, { memo, useMemo } from 'react'
import { useEvent } from '../../Context/EventContext'
import { LazyMotion, m } from 'framer-motion'
import {
  FaBirthdayCake,
  FaRegCalendarAlt,
  FaRegClock
} from 'react-icons/fa'
import { MdEventAvailable } from 'react-icons/md'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton'

// أنواع الأحداث وأيقوناتها 🎯
const typeIcons = {
  birthday: <FaBirthdayCake className="text-pink-500" />,
  meeting: <FaRegClock className="text-blue-500" />,
  public: <FaRegCalendarAlt className="text-green-500" />,
  custom: <FaRegCalendarAlt className="text-gray-400" />
}

// تحميل ميزات الحركة بشكل Lazy
const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)

// حركات عامة
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

const slideIn = (delay = 0) => ({
  initial: { opacity: 0, x: 25 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.35, ease: 'easeOut' }
})

const MenuUpComingEvents = () => {
  const { upcomingEvents, loading } = useEvent()
  const { t } = useTranslation()
  
  // 🧠 استخدم useMemo لتفادي التصيير الزائد
  const events = useMemo(() => upcomingEvents || [], [upcomingEvents])
  const hasEvents = Array.isArray(events) && events.length > 0

  return (
    <LazyMotion features={loadFeatures}>
      {/* حالة التحميل */}
      {loading ? (
        <MenuSkeleton />
      ) : !hasEvents ? (
        // 🚫 حالة عدم وجود أحداث
        <m.div
          {...fadeInUp}
          className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center transition-all duration-300"
        >
          <MdEventAvailable className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            {t('No upcoming events')}
          </p>
          <Link
            href="/Pages/Calender"
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {t('Create Event')}
          </Link>
        </m.div>
      ) : (
        // ✅ عرض الأحداث
        <m.div
          {...fadeInUp}
          className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[520px] overflow-hidden transition-all"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-500">
            <h2 className="flex items-center gap-2 text-white font-semibold text-lg tracking-wide">
              <FaRegCalendarAlt className="text-white" /> {t('Upcoming Events')}
            </h2>
            <Link
              href="/Pages/Calender"
              className="text-xs text-white/80 hover:text-white transition"
            >
              {t('View All')}
            </Link>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 hover:scrollbar-thumb-indigo-400 dark:hover:scrollbar-thumb-indigo-500">
            {events.map((event, idx) => (
              <m.div
                key={event._id}
                {...slideIn(idx * 0.05)}
                className="group flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-[#1f2127] transition-colors cursor-pointer border-b border-gray-200 dark:border-gray-700"
              >
                {/* Type Icon */}
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                  {typeIcons[event.type] || typeIcons.custom}
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-800 dark:text-white font-medium text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {event.title}
                  </h3>

                  {/* Date + Repeat */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full flex items-center gap-1">
                      <FaRegCalendarAlt />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {event.repeatYearly && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full">
                        {t('Yearly')}
                      </span>
                    )}
                  </div>

                  {/* Invited Users */}
                  {event.invitedUsers?.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex -space-x-2">
                        {event.invitedUsers.slice(0, 3).map((user, i) => (
                          <Image
                            key={i}
                            src={user.avatar || '/default-avatar.png'}
                            alt={user.username || 'user'}
                            width={26}
                            height={26}
                            className="rounded-full border border-white dark:border-gray-800 object-cover"
                          />
                        ))}
                        {event.invitedUsers.length > 3 && (
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-xs text-gray-700 dark:text-gray-200 border border-white dark:border-gray-800">
                            +{event.invitedUsers.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 dark:text-gray-300 text-xs">
                        {event.invitedUsers.length} {t('invited')}
                      </span>
                    </div>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </m.div>
      )}
    </LazyMotion>
  )
}

export default memo(MenuUpComingEvents)
