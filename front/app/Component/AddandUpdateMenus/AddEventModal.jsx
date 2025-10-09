'use client'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AddEventModal = ({newEvent, setNewEvent , setSelectedDate,handleAddEvent,selectedDate}) => {
  return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-br from-white/3 to-transparent dark:from-black/60 backdrop-blur-xl
              rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-white/6"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Add Event on {selectedDate.format("DD MMM YYYY")}</h3>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded mb-3 bg-white/5"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              <option value="birthday">🎂 Birthday</option>
              <option value="meeting">👥 Meeting</option>
              <option value="public">📅 Public</option>
              <option value="custom">⭐ Custom</option>
            </select>

            <div className="flex items-center mb-3 gap-2">
              <input
                type="checkbox"
                checked={newEvent.repeatYearly}
                onChange={(e) => setNewEvent({ ...newEvent, repeatYearly: e.target.checked })}
                id="repeatYearly"
              />
              <label htmlFor="repeatYearly" className="text-sm">Repeat every year</label>
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-white/5" onClick={() => setSelectedDate(null)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
                onClick={handleAddEvent}
                disabled={false}
              >
                <FaPlus /> Add
              </button>
            </div>
          </motion.div>
      </div>
  )
}

export default AddEventModal