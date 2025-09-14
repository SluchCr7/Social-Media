'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosHeart, IoIosSend } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [loadingReply, setLoadingReply] = useState(false);

  const { likeComment, deleteComment, AddComment } = useComment();
  const { user } = useAuth();

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      const newReply = await AddComment(
        replyText,
        comment.postId,
        comment.owner._id,
        comment._id
      );
      if (newReply && newReply.comment) {
        setReplies(prev => [...prev, newReply.comment]);
        setReplyText('');
        setIsReplying(false);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-3 py-4 w-full group">
      {/* Profile Image */}
      <Image
        src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 mt-1 ring-2 ring-blue-400 transition-transform transform group-hover:scale-110"
      />

      {/* Comment Body */}
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="bg-gradient-to-r from-gray-50 dark:from-gray-800 to-white dark:to-gray-900 rounded-2xl px-4 py-3 md:px-5 md:py-4 w-full shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform group-hover:scale-[1.02]">
          <div className="flex justify-between items-center mb-2 flex-wrap">
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-black dark:text-white">{comment.owner.username}</span>
              <span className="text-xs md:text-sm ml-2 text-gray-500">{comment.owner.profileName}</span>
              <span className="text-xs md:text-sm ml-2 text-gray-400">· {new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            {user?._id === comment?.owner?._id && (
              <MdOutlineDelete
                className="text-red-500 text-lg md:text-xl cursor-pointer hover:scale-110 transition-transform mt-1"
                onClick={() => deleteComment(comment._id, comment.postId)}
              />
            )}
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed">{comment.text}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 ml-2 mt-2 text-gray-500 dark:text-gray-400 text-sm md:text-base">
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
            <span>{replies.length}</span>
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
        {replies.length > 0 && (
          <div className="mt-4 pl-4 md:pl-6 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {replies.map((reply) => (
              <Comment key={reply._id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
