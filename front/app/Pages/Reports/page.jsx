'use client';
import React, { useEffect, useState } from 'react';
import { useReport } from '../../Context/ReportContext';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FiMoreVertical, FiTrash2, FiUserX, FiSlash, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';


// ✅ Dropdown Actions Component
const DropdownActions = ({ onDeleteReport, onDeletePost, onSuspend, onBan, onResolve }) => {
  const [open, setOpen] = useState(false);

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
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkMode-card rounded-xl shadow-lg overflow-hidden z-50"
          >
            <button
              onClick={() => { setOpen(false); onDeleteReport(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiTrash2 /> Delete Report
            </button>
            <button
              onClick={() => { setOpen(false); onDeletePost(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiAlertCircle /> Delete Post
            </button>
            <button
              onClick={() => { setOpen(false); onSuspend(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiSlash /> Suspend User
            </button>
            <button
              onClick={() => { setOpen(false); onBan(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUserX /> Ban User
            </button>
            <button
              onClick={() => { setOpen(false); onResolve(); }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✅ Mark as Resolved
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ✅ Confirm Modal Component
const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
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
};


// ✅ Main Page
const AdminReportsPage = () => {
  const { reports, loading, getAllReports, deleteReport } = useReport();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [modal, setModal] = useState({ open: false, action: null, id: null });

  const fetchReports = async (p = 1) => {
    try {
      const res = await getAllReports(p, limit);
      setTotalPages(Math.ceil(res.total / limit));
      setPage(res.page);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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
    fetchReports(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400 w-full">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
        Admin Panel - Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reports available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-darkMode-card rounded-2xl shadow-md">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="py-3 px-4 text-left rounded-tl-2xl">Reporter</th>
                <th className="py-3 px-4 text-left">Report Text</th>
                <th className="py-3 px-4 text-left">Post Owner</th>
                <th className="py-3 px-4 text-left">Post Content</th>
                <th className="py-3 px-4 text-center rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  
                  {/* Reporter */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Image
                      src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                      alt={report.owner?.username || 'User'}
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-lightMode-text2 dark:text-lightMode-text2">{report.owner?.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.owner?.profileName}</p>
                    </div>
                  </td>

                  {/* Report Text */}
                  <td className="py-3 px-4">{report.text}</td>

                  {/* Post Owner */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    {report.postId?.owner && (
                      <>
                        <Image
                          src={report.postId.owner?.profilePhoto?.url || '/default-profile.png'}
                          alt={report.postId.owner?.username || 'User'}
                          width={30}
                          height={30}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-lightMode-text2 dark:text-lightMode-text2">{report.postId.owner?.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{report.postId.owner?.profileName}</p>
                        </div>
                      </>
                    )}
                  </td>

                  {/* Post Content */}
                  <td className="py-3 px-4">
                    {report.postId?.text || 'No text content'}
                    {report.postId?.Photos?.length > 0 && (
                      <div className="flex gap-2 mt-1 overflow-x-auto">
                        {report.postId.Photos.map((photo, idx) => (
                          <Image
                            key={idx}
                            src={photo}
                            alt="Post Photo"
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 flex justify-center">
                    <DropdownActions
                      onDeleteReport={() => setModal({ open: true, action: "deleteReport", id: report._id })}
                      onDeletePost={() => setModal({ open: true, action: "deletePost", id: report.postId?._id })}
                      onSuspend={() => setModal({ open: true, action: "suspendUser", id: report.postId?.owner?._id })}
                      onBan={() => setModal({ open: true, action: "banUser", id: report.postId?.owner?._id })}
                      onResolve={() => setModal({ open: true, action: "resolve", id: report._id })}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => fetchReports(page - 1)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">{page}</span>
          <button
            disabled={page === totalPages}
            onClick={() => fetchReports(page + 1)}
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
