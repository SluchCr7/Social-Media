import Image from 'next/image'
import React from 'react'

const CommentCard = ({ comment }) => (
  <div className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={comment.owner?.profilePhoto?.url || '/default-profile.png'} alt="Commenter" width={36} height={36} className="rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{comment.owner?.username}</p>
          <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
    </div>

    <p className="text-sm text-gray-300 pl-1 border-l-2 border-gray-600">{comment.text}</p>

    {comment.postId && (
      <div className="flex gap-3 items-start border-t border-gray-700 pt-4">
        <Image src={comment.postId?.owner?.profilePhoto?.url || '/default-profile.png'} alt="Post owner" width={36} height={36} className="rounded-full object-cover mt-1" />
        <div className="flex flex-col bg-gray-800/50 px-4 py-3 rounded-lg w-full">
          <div className="flex justify-between items-center mb-1">
            <div>
              <p className="text-sm font-semibold">{comment.postId?.owner?.username}</p>
              <p className="text-xs text-gray-400">{comment.postId?.owner?.profileName}</p>
            </div>
            <span className="text-xs text-gray-500">{new Date(comment.postId?.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-gray-300">{comment.postId?.text || 'No post content available.'}</p>
        </div>
      </div>
    )}
  </div>
)

export default CommentCard