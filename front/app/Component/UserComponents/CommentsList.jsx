'use client'
import Image from 'next/image'

const CommentsList = ({ comments }) => {
  if (!comments || comments.length === 0)
    return <div className="text-center text-gray-500 py-10">No comments yet.</div>

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment?._id} className="w-full bg-gray-900/70 rounded-xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={comment.owner?.profilePhoto?.url || '/default-profile.png'} alt="Commenter" width={36} height={36} className="rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{comment.owner?.username}</p>
                <p className="text-xs text-gray-400">{comment.owner?.profileName}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{new Date(comment?.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-gray-300 pl-1 border-l-2 border-gray-600">{comment?.text}</p>
        </div>
      ))}
    </div>
  )
}

export default CommentsList
