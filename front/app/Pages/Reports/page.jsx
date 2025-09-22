'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { useAuth } from '../../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FiTrash2,
  FiUserX,
  FiSlash,
  FiAlertCircle,
  FiMoreVertical,
} from 'react-icons/fi';
import Image from 'next/image';
import { usePost } from '@/app/Context/PostContext';
import { useComment } from '@/app/Context/CommentContext';

// ================== Status Badge ==================
const StatusBadge = ({ status }) => {
  const colors = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
    resolved:
      'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    rejected:
      'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        colors[status] || colors.rejected
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ================== Dropdown Actions ==================
const DropdownActions = ({ type, onDeleteReport, onDeleteTarget, onSuspend, onBan, onResolve }) => {
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
                <FiTrash2 /> Delete Report
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
                  <FiAlertCircle /> Delete {type === 'post' ? 'Post' : 'Comment'}
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
                    <FiSlash /> Suspend User
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onBan();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUserX /> Ban User
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
          <h2 className="text-lg font-bold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
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

// ================== Table View ==================
const ReportsTable = ({ reports, type, openModal }) => (
  <div className="w-full">
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        <tr>
          <th className="px-4 py-2">Reporter</th>
          <th className="px-4 py-2">Target</th>
          <th className="px-4 py-2">Reason</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr
            key={report._id}
            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {/* Reporter */}
            <td className="px-4 py-2 flex items-center gap-2">
              <Image
                src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                alt="Reporter"
                width={30}
                height={30}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{report.owner?.username}</p>
                <p className="text-xs text-gray-500">
                  {report.owner?.profileName}
                </p>
              </div>
            </td>

            {/* Target */}
            <td className="px-4 py-2">
              {type === 'user' && (
                <span>{report.reportedUserId?.username}</span>
              )}
              {type === 'post' && (
                <span>{report.postId?.text?.slice(0, 30) || 'Post'}</span>
              )}
              {type === 'comment' && (
                <span>{report.commentId?.text?.slice(0, 30) || 'Comment'}</span>
              )}
            </td>

            {/* Reason */}
            <td className="px-4 py-2">{report.reason}</td>

            {/* Status */}
            <td className="px-4 py-2">
              <StatusBadge status={report.status} />
            </td>

            {/* Actions */}
            <td className="px-4 py-2">
              <DropdownActions
                type={type}
                onDeleteReport={() => openModal('deleteReport', report)}
                onDeleteTarget={() => openModal('deleteTarget', report)}
                onSuspend={() => openModal('suspendUser', report)}
                onBan={() => openModal('banUser', report)}
                onResolve={() => openModal('resolve', report)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ================== Main Page ==================
const AdminReportsPage = () => {
  const { reports, loading, getAllReports, deleteReport } = useReport();
  const { user, deleteUser, updateAccountStatus } = useAuth();
  // updateAccountStatus => to make acccount baned or susbended 
  const { deletePost } = usePost()
  const {deleteComment} = useComment()
  const [activeTab, setActiveTab] = useState('post');
  const [modal, setModal] = useState({ open: false, action: null, report: null });

  const openModal = (action, report) => setModal({ open: true, action, report });
  useEffect(() => {
    getAllReports();
  }, []);

  // const openModal = (action, id) => setModal({ open: true, action, id });

  const handleAction = async () => {
    if (!modal.report) return;

    const { _id, reportedOnType, postId, commentId, reportedUserId } = modal.report;

    try {
      switch (modal.action) {
        case 'deleteReport':
          await deleteReport(_id);
          toast.success('✅ Report deleted');
          break;

        case 'deleteTarget':
          if (reportedOnType === 'post' && postId?._id) {
            await deletePost(postId._id);
            toast.success('🗑️ Post deleted');
          }
          if (reportedOnType === 'comment' && commentId?._id) {
            await deleteComment(commentId._id);
            toast.success('🗑️ Comment deleted');
          }
          break;

        case 'suspendUser':
          if (reportedOnType === 'user' && reportedUserId?._id) {
            await updateAccountStatus(reportedUserId._id, 'suspended');
            toast.success('⏸️ User suspended');
          }
          break;

        case 'banUser':
          if (reportedOnType === 'user' && reportedUserId?._id) {
            await updateAccountStatus(reportedUserId._id, 'banned');
            toast.success('⛔ User banned');
          }
          break;

        case 'resolve':
          // هنا تقدر تستدعي updateReportStatus من useReport لو حابب
          // await updateReportStatus(_id, "resolved");
          toast.success('✅ Report resolved');
          break;

        default:
          toast.error('❌ Unknown action');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to complete action');
    } finally {
      getAllReports(); // refresh reports
    }
  };


  const usersReports = reports.filter((r) => r.reportedOnType === 'user');
  const postsReports = reports.filter((r) => r.reportedOnType === 'post');
  const commentsReports = reports.filter((r) => r.reportedOnType === 'comment');

  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
        Reports Management
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-2xl font-bold">{reports.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Posts</p>
          <p className="text-2xl font-bold">{postsReports.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-bold">{usersReports.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {['post', 'comment', 'user'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Reports
          </button>
        ))}
      </div>

      {/* Reports Table */}
      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'post' ? (
        <ReportsTable reports={postsReports} type="post" openModal={openModal} />
      ) : activeTab === 'comment' ? (
        <ReportsTable
          reports={commentsReports}
          type="comment"
          openModal={openModal}
        />
      ) : (
        <ReportsTable
          reports={usersReports}
          type="user"
          openModal={openModal}
        />
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
