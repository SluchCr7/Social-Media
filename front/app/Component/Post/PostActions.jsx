'use client'
import React from 'react'
import Link from 'next/link'
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { LuLaugh } from "react-icons/lu";
import { BiRepost } from "react-icons/bi"

const PostActions = ({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  return (
    <div 
      className='flex flex-wrap gap-4 sm:gap-6 pt-4 justify-start sm:justify-between'
    >
      {/* Like */}
      <button
        disabled={post?.hahas?.includes(user?._id)}
        onClick={() => likePost(post?._id, post?.owner._id)}
        className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110 min-w-[70px]'
      >
        {post?.likes?.includes(user?._id) ? (
          <IoIosHeart className='text-red-500 text-2xl' />
        ) : (
          <CiHeart className='text-gray-500 text-2xl' />
        )}
        <span className='text-gray-400 text-sm font-medium'>{post?.likes?.length}</span>
      </button>

      {/* Haha */}
      <button
        disabled={post?.likes?.includes(user?._id)}
        onClick={() => hahaPost(post?._id)}
        className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110 min-w-[70px]'
      >
        {post?.hahas?.includes(user?._id) ? (
          <LuLaugh className='text-yellow-500 text-2xl' />
        ) : (
          <LuLaugh className='text-gray-500 text-2xl' />
        )}
        <span className='text-gray-400 text-sm font-medium'>{post?.hahas?.length}</span>
      </button>

      {/* Comment */}
      {!post?.isCommentOff && (
        <Link 
          href={`/Pages/Post/${post?._id}`} 
          className='flex items-center gap-2 transition-all hover:scale-110 min-w-[70px]'
        >
          <FaRegCommentDots className='text-gray-500 text-xl' />
          <span className='text-gray-400 text-sm font-medium'>{post?.comments?.length}</span>
        </Link>
      )}

      {/* Share */}
      <div
        onClick={() => sharePost(
          post?.originalPost ? post?.originalPost?._id : post?._id,
          post?.owner?._id
        )}
        className="flex items-center gap-2 cursor-pointer transition-all hover:scale-110 min-w-[70px]"
      >
        <IoIosShareAlt className="text-gray-500 text-2xl" />
      </div>

      {/* Repost (Modal) */}
      <div
        onClick={() => setOpenModel(true)}
        className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110 min-w-[70px]'
      >
        <BiRepost className='text-gray-500 text-2xl' />
      </div>

      {/* Save */}
      <div
        onClick={() => savePost(post?._id)}
        className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110 min-w-[70px]'
      >
        <CiBookmark className={`${post?.saved?.includes(user?._id) ? 'text-yellow-400' : 'text-gray-500'} text-2xl`} />
        <span className='text-gray-400 text-sm font-medium'>{post?.saved?.length}</span>
      </div>
    </div>
  )
}

export default PostActions
