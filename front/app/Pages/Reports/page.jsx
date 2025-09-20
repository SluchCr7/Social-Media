'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FiMoreVertical, FiTrash2, FiUserX, FiSlash, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// ================== Status Badge ==================
const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.rejected}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

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

// ================== Skeleton Card ==================
const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-darkMode-card rounded-2xl p-4 shadow h-48">
    <div className="flex gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
    <div className="flex gap-2">
      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

// ================== Report Card ==================
const ReportCard = ({ report, openModal }) => (
  <div className="bg-white dark:bg-darkMode-card rounded-2xl shadow p-4 relative border-l-4 border-yellow-400">
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
        onDeleteReport={() => openModal("deleteReport", report._id)}
        onDeletePost={() => openModal("deletePost", report.postId?._id)}
        onSuspend={() => openModal("suspendUser", report.postId?.owner?._id)}
        onBan={() => openModal("banUser", report.postId?.owner?._id)}
        onResolve={() => openModal("resolve", report._id)}
      />
    </div>
    <div className="mt-3 flex justify-between items-center">
      <p className="text-gray-700 dark:text-gray-300 flex-1">{report.text}</p>
      <StatusBadge status={report.status} />
    </div>
    {report.postId && (
      <div className="mt-3 p-2 border rounded-lg dark:border-gray-700">
        <p className="text-sm font-medium">Post by {report.postId.owner?.username}</p>
        <p className="text-xs text-gray-500">{report.postId?.text || 'No text content'}</p>
        {report.postId?.Photos?.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {report.postId.Photos.map((photo, idx) => (
              <Image key={idx} src={photo} alt="Post Photo" width={60} height={60} className="rounded-md object-cover" loading="lazy"/>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

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
  const [filter, setFilter] = useState({ search: '', status: 'all', reason: 'all' });

  useEffect(() => {
    getAllReports(currentPage, limit);
  }, [currentPage, limit]);

  const openModal = (action, id) => setModal({ open: true, action, id });

  const handleAction = async () => {
    switch (modal.action) {
      case "deleteReport": await deleteReport(modal.id); toast.success("Report deleted"); break;
      case "deletePost": toast.info("Delete post functionality here"); break;
      case "suspendUser": toast.info("Suspend user functionality here"); break;
      case "banUser": toast.info("Ban user functionality here"); break;
      case "resolve": toast.success("Report marked as resolved"); break;
    }
    getAllReports(currentPage, limit);
  };

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = r.text.toLowerCase().includes(filter.search.toLowerCase());
      const matchesStatus = filter.status === 'all' || r.status === filter.status;
      const matchesReason = filter.reason === 'all' || r.reason === filter.reason;
      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [reports, filter]);

  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6">
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">Admin Panel - Reports</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search reports..."
          value={filter.search}
          onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
          className="p-2 rounded-lg border dark:border-gray-700 flex-1"
        />
        <select value={filter.status} onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
          className="p-2 rounded-lg border dark:border-gray-700">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filter.reason} onChange={(e) => setFilter(f => ({ ...f, reason: e.target.value }))}
          className="p-2 rounded-lg border dark:border-gray-700">
          <option value="all">All Reasons</option>
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
          <option value="violence">Violence</option>
          <option value="nudity">Nudity</option>
          <option value="hate">Hate</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-2xl font-bold">{totalReports}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
        </div>
      ) : filteredReports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <ReportCard key={report._id} report={report} openModal={openModal} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalReports > limit && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => getAllReports(1, limit)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            First
          </button>
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
          <button
            disabled={currentPage === Math.ceil(totalReports / limit)}
            onClick={() => getAllReports(Math.ceil(totalReports / limit), limit)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Last
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
