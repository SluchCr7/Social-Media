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
    <div className="flex items-start gap-3 py-5 w-full">
      {/* Profile Image */}
      <Image
        src={comment?.owner?.profilePhoto?.url || '/default-avatar.png'}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 mt-1 ring-2 ring-blue-400"
      />

      {/* Comment Body */}
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl px-5 py-3 w-full shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-black dark:text-white">
                {comment.owner.username}
              </span>
              <span className="text-xs ml-2 text-gray-500">
                {comment.owner.profileName}
              </span>
              <span className="text-xs ml-2 text-gray-400">
                · {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {user?._id === comment?.owner?._id && (
              <MdOutlineDelete
                className="text-red-500 text-lg cursor-pointer hover:scale-110 transition-transform"
                onClick={() => deleteComment(comment._id, comment.postId)}
              />
            )}
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{comment.text}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 ml-2 mt-1 text-gray-500 dark:text-gray-400">
          <div
            onClick={() => likeComment(comment._id, comment.postId)}
            className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"
          >
            {comment?.likes?.includes(user._id) ? (
              <IoIosHeart className="text-red-500 text-xl" />
            ) : (
              <CiHeart className="text-xl" />
            )}
            <span className="text-sm">{comment?.likes?.length}</span>
          </div>
          <div
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition"
          >
            <FaRegCommentDots className="text-lg" />
            <span className="text-sm">{replies.length}</span>
          </div>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="flex items-center gap-3 mt-3 w-full">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            />
            <IoIosSend
              onClick={handleSendReply}
              className={`text-blue-500 text-2xl cursor-pointer transition-transform ${
                loadingReply ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            />
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 pl-6 w-full border-l-[2px] border-gray-300 dark:border-gray-700 space-y-5">
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


// 'use client'
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react'
// import { CiHeart } from "react-icons/ci";
// import { FaRegCommentDots } from "react-icons/fa";
// import { IoIosHeart, IoIosSend } from "react-icons/io";
// import { useReply } from '../Context/ReplyContext';
// import { useReplyReply } from '../Context/ReplyReplyContext';
// import Reply from './Reply';
// import { MdOutlineDelete } from "react-icons/md";
// import { useComment } from '../Context/CommentContext';
// import { useAuth } from '../Context/AuthContext';
// const Comment = ({ comment }) => {
//   const [isReply, setIsReply] = useState(false);
//   const [reply, setReply] = useState('');
//   const { AddReply } = useReply();
//   const {likeComment , deleteComment} = useComment()
//   const { user } = useAuth()
//   // useEffect(() => {
//   //   console.log(comment)
//   // },[comment])
//   return (
//     <div key={comment._id} className="flex items-start gap-3 py-4 border-b border-gray-700">
//       {/* Commenter's Profile Image */}
//       <Image
//         src={comment?.owner?.profilePhoto?.url}
//         alt="avatar"
//         width={40}
//         height={40}
//         className="rounded-full object-cover mt-1 w-10 h-10"
//       />

//       {/* Comment Content */}
//       <div className="flex flex-col items-start gap-2 w-full">
//         <div className="flex flex-col bg-gray-400/80 dark:bg-gray-900/80 rounded-xl px-4 py-3 w-full shadow-inner">
//           <div className="flex justify-between items-center mb-1">
//             <div>
//               <span className="text-sm font-semibold text-white">{comment.owner.username}</span>
//               <span className="text-xs text-gray-700 dark:text-gray-400 ml-2">{comment.owner.profileName}</span>
//               <span className="text-xs text-darkMode-fg ml-2">. {new Date(comment.createdAt).toLocaleDateString()}</span>
//             </div>
//             {user?._id === comment?.owner?._id && (
//               <MdOutlineDelete
//                 className="text-red-500 text-lg cursor-pointer hover:scale-105 transition-transform"
//                 onClick={() => deleteComment(comment._id)}
//               />
//             )}
//           </div>
//           <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
//         </div>
//         {/* Actions: Like & Reply */}
//         <div className="flex items-center gap-4">
//           <div onClick={() => likeComment(comment._id)} className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
//               {comment?.likes?.includes(user._id) ? (
//                 <IoIosHeart className='text-red-500 text-xl' />
//               ) : (
//                 <CiHeart className='text-gray-500 text-xl' />
//               )}
//               <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{comment?.likes?.length}</span>
//           </div>
//           <div
//             className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
//             onClick={() => setIsReply(!isReply)}
//           >
//             <FaRegCommentDots className="text-gray-700 dark:text-gray-400 text-lg group-hover:text-white" />
//             <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{
//               comment?.replies?.length 
//               }</span>
//           </div>
//         </div>

//         {/* Reply Input */}
//         <div className={`${isReply ? 'flex' : 'hidden'} items-center gap-4 mt-2 w-full`}>
//           <input
//             type="text"
//             placeholder="Add a reply..."
//             value={reply}
//             onChange={(e) => setReply(e.target.value)}
//             className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         <IoIosSend
//             onClick={() => {
//             AddReply(reply , comment._id);
//             // setReply('');
//             }}
//             className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer" />
//         </div>

//         {/* Replies Section */}
//         {
//           <div className="mt-4 pl-6 w-full border-l-[3px] border-gray-700 space-y-4">
//             {comment?.replies?.length > 0 &&
//               comment?.replies?.map((reply) => (
//                 <Reply key={reply._id} reply={reply} />
//               ))
//             }
//           </div>
//         } 
//       </div>
//     </div>
//   )
// }
// export default Comment;
