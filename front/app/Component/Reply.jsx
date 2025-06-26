'use client'
import React, { useState } from 'react'
import { useReplyReply } from '../Context/ReplyReplyContext';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa6';
import { IoIosSend } from 'react-icons/io';
import Image from 'next/image';
import ReplyAgain from './ReplyAgain';
import { useAuth } from '../Context/AuthContext';
import Link from 'next/link';
const Reply = ({reply}) => {
  const [isReplyAgain , setIsReplyAgain] = useState(false)
  const [replyAgain , setReplyAgain] = useState('');
    const { AddReplyReply } = useReplyReply()
    const {user} = useAuth()
  return (
    <div key={reply._id} className='flex w-full items-start flex-col gap-3'>            
        <div className="flex w-full items-start gap-3">
        <Image
            src={reply?.owner?.profilePhoto?.url}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full object-cover mt-1 w-8 h-8"
        />
        <div className='flex flex-col items-start w-full gap-2'>
            <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex flex-col bg-gray-400/60 dark:bg-gray-800/60 rounded-xl px-4 py-3 w-full shadow-inner">
                    <div className="flex justify-between items-center mb-1">
                        <Link href={user._id === reply.owner._id ? '/Pages/Profile' : `/Pages/User/${reply.owner._id}`} >
                            <span className="text-sm font-semibold text-white">{reply.owner.username}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-400 ml-2">{reply.owner.profileName}</span>
                        </Link>
                        <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300">{reply.text}</p>
                </div>
            </div>
            {/* Actions: Like & Reply */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
                    <CiHeart className="text-gray-700 dark:text-gray-400 text-xl group-hover:text-white" />
                    <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{reply?.likes?.length}</span>
                </div>
                <div
                    className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsReplyAgain(!isReplyAgain)}
                >
                    <FaRegCommentDots className="text-gray-700 dark:text-gray-400 text-lg group-hover:text-white" />
                    <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-white">{reply?.repliesForward?.length}</span>
                </div>
            </div>
        </div>
        </div>
        {/* input Reply */}
        <div className={`${isReplyAgain ? 'flex' : 'hidden'} items-center gap-4 mt-2 w-full`}>
        <input
            type="text"
            placeholder="Add a reply..."
            value={replyAgain}
            onChange={(e) => setReplyAgain(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
        />
        <IoIosSend
            onClick={() => {
                AddReplyReply(replyAgain , reply._id);
                setReplyAgain('');
            }}
            className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer" />
        </div>
        <div className={`flex items-start w-full flex-col gap-3 `}>
        {
            <div className="mt-4 w-full pl-10 border-l-[3px] border-gray-700 space-y-4">
                {
                    reply?.repliesForward?.length > 0 &&
                    reply?.repliesForward?.map((replyForward) => (
                        <ReplyAgain key={replyForward._id} replyForward={replyForward} />
                    ))
                }
            </div>
        }
        </div>
    </div>
  )
}

export default Reply