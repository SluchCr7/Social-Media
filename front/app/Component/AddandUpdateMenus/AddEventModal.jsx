'use client'
import React from 'react'
import { FaPlus, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AddEventModal = ({ newEvent, setNewEvent, setSelectedDate, handleAddEvent, selectedDate, isCreating }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-white/20 to-white/5 dark:from-zinc-900 dark:to-zinc-800
          backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10"
      >
        <h3 className="text-xl font-semibold mb-5 text-center text-blue-600 dark:text-blue-400">
          Add Event on {selectedDate.format("DD MMM YYYY")}
        </h3>

        {/* Title Input */}
        <input
          type="text"
          placeholder="🎯 Event Title"
          className="w-full border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40
            p-3 rounded-lg mb-4 bg-white/10 text-gray-900 dark:text-gray-100 placeholder-gray-400
            outline-none transition-all"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        {/* Description */}
        <textarea
          placeholder="📝 Description"
          className="w-full border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40
            p-3 rounded-lg mb-4 bg-white/10 text-gray-900 dark:text-gray-100 placeholder-gray-400
            outline-none resize-none min-h-[80px] transition-all"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />

        {/* Type */}
        <select
          className="w-full border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40
            p-3 rounded-lg mb-4 bg-white/10 text-gray-900 dark:text-gray-100 transition-all"
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        >
          <option value="birthday">🎂 Birthday</option>
          <option value="meeting">👥 Meeting</option>
          <option value="public">📅 Public</option>
          <option value="custom">⭐ Custom</option>
        </select>

        {/* Repeat yearly */}
        <div className="flex items-center mb-5 gap-2">
          <input
            type="checkbox"
            checked={newEvent.repeatYearly}
            onChange={(e) => setNewEvent({ ...newEvent, repeatYearly: e.target.checked })}
            id="repeatYearly"
            className="accent-blue-500 w-4 h-4"
          />
          <label htmlFor="repeatYearly" className="text-sm text-gray-700 dark:text-gray-300">
            Repeat every year
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200/30 hover:bg-gray-300/40 text-gray-800 dark:text-gray-200
              transition font-medium"
            onClick={() => setSelectedDate(null)}
            disabled={isCreating}
          >
            Cancel
          </button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isCreating || !newEvent.title}
            onClick={handleAddEvent}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 font-semibold text-white
              ${isCreating ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-500 transition"}
              disabled:opacity-60`}
          >
            {isCreating ? (
              <>
                <FaSpinner className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <FaPlus /> Add Event
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default AddEventModal
