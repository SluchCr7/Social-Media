'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosHeart, IoIosSend } from "react-icons/io";
import { useReply } from '../Context/ReplyContext';
import { useReplyReply } from '../Context/ReplyReplyContext';
import Reply from './Reply';
import { MdOutlineDelete } from "react-icons/md";
import { useComment } from '../Context/CommentContext';
import { useAuth } from '../Context/AuthContext';
const Comment = ({ comment }) => {
  const [isReply, setIsReply] = useState(false);
  const [reply, setReply] = useState('');
  const { AddReply } = useReply();
  const {likeComment , deleteComment} = useComment()
  const { user } = useAuth()
  // useEffect(() => {
  //   console.log(comment)
  // },[comment])
  return (
    <div key={comment._id} className="flex items-start gap-3 py-4 border-b border-gray-700">
      {/* Commenter's Profile Image */}
      <Image
        src={comment?.owner?.profilePhoto?.url}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full object-cover mt-1 w-10 h-10"
      />

      {/* Comment Content */}
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col bg-gray-400/80 dark:bg-gray-900/80 rounded-xl px-4 py-3 w-full shadow-inner">
          <div className="flex justify-between items-center mb-1">
            <div>
              <span className="text-sm font-semibold text-white">{comment.owner.username}</span>
              <span className="text-xs text-gray-700 dark:text-gray-400 ml-2">{comment.owner.profileName}</span>
              <span className="text-xs text-darkMode-fg ml-2">. {new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            {user?._id === comment?.owner?._id && (
              <MdOutlineDelete
                className="text-red-500 text-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => deleteComment(comment._id)}
              />
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
        </div>
        {/* Actions: Like & Reply */}
        <div className="flex items-center gap-4">
          <div onClick={() => likeComment(comment._id)} className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
              {comment?.likes?.includes(user._id) ? (
                <IoIosHeart className='text-red-500 text-xl' />
              ) : (
                <CiHeart className='text-gray-500 text-xl' />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{comment?.likes?.length}</span>
          </div>
          <div
            className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsReply(!isReply)}
          >
            <FaRegCommentDots className="text-gray-700 dark:text-gray-400 text-lg group-hover:text-white" />
            <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{
              comment?.replies?.length 
              }</span>
          </div>
        </div>

        {/* Reply Input */}
        <div className={`${isReply ? 'flex' : 'hidden'} items-center gap-4 mt-2 w-full`}>
          <input
            type="text"
            placeholder="Add a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
          />
        <IoIosSend
            onClick={() => {
            AddReply(reply , comment._id);
            // setReply('');
            }}
            className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer" />
        </div>

        {/* Replies Section */}
        {
          <div className="mt-4 pl-6 w-full border-l-[3px] border-gray-700 space-y-4">
            {comment?.replies?.length > 0 &&
              comment?.replies?.map((reply) => (
                <Reply key={reply._id} reply={reply} />
              ))
            }
          </div>
        } 
      </div>
    </div>
  )
}
export default Comment;
