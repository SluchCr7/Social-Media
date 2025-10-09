'use client'
import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import dayjs from "dayjs";

const EventDetailsModal = ({ handleUpdateEvent, handleDeleteEvent, selectedEvent, setSelectedEvent }) => {
  return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-gradient-to-br from-white/3 to-transparent dark:from-black/60 backdrop-blur-xl
              rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-white/6"
          >
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
            <textarea
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={selectedEvent.description}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={selectedEvent.type}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, type: e.target.value })}
            >
              <option value="birthday">🎂 Birthday</option>
              <option value="meeting">👥 Meeting</option>
              <option value="public">📅 Public</option>
              <option value="custom">⭐ Custom</option>
            </select>

            <div className="flex items-center mb-3 gap-2">
              <input
                type="checkbox"
                checked={selectedEvent.repeatYearly || false}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, repeatYearly: e.target.checked })}
                id="repeatYearlyEdit"
              />
              <label htmlFor="repeatYearlyEdit" className="text-sm">Repeat every year</label>
            </div>

            <p className="text-sm text-gray-500 mb-4">Date: {dayjs(selectedEvent.date).format("DD MMM YYYY")}</p>

            <div className="flex justify-between">
              <button className="px-4 py-2 rounded bg-white/5" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2"
                  onClick={handleUpdateEvent}
                >
                  <FaEdit /> Save
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white flex items-center gap-2"
                  onClick={handleDeleteEvent}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </motion.div>
      </div>
  )
}

export default EventDetailsModal