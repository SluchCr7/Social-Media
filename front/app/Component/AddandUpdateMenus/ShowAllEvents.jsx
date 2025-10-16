'use client'
import React from 'react'
import { motion } from 'framer-motion'
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
const ShowAllEvents = ({setSelectedEvent,showDayEvents ,setShowDayEvents,typeColors,typeIcons}) => {
  const {t} = useTranslation()
  return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="bg-gradient-to-br from-white/3 to-transparent dark:from-black/60 backdrop-blur-xl
              rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-white/6 max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">{t("Day Events")}</h3>
            {showDayEvents.map((ev) => (
              <div
                key={ev._id}
                className={`px-3 py-2 mb-2 rounded-md font-medium flex items-center gap-2 cursor-pointer shadow-sm 
                  ${typeColors?.[ev.type] || "bg-gray-800/30"} ${ev.repeatYearly ? "border border-yellow-400" : ""}`}
                onClick={() => {
                  setSelectedEvent(ev)
                  setShowDayEvents(null)
                }}
              >
                <span>{typeIcons?.[ev.type] || '•'}</span>
                <div className="flex-1">
                  <p className="font-semibold">{ev.title}</p>
                  <p className="text-xs">{ev.description}</p>
                </div>
                <div className="text-xs text-gray-500">{dayjs(ev.date).format("DD MMM")}</div>
              </div>
            ))}
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded bg-white/5" onClick={() => setShowDayEvents(null)}>
                {t("Close")}
              </button>
            </div>
          </motion.div>
      </div>
  )
}

export default ShowAllEvents