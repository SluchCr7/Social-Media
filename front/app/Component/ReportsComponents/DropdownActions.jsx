'use client'
import React, { useState, memo, useCallback, useMemo } from 'react'
import { FiAlertCircle, FiMoreVertical, FiSlash, FiTrash2, FiUserX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DropdownActions = ({
  type,
  onDeleteReport,
  onDeleteTarget,
  onSuspend,
  onBan,
  onResolve
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // تثبيت دوال handlers
  const handleDeleteReport = useCallback(() => {
    setOpen(false);
    onDeleteReport();
  }, [onDeleteReport]);

  const handleDeleteTarget = useCallback(() => {
    setOpen(false);
    onDeleteTarget();
  }, [onDeleteTarget]);

  const handleSuspend = useCallback(() => {
    setOpen(false);
    onSuspend();
  }, [onSuspend]);

  const handleBan = useCallback(() => {
    setOpen(false);
    onBan();
  }, [onBan]);

  const handleResolve = useCallback(() => {
    setOpen(false);
    onResolve();
  }, [onResolve]);

  // حفظ نصوص الترجمة
  const deleteReportText = t("Delete Report");
  const deletePostText = t("Delete") + ' Post';
  const deleteCommentText = t("Delete") + ' Comment';
  const suspendText = t("Suspend User");
  const banText = t("Ban User");
  const resolveText = t("Mark as Resolved");

  // إنشاء قائمة الأزرار باستخدام useMemo
  const actionButtons = useMemo(() => {
    const buttons = [];

    buttons.push(
      <button
        key="deleteReport"
        onClick={handleDeleteReport}
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FiTrash2 /> {deleteReportText}
      </button>
    );

    if (type === 'post' || type === 'comment') {
      buttons.push(
        <button
          key="deleteTarget"
          onClick={handleDeleteTarget}
          className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiAlertCircle /> {type === 'post' ? deletePostText : deleteCommentText}
        </button>
      );
    }

    if (type === 'user') {
      buttons.push(
        <button
          key="suspend"
          onClick={handleSuspend}
          className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiSlash /> {suspendText}
        </button>,
        <button
          key="ban"
          onClick={handleBan}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiUserX /> {banText}
        </button>
      );
    }

    buttons.push(
      <button
        key="resolve"
        onClick={handleResolve}
        className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ✅ {resolveText}
      </button>
    );

    return buttons;
  }, [
    type,
    handleDeleteReport,
    handleDeleteTarget,
    handleSuspend,
    handleBan,
    handleResolve,
    deleteReportText,
    deletePostText,
    deleteCommentText,
    suspendText,
    banText,
    resolveText
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
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
              {actionButtons}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// استخدام memo لتحسين الأداء
export default memo(DropdownActions);
