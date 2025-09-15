'use client'
import React from 'react'
import { useEvent } from '../Context/EventContext'
import { motion } from 'framer-motion'
import { FaBirthdayCake, FaUsers, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'

const typeIcons = {
  birthday: <FaBirthdayCake className="text-pink-500" />,
  meeting: <FaRegClock className="text-blue-500" />,
  public: <FaRegCalendarAlt className="text-green-500" />,
  custom: <FaRegCalendarAlt className="text-gray-500" />
}

const MenuUpComingEvents = () => {
  const { upcomingEvents } = useEvent()

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400"
      >
        No upcoming events.
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-white font-semibold text-lg">Upcoming Events</h2>
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto">
        {upcomingEvents.map((event, idx) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors"
          >
            {/* Type Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-xl">
              {typeIcons[event.type] || typeIcons.custom}
            </div>

            {/* Event Info */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-gray-800 dark:text-white font-medium truncate">{event.title}</h3>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
                <FaRegCalendarAlt />
                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {event.repeatYearly && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full">Yearly</span>}
              </div>

              {event.invitedUsers && event.invitedUsers.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
                  <FaUsers />
                  <span>{event.invitedUsers.length} invited</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MenuUpComingEvents
