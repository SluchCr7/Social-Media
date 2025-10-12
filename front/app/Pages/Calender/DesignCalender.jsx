'use client'
import React from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import AddEventModal from '@/app/Component/AddandUpdateMenus/AddEventModal';
import EventDetailsModal from '@/app/Component/AddandUpdateMenus/EventDetailsModal';
import ShowAllEvents from '@/app/Component/AddandUpdateMenus/ShowAllEvents';


const DesignCalender = ({
    setNewEvent,newEvent,
    currentDate, days,isToday,  setSelectedDate, typeIcons,setCurrentDate, showDayEvents,selectedEvent, setSelectedEvent,
    setShowDayEvents,loading,events,typeColors,handleAddEvent,handleUpdateEvent,handleDeleteEvent,selectedDate
    ,setIsCreating , isCreating
}) => {

  // helper to format day key
  const dayKey = (d) => d.format('YYYY-MM-DD')

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto
      bg-gradient-to-b from-white/2 dark:from-black/40 to-transparent
      text-lightMode-text dark:text-darkMode-text rounded-2xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition"
            title="Previous month"
          >
            <FaChevronLeft />
          </button>

          <div className="flex flex-col text-left">
            <h2 className="text-lg sm:text-2xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
              <button
                onClick={() => setCurrentDate(dayjs())}
                className="text-sm text-blue-500 hover:underline"
              >
                Today
              </button>
              <span>·</span>
              <span>{days.length} days</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
            className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition ml-2 sm:ml-4"
            title="Next month"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // open add event modal by selecting today
              setSelectedDate(dayjs())
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow"
            title="Add event"
          >
            <FaPlus /> <span className="text-sm hidden sm:inline">Add Event</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FaBirthdayCake /> Birthday</span>
            <span className="flex items-center gap-1"><FaUsers /> Meeting</span>
            <span className="flex items-center gap-1"><FaCalendarAlt /> Public</span>
          </div>
        </div>
      </div>

      {/* Days Header */}
      <div className="hidden sm:grid grid-cols-7 text-center font-semibold text-xs sm:text-sm
        text-lightMode-text2 dark:text-darkMode-text2 mb-2 uppercase tracking-wider">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* Days Grid wrapper: on small screens use horizontal scroll */}
      <div className="overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.format("MM-YYYY")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-7 gap-2 min-w-[640px] sm:min-w-full"
          >
            {days.map((day, idx) => {
              const dayStr = dayKey(day)
              const dayEvents = events.filter(
                (ev) => dayjs(ev.date).format("YYYY-MM-DD") === dayStr
              );

              const isCurrent = isToday(day)

              // max 3 previewed events
              const preview = dayEvents.slice(0, 3)
              const moreCount = Math.max(0, dayEvents.length - 3)

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[100px] sm:h-28 border rounded-xl p-2 relative
                    transition-all duration-200 cursor-pointer
                    ${isCurrent ? "bg-blue-50/40 border-blue-400" : "bg-white/3 dark:bg-transparent"}
                    `}
                  onClick={() => setSelectedDate(day)}
                >
                  {/* Date badge */}
                  <div className={`absolute top-2 left-2 text-[12px] font-semibold px-2 py-1 rounded-full
                    ${isCurrent ? "bg-blue-600 text-white" : "bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-100"}`}>
                    {day.date()}
                  </div>

                  {/* small indicators */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {/* red dot: event today */}
                    {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs(), "day")) && (
                      <span className="w-2 h-2 rounded-full bg-red-500" title="Happening today" />
                    )}
                    {/* yellow dot: tomorrow */}
                    {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs().add(1, 'day'), "day")) && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" title="Tomorrow" />
                    )}
                  </div>

                  {/* Events preview */}
                  <div className="mt-6 space-y-1">
                    {preview.map((ev) => (
                      <div
                        key={ev._id}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md font-medium truncate shadow-sm
                          ${typeColors?.[ev.type] || "bg-gray-800/40"} `}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(ev)
                        }}
                        title={ev.title}
                      >
                        <span className="text-sm">{typeIcons?.[ev.type] || '•'}</span>
                        <span className="text-xs truncate">{ev.title}</span>
                        {/* repeat indicator */}
                        {ev.repeatYearly && (
                          <span className="ml-auto text-[10px] px-1 rounded bg-yellow-400/20 text-yellow-600">yr</span>
                        )}
                      </div>
                    ))}

                    {/* more button */}
                    {moreCount > 0 && (
                      <button
                        className="text-[11px] text-blue-600 underline ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDayEvents(dayEvents)
                        }}
                      >
                        +{moreCount} more
                      </button>
                    )}

                    {/* empty hint */}
                    {dayEvents.length === 0 && (
                      <div className="text-[12px] text-gray-500 mt-1">No events</div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Event Modal */}
      {selectedDate && !selectedEvent && (
        <AddEventModal selectedDate={selectedDate}
          newEvent={newEvent} setNewEvent={setNewEvent}
          setSelectedDate={setSelectedDate}
          handleAddEvent={handleAddEvent} isCreating={isCreating}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal 
          handleUpdateEvent={handleUpdateEvent} 
          handleDeleteEvent={handleDeleteEvent} 
          selectedEvent={selectedEvent}      
          setSelectedEvent={setSelectedEvent}  
        />
      )}


      {/* Show All Events in a Day */}
      {showDayEvents && (
        <ShowAllEvents 
          setSelectedEvent={setSelectedEvent} showDayEvents={showDayEvents} setShowDayEvents={setShowDayEvents} typeColors={typeColors} typeIcons={typeIcons}
        />
      )}
    </div>
  )
}

export default DesignCalender
