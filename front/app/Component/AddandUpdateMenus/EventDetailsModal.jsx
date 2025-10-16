'use client'
import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

const EventDetailsModal = ({
  handleUpdateEvent,
  handleDeleteEvent,
  selectedEvent,
  setSelectedEvent
}) => {
  const {t} = useTranslation()
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-lightMode-bg dark:bg-darkMode-bg border border-lightMode-menu dark:border-darkMode-menu
                   rounded-2xl p-6 w-full max-w-md shadow-xl backdrop-blur-xl transition-colors duration-300"
      >
        {/* العنوان */}
        <h3 className="text-xl font-semibold mb-4 text-lightMode-text dark:text-darkMode-text">
          {t("Event Details")}
        </h3>

        {/* عنوان الحدث */}
        <input
          type="text"
          className="w-full border border-lightMode-menu dark:border-darkMode-menu p-3 rounded-xl
                     bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          value={selectedEvent.title}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
        />

        {/* الوصف */}
        <textarea
          className="w-full border border-lightMode-menu dark:border-darkMode-menu p-3 rounded-xl
                     bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
          rows={3}
          value={selectedEvent.description}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
        />

        {/* النوع */}
        <select
          className="w-full border border-lightMode-menu dark:border-darkMode-menu p-3 rounded-xl
                     bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          value={selectedEvent.type}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, type: e.target.value })}
        >
          <option value="birthday">🎂 {t("Birthday")}</option>
          <option value="meeting">👥 {t("Meeting")}</option>
          <option value="public">📅 {t("Public")}</option>
          <option value="custom">⭐ {t("Custom")}</option>
        </select>

        {/* التكرار */}
        <div className="flex items-center mb-3 gap-2">
          <input
            type="checkbox"
            checked={selectedEvent.repeatYearly || false}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, repeatYearly: e.target.checked })}
            id="repeatYearlyEdit"
            className="accent-blue-500 w-4 h-4"
          />
          <label
            htmlFor="repeatYearlyEdit"
            className="text-sm text-lightMode-text2 dark:text-darkMode-text2 select-none"
          >
            {t("Repeat every year")}
          </label>
        </div>

        {/* التاريخ */}
        <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 mb-4">
          {t("Date")}: <span className="font-medium">{dayjs(selectedEvent.date).format("DD MMM YYYY")}</span>
        </p>

        {/* الأزرار */}
        <div className="flex justify-between items-center pt-2 border-t border-lightMode-menu dark:border-darkMode-menu">
          <button
            className="px-4 py-2 rounded-full bg-lightMode-menu dark:bg-darkMode-menu
                       text-lightMode-text2 dark:text-darkMode-text2 hover:bg-lightMode-bg dark:hover:bg-darkMode-bg
                       transition-all duration-300"
            onClick={() => setSelectedEvent(null)}
          >
            {t("Close")}
          </button>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white
                         hover:scale-105 flex items-center gap-2 transition-all shadow"
              onClick={handleUpdateEvent}
            >
              <FaEdit /> {t("Save")}
            </button>

            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white
                         hover:scale-105 flex items-center gap-2 transition-all shadow"
              onClick={handleDeleteEvent}
            >
              <FaTrash /> {t("Delete")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EventDetailsModal
