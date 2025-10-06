'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots, FaRegEdit } from 'react-icons/fa';
import { IoIosHeart, IoIosSend } from 'react-icons/io';
import { MdOutlineContentCopy, MdOutlineDelete, MdOutlineReport } from 'react-icons/md';
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';
import { useReport } from '@/app/Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const { likeComment, deleteComment, AddComment, updateComment } = useComment();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { user } = useAuth();

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      await AddComment(replyText, comment.postId, comment.owner._id, comment._id);
      setReplyText('');
      setIsReplying(false);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    setLoadingEdit(true);
    try {
      await updateComment(comment._id, editText);
      setIsEditing(false);
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full break-words">
      <div className="flex items-start gap-3 w-full">
        <Image
          src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ring-2 ring-blue-400"
        />

        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="text-sm text-gray-700 dark:text-gray-300 break-words">
                <span className="font-semibold text-black dark:text-white">{comment.owner.username}</span>
                <span className="ml-2 text-xs text-gray-500">{comment.owner.profileName}</span>
                <span className="ml-2 text-xs text-gray-400">· {new Date(comment.createdAt).toLocaleDateString()}</span>
                {comment?.isEdited && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-2 inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full"
                  >
                    <MdOutlineContentCopy className="w-3 h-3" />
                    Edited
                  </motion.span>
                )}
              </div>

              {/* Action Buttons */}
              {user?._id === comment?.owner?._id && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  {!isEditing && (
                    <FaRegEdit
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 text-lg cursor-pointer hover:scale-110 transition"
                    />
                  )}
                  <MdOutlineDelete
                    onClick={() => deleteComment(comment._id, comment.postId)}
                    className="text-red-500 text-lg cursor-pointer hover:scale-110 transition"
                  />
                  <MdOutlineReport
                    onClick={() => {
                      setIsTargetId(comment._id);
                      setReportedOnType('comment');
                      setShowMenuReport(true);
                    }}
                    className="text-orange-500 text-lg cursor-pointer hover:scale-110 transition"
                  />
                </div>
              )}
            </div>

            {/* Text / Edit Mode */}
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  dir={/[\u0600-\u06FF]/.test(editText) ? 'rtl' : 'ltr'}
                  className="w-full bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateComment}
                    disabled={loadingEdit}
                    className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium shadow ${
                      loadingEdit ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {loadingEdit ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.text);
                    }}
                    className="px-4 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              comment.text && (
                <p
                  dir={/[\u0600-\u06FF]/.test(comment.text) ? 'rtl' : 'ltr'}
                  className="mt-2 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words"
                >
                  {comment.text}
                </p>
              )
            )}
          </div>

          {/* Like / Reply */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 ml-1 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            <div
              onClick={() => likeComment(comment._id, comment.postId)}
              className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"
            >
              {comment?.likes?.includes(user._id) ? (
                <IoIosHeart className="text-red-500 text-lg sm:text-xl" />
              ) : (
                <CiHeart className="text-lg sm:text-xl" />
              )}
              <span>{comment?.likes?.length}</span>
            </div>

            <div
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition"
            >
              <FaRegCommentDots className="text-lg sm:text-xl" />
              <span>{comment.replies?.length || 0}</span>
            </div>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full"
              >
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  dir={/[\u0600-\u06FF]/.test(replyText) ? 'rtl' : 'ltr'}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IoIosSend
                  onClick={handleSendReply}
                  className={`text-blue-500 text-2xl cursor-pointer transition ${
                    loadingReply ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-4 border-l-2 border-gray-300 dark:border-gray-700 pl-3 sm:pl-5 flex flex-col gap-3 overflow-hidden">
              {comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
