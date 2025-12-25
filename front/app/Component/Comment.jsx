'use client';
import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots, FaRegEdit } from 'react-icons/fa';
import { IoIosHeart, IoIosSend } from 'react-icons/io';
import { MdOutlineContentCopy, MdOutlineDelete, MdOutlineReport } from 'react-icons/md';
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';
import { useReport } from '@/app/Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBadgeCheck } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt';

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { t } = useTranslation();
  const { likeComment, deleteComment, AddComment, updateComment } = useComment();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { user } = useAuth();

  const handleSendReply = useCallback(async () => {
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      await AddComment(replyText, comment.postId, comment.owner._id, comment._id);
      setReplyText('');
      setIsReplying(false);
    } finally {
      setLoadingReply(false);
    }
  }, [replyText, comment.postId, comment.owner._id, comment._id]);

  const handleUpdateComment = useCallback(async () => {
    if (!editText.trim()) return;
    setLoadingEdit(true);
    try {
      await updateComment(comment._id, editText);
      setIsEditing(false);
    } finally {
      setLoadingEdit(false);
    }
  }, [editText, comment._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full max-w-full break-words group"
    >
      <div className="flex items-start gap-3 w-full">
        {/* Avatar with gradient ring */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
          <Image
            src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
            alt="avatar"
            width={40}
            height={40}
            className="relative rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-white/20 dark:ring-gray-700/50"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Comment Card with Neural Glass Effect */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/40 border border-white/20 dark:border-gray-700/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative px-4 py-3 sm:px-5 sm:py-4">
              {/* Header */}
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="text-sm text-gray-700 dark:text-gray-300 break-words flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {comment.owner.username}
                    </span>
                    {comment.owner.isAccountWithPremiumVerify && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl drop-shadow-lg" title="Verified" />
                      </motion.div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.owner.profileName}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      · {formatRelativeTime(comment?.createdAt)}
                    </span>
                    {comment?.isEdited && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/50"
                      >
                        <MdOutlineContentCopy className="w-3 h-3" />
                        {t('Edited')}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {user?._id === comment?.owner?._id && (
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <FaRegEdit className="text-base" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteComment(comment._id, comment.postId)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <MdOutlineDelete className="text-base" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsTargetId(comment._id);
                        setReportedOnType('comment');
                        setShowMenuReport(true);
                      }}
                      className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 transition-colors"
                    >
                      <MdOutlineReport className="text-base" />
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Text / Edit Mode */}
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 flex flex-col gap-3"
                >
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    dir={/[\u0600-\u06FF]/.test(editText) ? 'rtl' : 'ltr'}
                    className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2.5 rounded-xl outline-none border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm text-black dark:text-white transition-all"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateComment}
                      disabled={loadingEdit}
                      className={`px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-lg transition-all ${loadingEdit
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
                        }`}
                    >
                      {loadingEdit ? t('Saving...') : t('Save')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsEditing(false);
                        setEditText(comment.text);
                      }}
                      className="px-5 py-2 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      {t('Cancel')}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                comment.text && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    dir={/[\u0600-\u06FF]/.test(comment.text) ? 'rtl' : 'ltr'}
                    className="mt-3 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words"
                  >
                    {comment.text}
                  </motion.p>
                )
              )}
            </div>
          </motion.div>

          {/* Like / Reply Actions */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 ml-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => likeComment(comment._id, comment.postId)}
              className="flex items-center gap-1.5 cursor-pointer group/like"
            >
              {comment?.likes?.includes(user._id) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <IoIosHeart className="text-red-500 text-xl sm:text-2xl drop-shadow-lg" />
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 bg-red-500/30 rounded-full"
                  />
                </motion.div>
              ) : (
                <CiHeart className="text-gray-600 dark:text-gray-400 text-xl sm:text-2xl group-hover/like:text-red-500 transition-colors" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {comment?.likes?.length}
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 cursor-pointer group/reply"
            >
              <FaRegCommentDots className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl group-hover/reply:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {comment.replies?.length || 0}
              </span>
            </motion.div>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-3 mt-4 overflow-hidden"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t('Write a reply...')}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    dir={/[\u0600-\u06FF]/.test(replyText) ? 'rtl' : 'ltr'}
                    className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-black dark:text-white px-5 py-3 rounded-full outline-none border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendReply}
                  disabled={loadingReply}
                  className={`p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transition-all ${loadingReply ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/50'
                    }`}
                >
                  <IoIosSend className="text-xl" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 border-l-2 border-gradient-to-b from-blue-500/30 via-purple-500/30 to-pink-500/30 pl-4 sm:pl-6 flex flex-col gap-4 overflow-hidden"
            >
              {comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;
