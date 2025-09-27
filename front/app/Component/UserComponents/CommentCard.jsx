import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

const CommentCard = ({ comment }) => (
  <motion.div
    initial={{ y: 15, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="w-full bg-[#2B2D31] rounded-xl p-5 shadow-lg flex flex-col gap-4 border border-[#383A40]"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={comment.owner?.profilePhoto?.url || '/default-profile.png'}
          alt="Commenter"
          width={40}
          height={40}
          className="rounded-full object-cover ring-2 ring-blue-500/30"
        />
        <div>
          <p className="text-sm font-semibold text-white hover:text-blue-400 transition">
            {comment.owner?.username}
          </p>
          <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">
        {new Date(comment.createdAt).toLocaleDateString()}
      </span>
    </div>

    {/* Comment text */}
    <p className="text-sm text-gray-200 bg-[#383A40] px-4 py-2 rounded-lg leading-relaxed">
      {comment.text}
    </p>

    {/* Linked post preview */}
    {comment.postId && (
      <div className="flex gap-3 items-start border-t border-[#383A40] pt-4">
        <Image
          src={comment.postId?.owner?.profilePhoto?.url || '/default-profile.png'}
          alt="Comment User Photo"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 min-w-10 aspect-square object-cover "
        />
        <div className="flex flex-col bg-[#383A40] px-4 py-3 rounded-lg w-full hover:bg-[#404249] transition">
          <div className="flex justify-between items-center mb-1">
            <div>
              <p className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                {comment.postId?.owner?.username}
              </p>
              <p className="text-xs text-gray-400">{comment.postId?.owner?.profileName}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(comment.postId?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-200">
            {comment.postId?.text || 'No post content available.'}
          </p>
        </div>
      </div>
    )}
  </motion.div>
)

export default CommentCard
