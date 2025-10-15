'use client'
import React, { useState } from 'react'
import { FiAlertCircle, FiMoreVertical, FiSlash, FiTrash2, FiUserX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DropdownActions = ({ type, onDeleteReport, onDeleteTarget, onSuspend, onBan, onResolve }) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation()
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <FiMoreVertical size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-white dark:bg-darkMode-card rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-[9999]"
          >
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setOpen(false);
                  onDeleteReport();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiTrash2 /> {t("Delete Report")}
              </button>

              {/* Post / Comment delete */}
              {(type === 'post' || type === 'comment') && (
                <button
                  onClick={() => {
                    setOpen(false);
                    onDeleteTarget();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiAlertCircle /> {t("Delete")} {type === 'post' ? 'Post' : 'Comment'}
                </button>
              )}

              {/* User actions */}
              {type === 'user' && (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onSuspend();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSlash /> {t("Suspend User")}
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onBan();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUserX /> {t("Ban User")}
                  </button>
                </>
              )}

              {/* Common */}
              <button
                onClick={() => {
                  setOpen(false);
                  onResolve();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✅ {t("Mark as Resolved")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownActions