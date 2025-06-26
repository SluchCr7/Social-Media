import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../Context/AuthContext';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa6';
import { IoIosSend } from 'react-icons/io';
const ReplyAgain = ({replyForward}) => {
    const {user} = useAuth()
  return (
    <div key={replyForward._id} className='flex w-full items-start gap-3'>
        <Image
            src={replyForward?.owner?.profilePhoto?.url}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full object-cover mt-1 w-8 h-8"
        />
        <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex flex-col bg-gray-400/20 dark:bg-gray-800/20 rounded-xl px-4 py-3 w-full shadow-inner">
                    <div className="flex justify-between w-full items-center mb-1">
                        <Link href={user._id === replyForward.owner._id ? '/Pages/Profile' : `/Pages/User/${replyForward.owner._id}`}>
                            <span className="text-sm font-semibold text-white">{replyForward.owner.username}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-400 ml-2">{replyForward.owner.profileName}</span>
                        </Link>
                        <span className="text-xs text-gray-500">{new Date(replyForward.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300">{replyForward.text}</p>
                </div>
            </div>
            {/* Actions: Like & Reply */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
                    <CiHeart className="text-gray-700 dark:text-gray-400 text-xl group-hover:text-white" />
                    <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{replyForward?.likes?.length}</span>
                </div>
                <div
                    className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
                    // onClick={() => setIsReplyAgain(!isReplyAgain)}
                >
                    <FaRegCommentDots className="text-gray-700 dark:text-gray-400 text-lg group-hover:text-white" />
                    {/* <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{reply?.repliesForward?.length}</span> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReplyAgain