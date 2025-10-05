'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots, FaRegEdit } from 'react-icons/fa';
import { IoIosHeart, IoIosSend } from 'react-icons/io';
import { MdOutlineContentCopy, MdOutlineDelete } from 'react-icons/md';
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';
import { MdOutlineReport, MdContentCopy } from "react-icons/md";
import { useReport } from '@/app/Context/ReportContext';

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  // تحديث
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { setIsTargetId, setShowMenuReport, setReportedOnType } = useReport();
  const { likeComment, deleteComment, AddComment, updateComment } = useComment();
  const { user } = useAuth();

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      await AddComment(replyText, comment.postId, comment.owner._id, comment._id);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    setLoadingEdit(true);
    try {
      const result = await updateComment(comment._id, editText);
      if (result?.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div id={`comment-${comment._id}`} className="flex flex-col items-start gap-3 w-full">
      {/* Profile + Comment */}
      <div className="flex items-start gap-3 w-full">
        <Image
          src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full object-cover w-10 h-10 ring-2 ring-blue-400 transition-transform transform hover:scale-105"
        />
        <div className="flex-1 flex flex-col gap-2">
          {/* Comment Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg">
            <div className="flex justify-between items-start flex-wrap gap-2">
              {/* User Info */}
              <div className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-black dark:text-white">
                  {comment.owner.username}
                </span>
                <span className="text-xs md:text-sm ml-2 text-gray-500">
                  {comment.owner.profileName}
                </span>
                <span className="text-xs md:text-sm ml-2 text-gray-400">
                  · {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                {comment?.isEdited && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full ml-2"
                  >
                    <MdOutlineContentCopy className="w-4 h-4" />
                    <span>Edited</span>
                  </motion.div>
                )}
              </div>

              {/* Actions (Edit / Delete) */}
              {user?._id === comment?.owner?._id && (
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <FaRegEdit
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 text-lg md:text-xl cursor-pointer hover:scale-110 transition-transform p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                    />
                  )}
                  <MdOutlineDelete
                    className="text-red-500 text-lg md:text-xl cursor-pointer hover:scale-110 transition-transform p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800"
                    onClick={() => deleteComment(comment._id, comment.postId)}
                  />
                  <MdOutlineReport
                    className="text-red-500 text-lg md:text-xl cursor-pointer hover:scale-110 transition-transform p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800"
                    onClick={() => {
                      setIsTargetId(comment?._id);
                      setReportedOnType('comment');
                      setShowMenuReport(true);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Text OR Edit Mode */}
            {isEditing ? (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  dir={/[\u0600-\u06FF]/.test(editText) ? 'rtl' : 'ltr'}
                  className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base text-black dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateComment}
                    disabled={loadingEdit}
                    className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium shadow ${
                      loadingEdit
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {loadingEdit ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.text);
                    }}
                    className="px-4 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              comment.text && (() => {
                const isArabic = /[\u0600-\u06FF]/.test(comment.text);
                return (
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isArabic ? 'text-right' : 'text-left'
                    } text-gray-800 dark:text-gray-200`}
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    {comment.text}
                  </p>
                );
              })()
            )}
          </div>

          {/* Actions (Like / Reply) */}
          <div className="flex flex-wrap items-center gap-6 mt-2 text-gray-500 dark:text-gray-400 text-sm md:text-base ml-1">
            <div
              onClick={() => likeComment(comment._id, comment.postId)}
              className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition transform hover:scale-110"
            >
              {comment?.likes?.includes(user._id) ? (
                <IoIosHeart className="text-red-500 text-xl md:text-2xl" />
              ) : (
                <CiHeart className="text-xl md:text-2xl" />
              )}
              <span>{comment?.likes?.length}</span>
            </div>
            <div
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition transform hover:scale-110"
            >
              <FaRegCommentDots className="text-lg md:text-xl" />
              <span>{comment.replies?.length || 0}</span>
            </div>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="flex flex-col md:flex-row items-center gap-3 mt-3 w-full">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                dir={/[\u0600-\u06FF]/.test(replyText) ? 'rtl' : 'ltr'}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <IoIosSend
                onClick={handleSendReply}
                className={`text-blue-500 text-2xl md:text-3xl cursor-pointer transition-transform ${
                  loadingReply ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-4 pl-6 border-l border-gray-300 dark:border-gray-700 flex flex-col gap-3">
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
