'use client';
import React, { useEffect, useState } from 'react';
import { useReport } from '../../Context/ReportContext';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FiMoreVertical, FiTrash2, FiUserX, FiSlash, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// ================== Dropdown Actions ==================
const DropdownActions = ({ onDeleteReport, onDeletePost, onSuspend, onBan, onResolve }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
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
            className="absolute right-0 mt-2 w-52 bg-white dark:bg-darkMode-card rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col">
              <button onClick={() => { setOpen(false); onDeleteReport(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiTrash2 /> Delete Report
              </button>
              <button onClick={() => { setOpen(false); onDeletePost(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiAlertCircle /> Delete Post
              </button>
              <button onClick={() => { setOpen(false); onSuspend(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiSlash /> Suspend User
              </button>
              <button onClick={() => { setOpen(false); onBan(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiUserX /> Ban User
              </button>
              <button onClick={() => { setOpen(false); onResolve(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                ✅ Mark as Resolved
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ================== Confirm Modal ==================
const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => (
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
          <h2 className="text-lg font-bold mb-2 text-lightMode-text2 dark:text-darkMode-text2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ================== Main Page ==================
const AdminReportsPage = () => {
  const { reports, loading, getAllReports, deleteReport, currentPage, limit, totalReports } = useReport();
  const { user } = useAuth();
  const [modal, setModal] = useState({ open: false, action: null, id: null });

  useEffect(() => {
    getAllReports(currentPage, limit);
  }, [currentPage, limit]);

  const handleAction = async () => {
    switch (modal.action) {
      case "deleteReport":
        await deleteReport(modal.id);
        toast.success("Report deleted");
        break;
      case "deletePost":
        toast.info("Delete post functionality here");
        break;
      case "suspendUser":
        toast.info("Suspend user functionality here");
        break;
      case "banUser":
        toast.info("Ban user functionality here");
        break;
      case "resolve":
        toast.success("Report marked as resolved");
        break;
      default:
        break;
    }
    getAllReports(currentPage, limit);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">Loading reports...</div>;

  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
        Admin Panel - Reports
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-2xl font-bold">{totalReports}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold text-red-600">{reports.filter(r => !r.resolved).length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.resolved).length}</p>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white dark:bg-darkMode-card rounded-2xl shadow p-4 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Image
                    src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                    alt="Reporter"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{report.owner?.username}</p>
                    <p className="text-xs text-gray-500">{report.owner?.profileName}</p>
                  </div>
                </div>
                <DropdownActions
                  onDeleteReport={() => setModal({ open: true, action: "deleteReport", id: report._id })}
                  onDeletePost={() => setModal({ open: true, action: "deletePost", id: report.postId?._id })}
                  onSuspend={() => setModal({ open: true, action: "suspendUser", id: report.postId?.owner?._id })}
                  onBan={() => setModal({ open: true, action: "banUser", id: report.postId?.owner?._id })}
                  onResolve={() => setModal({ open: true, action: "resolve", id: report._id })}
                />
              </div>

              <p className="mt-3 text-gray-700 dark:text-gray-300">{report.text}</p>

              <div className="mt-3">
                {report.postId && (
                  <div className="p-2 border rounded-lg dark:border-gray-700">
                    <p className="text-sm font-medium">Post by {report.postId.owner?.username}</p>
                    <p className="text-xs text-gray-500">{report.postId?.text || 'No text content'}</p>
                    {report.postId?.Photos?.length > 0 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {report.postId.Photos.map((photo, idx) => (
                          <Image key={idx} src={photo} alt="Post Photo" width={60} height={60} className="rounded-md object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalReports > limit && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => getAllReports(currentPage - 1, limit)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">{currentPage}</span>
          <button
            disabled={currentPage === Math.ceil(totalReports / limit)}
            onClick={() => getAllReports(currentPage + 1, limit)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, action: null, id: null })}
        onConfirm={handleAction}
        title="Are you sure?"
        message="This action cannot be undone."
      />
    </div>
  );
};

export default AdminReportsPage;
