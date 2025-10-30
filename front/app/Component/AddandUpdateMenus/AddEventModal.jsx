'use client'
import React from 'react'
import { FaPlus, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const AddEventModal = ({
  newEvent,
  setNewEvent,
  setSelectedDate,
  handleAddEvent,
  selectedDate,
  isCreating
}) => {
  const {t} = useTranslation()
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-lightMode-bg dark:bg-darkMode-bg border border-lightMode-menu/20 dark:border-darkMode-menu/20
                  rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors duration-300"
      >
        <h3 className="text-xl font-semibold mb-5 text-center text-lightMode-text dark:text-darkMode-text">
          {t("Add Event on")} {selectedDate.format("DD MMM YYYY")}
        </h3>

        {/* Title Input */}
        <input
          type="text"
          placeholder="🎯 Event Title"
          className="w-full border border-lightMode-menu/30 dark:border-darkMode-menu/30
                     focus:border-lightMode-text dark:focus:border-darkMode-text focus:ring-2
                     focus:ring-lightMode-text/40 dark:focus:ring-darkMode-text/40
                     p-3 rounded-lg mb-4 bg-lightMode-menu dark:bg-darkMode-menu
                     text-lightMode-fg dark:text-darkMode-fg placeholder-gray-400
                     outline-none transition-all"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        {/* Description */}
        <textarea
          placeholder="📝 Description"
          className="w-full border border-lightMode-menu/30 dark:border-darkMode-menu/30
                     focus:border-lightMode-text dark:focus:border-darkMode-text focus:ring-2
                     focus:ring-lightMode-text/40 dark:focus:ring-darkMode-text/40
                     p-3 rounded-lg mb-4 bg-lightMode-menu dark:bg-darkMode-menu
                     text-lightMode-fg dark:text-darkMode-fg placeholder-gray-400
                     outline-none resize-none min-h-[80px] transition-all"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />

        {/* Type */}
        <select
          className="w-full border border-lightMode-menu/30 dark:border-darkMode-menu/30
                     focus:border-lightMode-text dark:focus:border-darkMode-text focus:ring-2
                     focus:ring-lightMode-text/40 dark:focus:ring-darkMode-text/40
                     p-3 rounded-lg mb-4 bg-lightMode-menu dark:bg-darkMode-menu
                     text-lightMode-fg dark:text-darkMode-fg transition-all"
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        >
          <option value="birthday">🎂 {t("Birthday")}</option>
          <option value="meeting">👥 {t("Meeting")}</option>
          <option value="public">📅 {t("Public")}</option>
          <option value="custom">⭐ {t("Custom")}</option>
        </select>

        {/* Repeat yearly */}
        <div className="flex items-center mb-5 gap-2">
          <input
            type="checkbox"
            checked={newEvent.repeatYearly}
            onChange={(e) => setNewEvent({ ...newEvent, repeatYearly: e.target.checked })}
            id="repeatYearly"
            className="accent-lightMode-text dark:accent-darkMode-text w-4 h-4"
          />
          <label htmlFor="repeatYearly" className="text-sm text-lightMode-text2 dark:text-darkMode-text2">
            {t("Repeat every year")}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-lightMode-menu dark:bg-darkMode-menu
                       hover:bg-lightMode-text/10 dark:hover:bg-darkMode-text/10
                       text-lightMode-fg dark:text-darkMode-fg transition font-medium"
            onClick={() => setSelectedDate(null)}
            disabled={isCreating}
          >
            {t("Cancel")}
          </button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isCreating || !newEvent.title}
            onClick={handleAddEvent}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 font-semibold text-white
              ${isCreating
                ? "bg-lightMode-text dark:bg-darkMode-text cursor-wait opacity-80"
                : "bg-lightMode-text dark:bg-darkMode-text hover:opacity-90 transition"
              } disabled:opacity-60`}
          >
            {isCreating ? (
              <>
                <FaSpinner className="animate-spin" /> {t("Creating")}...
              </>
            ) : (
              <>
                <FaPlus /> {t("Add Event")}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default AddEventModal
