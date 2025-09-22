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
import DesignReports from './Design';


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
    // <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6 w-full">
    //   <h1 className="text-3xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
    //     Reports Management
    //   </h1>

    //   {/* Stats */}
    //   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    //     <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
    //       <p className="text-sm text-gray-500">Total Reports</p>
    //       <p className="text-2xl font-bold">{reports.length}</p>
    //     </div>
    //     <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
    //       <p className="text-sm text-gray-500">Posts</p>
    //       <p className="text-2xl font-bold">{postsReports.length}</p>
    //     </div>
    //     <div className="p-4 bg-white dark:bg-darkMode-card rounded-xl shadow">
    //       <p className="text-sm text-gray-500">Users</p>
    //       <p className="text-2xl font-bold">{usersReports.length}</p>
    //     </div>
    //   </div>

    //   {/* Tabs */}
    //   <div className="flex gap-3 mb-6">
    //     {['post', 'comment', 'user'].map((tab) => (
    //       <button
    //         key={tab}
    //         onClick={() => setActiveTab(tab)}
    //         className={`px-4 py-2 rounded-lg font-medium ${
    //           activeTab === tab
    //             ? 'bg-blue-600 text-white'
    //             : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    //         }`}
    //       >
    //         {tab.charAt(0).toUpperCase() + tab.slice(1)} Reports
    //       </button>
    //     ))}
    //   </div>

    //   {/* Reports Table */}
    //   {loading ? (
    //     <p>Loading...</p>
    //   ) : activeTab === 'post' ? (
    //     <ReportsTable reports={postsReports} type="post" openModal={openModal} />
    //   ) : activeTab === 'comment' ? (
    //     <ReportsTable
    //       reports={commentsReports}
    //       type="comment"
    //       openModal={openModal}
    //     />
    //   ) : (
    //     <ReportsTable
    //       reports={usersReports}
    //       type="user"
    //       openModal={openModal}
    //     />
    //   )}

    //   {/* Confirm Modal */}
    //   <ConfirmModal
    //     open={modal.open}
    //     onClose={() => setModal({ open: false, action: null, id: null })}
    //     onConfirm={handleAction}
    //     title="Are you sure?"
    //     message="This action cannot be undone."
    //   />
    // </div>
    <DesignReports
      reports={reports}
      postsReports={postsReports}
      commentsReports={commentsReports}
      usersReports={usersReports}
      loading={loading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      modal={modal}
      openModal={openModal}
      handleAction={handleAction}
      closeModal={() => setModal({ open: false, action: null, report: null })}
    />
  );
};

export default AdminReportsPage;
