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

const typeIcons = {
  birthday: <FaBirthdayCake className="text-pink-500" />,
  meeting: <FaRegClock className="text-blue-500" />,
  public: <FaRegCalendarAlt className="text-green-500" />,
  custom: <FaRegCalendarAlt className="text-gray-500" />
}

// تحميل الحركة بشكل lazy لتحسين الأداء
const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

const slideIn = (delay = 0) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.25 }
})

const MenuUpComingEvents = () => {
  const { upcomingEvents } = useEvent()
  const { t } = useTranslation()

  // منع إعادة التصيير في كل مرة إلا عند تغير القائمة فعلاً
  const events = useMemo(() => upcomingEvents || [], [upcomingEvents])

  return (
    <LazyMotion features={loadFeatures}>
      {events.length === 0 ? (
        <m.div
          {...fadeInUp}
          className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <MdEventAvailable className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t("No upcoming events")}
          </p>
          <Link
            href="/Pages/Calender"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
          >
            {t("Create Event")}
          </Link>
        </m.div>
      ) : (
        <m.div
          {...fadeInUp}
          className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-indigo-500">
            <h2 className="flex items-center gap-2 text-white font-semibold text-lg">
              <FaRegCalendarAlt className="text-white" /> {t("Upcoming Events")}
            </h2>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto">
            {events.map((event, idx) => (
              <m.div
                key={event._id}
                {...slideIn(idx * 0.05)}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-200 dark:border-gray-700"
              >
                {/* Type Icon */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xl shadow">
                  {typeIcons[event.type] || typeIcons.custom}
                </div>

                {/* Event Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-gray-800 dark:text-white font-medium text-base truncate">
                    {event.title}
                  </h3>

                  {/* Date + Repeat */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs flex items-center gap-1">
                      <FaRegCalendarAlt />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {event.repeatYearly && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full text-xs">
                        {t("Yearly")}
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
                            alt="user"
                            width={24}
                            height={24}
                            className="rounded-full border border-white dark:border-gray-800 object-cover"
                          />
                        ))}
                        {event.invitedUsers.length > 3 && (
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-xs text-gray-700 dark:text-gray-200 border border-white dark:border-gray-800">
                            +{event.invitedUsers.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {event.invitedUsers.length} {t("invited")}
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
// 🧠 يمنع إعادة التصيير إلا إذا تغيرت الأحداث فعلاً
export default memo(MenuUpComingEvents)
