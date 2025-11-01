'use client';
import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ConfirmModal = memo(({ open, onClose, onConfirm, title, message }) => {
  const {t} = useTranslation()
  return (    
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-darkMode-card rounded-2xl shadow-xl p-6 w-[90%] max-w-md"
          >
            <h2 className="text-lg font-bold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
              >
                {t("Confirm")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})


export default ConfirmModal