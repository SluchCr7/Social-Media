'use client';
import Image from 'next/image';
import React, { useState, useCallback, useMemo } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots, FaRegEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosHeart, IoIosSend } from 'react-icons/io';
import { MdOutlineContentCopy, MdOutlineDelete, MdOutlineReport } from 'react-icons/md';
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';
import { useReport } from '@/app/Context/ReportContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBadgeCheck } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt';
import CommentSkeleton from '../Skeletons/CommentSkeleton';

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // New States for Lazy Replies
  const [expanded, setExpanded] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const { t } = useTranslation();
  const {
    likeComment,
    deleteComment,
    AddComment,
    updateComment,
    fetchCommentReplies
  } = useComment();
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { user } = useAuth();

  // --- Handlers ---

  const handleToggleExpand = useCallback(async () => {
    if (!expanded && (!comment.replies || comment.replies.length === 0) && comment.replyCount > 0) {
      setLoadingReplies(true);
      await fetchCommentReplies(comment._id);
      setLoadingReplies(false);
    }
    setExpanded(!expanded);
  }, [expanded, comment._id, comment.replies, comment.replyCount, fetchCommentReplies]);

  const handleLoadMoreReplies = useCallback(async () => {
    setLoadingReplies(true);
    await fetchCommentReplies(comment._id, comment.replyCursor);
    setLoadingReplies(false);
  }, [comment._id, comment.replyCursor, fetchCommentReplies]);

  const handleSendReply = useCallback(async () => {
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      await AddComment(replyText, comment._id, 'Comment');
      setReplyText('');
      setIsReplying(false);
      setExpanded(true); // Open replies to show the new one
    } finally {
      setLoadingReply(false);
    }
  }, [replyText, comment._id, AddComment]);

  const handleUpdateComment = useCallback(async () => {
    if (!editText.trim()) return;
    setLoadingEdit(true);
    try {
      await updateComment(comment._id, editText);
      setIsEditing(false);
    } finally {
      setLoadingEdit(false);
    }
  }, [editText, comment._id, updateComment]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col w-full group"
    >
      <div className="flex items-start gap-4 w-full">
        {/* Avatar Area */}
        <div className="flex flex-col items-center flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
              alt="avatar"
              width={44}
              height={44}
              className="relative rounded-2xl object-cover w-10 h-10 sm:w-11 sm:h-11 border-2 border-white/10 dark:border-white/5 shadow-sm"
            />
          </motion.div>
          {/* Thread Line */}
          {expanded && comment.replyCount > 0 && (
            <div className="w-[2px] grow mt-2 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment Bubble */}
          <div className="relative overflow-hidden rounded-[1.5rem] bg-white/[0.03] dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
            <div className="p-4 sm:px-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-black text-sm uppercase tracking-wider text-white truncate">
                    {comment.owner.username}
                  </span>
                  {comment.owner.isAccountWithPremiumVerify && (
                    <HiBadgeCheck className="text-blue-500 text-lg flex-shrink-0" />
                  )}
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    · {formatRelativeTime(comment?.createdAt)}
                  </span>
                  {comment?.isEdited && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
                      {t('Edited')}
                    </span>
                  )}
                </div>

                {/* Actions Popover (Visible on hover) */}
                <div className="flex items-center gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-all">
                  {user?._id === comment?.owner?._id ? (
                    <>
                      <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <FaRegEdit size={14} />
                      </button>
                      <button onClick={() => deleteComment(comment._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                        <MdOutlineDelete size={14} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { setIsTargetId(comment._id); setReportedOnType('comment'); setShowMenuReport(true); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <MdOutlineReport size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    dir={/[\u0600-\u06FF]/.test(editText) ? 'rtl' : 'ltr'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none h-24 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase text-gray-500 hover:text-white p-2">{t('Cancel')}</button>
                    <button onClick={handleUpdateComment} disabled={loadingEdit} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase py-2 px-6 rounded-xl transition-all disabled:opacity-50">
                      {loadingEdit ? t('Saving...') : t('Update')}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed break-words" dir={/[\u0600-\u06FF]/.test(comment.text) ? 'rtl' : 'ltr'}>
                  {comment.text}
                </p>
              )}
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center gap-6 mt-3 ml-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => likeComment(comment._id)}
              className="flex items-center gap-2 text-xs font-bold uppercase group/like"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center group-hover/like:bg-red-500/10 transition-colors">
                {comment?.likes?.includes(user?._id) ? (
                  <IoIosHeart className="text-red-500 text-lg" />
                ) : (
                  <CiHeart className="text-gray-500 text-xl group-hover/like:text-red-500" />
                )}
              </div>
              <span className={comment?.likes?.includes(user?._id) ? "text-red-500" : "text-gray-500"}>
                {comment?.likes?.length || 0}
              </span>
            </motion.button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 hover:text-blue-400 group/reply"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center group-hover/reply:bg-blue-500/10 transition-colors">
                <FaRegCommentDots className="text-base" />
              </div>
              {t('Reply')}
            </button>

            {comment.replyCount > 0 && (
              <button
                onClick={handleToggleExpand}
                className="flex items-center gap-2 text-xs font-bold uppercase text-blue-500 hover:text-blue-400"
              >
                {expanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                {expanded ? t('Hide Replies') : `${t('Show')} ${comment.replyCount} ${t('Replies')}`}
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t('Add a reply...')}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendReply}
                    disabled={loadingReply || !replyText.trim()}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 shadow-lg shadow-blue-600/20"
                  >
                    <IoIosSend size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lazy Replies Container */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 space-y-6"
              >
                <div className="space-y-6">
                  {comment.replies?.map((reply) => (
                    <Comment key={reply._id} comment={reply} />
                  ))}

                  {loadingReplies && (
                    <div className="space-y-4">
                      <CommentSkeleton />
                    </div>
                  )}

                  {comment.hasMoreReplies && !loadingReplies && (
                    <button
                      onClick={handleLoadMoreReplies}
                      className="text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 py-2 ml-12"
                    >
                      {t('Load more replies')}...
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Comment);
