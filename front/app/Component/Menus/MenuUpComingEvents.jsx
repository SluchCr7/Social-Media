'use client'
import React, { memo, useMemo } from 'react'
import { useEvent } from '../../Context/EventContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineCake,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiChevronRight
} from 'react-icons/hi2'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton'

const typeIcons = {
  birthday: <HiOutlineCake className="text-pink-500" />,
  meeting: <HiOutlineVideoCamera className="text-blue-500" />,
  public: <HiOutlineCalendarDays className="text-emerald-500" />,
  custom: <HiOutlineClock className="text-indigo-500" />
}

const MenuUpComingEvents = () => {
  const { upcomingEvents, loading } = useEvent()
  const { t } = useTranslation()

  const events = useMemo(() => upcomingEvents || [], [upcomingEvents])
  const hasEvents = Array.isArray(events) && events.length > 0

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-500">
      {/* 📅 Header */}
      <div className="px-7 pt-7 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-rose-600 dark:bg-rose-500 rounded-full" />
          {t('The Radar')}
        </h2>
        <Link href="/Pages/Calender" className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-indigo-500 transition-colors">
          <HiOutlineCalendarDays size={20} />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MenuSkeleton />
          </motion.div>
        ) : !hasEvents ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-8 text-center"
          >
            <div className="w-16 h-16 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 group hover:scale-110 transition-transform duration-500">
              <HiOutlineCalendarDays className="text-3xl text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed mb-6">
              {t('No signals on the radar')}
            </p>
            <Link
              href="/Pages/Calender"
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-xl transition-all"
            >
              {t('Initiate Event')}
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col px-4 pb-2"
          >
            <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto pr-1">
              {events.map((event, idx) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container with subtle glow */}
                    <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 shadow-sm text-xl group-hover:scale-110 transition-all duration-500 ring-1 ring-gray-100 dark:ring-white/5">
                      {typeIcons[event.type] || typeIcons.custom}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                          {new Date(event.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {event.repeatYearly && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <span className="text-[10px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest">
                              {t('Yearly')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <HiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-400" />
                  </div>

                  {/* Invited avatars if any */}
                  {event.invitedUsers?.length > 0 && (
                    <div className="flex items-center gap-3 mt-3 ml-15 pl-15">
                      <div className="flex -space-x-2">
                        {event.invitedUsers.slice(0, 3).map((user, i) => (
                          <div key={i} className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-sm bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={user.avatar || '/default-avatar.png'}
                              alt={user.username || 'user'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {event.invitedUsers.length > 3 && (
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[9px] font-black text-indigo-600 dark:text-indigo-400 ring-2 ring-white dark:ring-gray-900 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                            +{event.invitedUsers.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-gray-400/80 dark:text-gray-600 uppercase tracking-widest">
                        {event.invitedUsers.length} {t('registered')}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* View Full Radar Link */}
            <div className="px-3 py-4 mt-2 border-t border-gray-100 dark:border-white/5">
              <Link href="/Pages/Calender" className="group text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all uppercase tracking-wide flex items-center gap-2">
                {t('Open galaxy map')}
                <HiChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(MenuUpComingEvents)
