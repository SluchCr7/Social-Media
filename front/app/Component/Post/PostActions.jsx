'use client'
import React from 'react'
import Link from 'next/link'
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { LuLaugh } from "react-icons/lu"
import { BiRepost } from "react-icons/bi"

const PostActions = ({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  return (
    <div
      className="
        flex flex-wrap sm:flex-nowrap justify-around sm:justify-between 
        items-center gap-2 sm:gap-4 mt-3 p-2 sm:p-0
        bg-white/30 dark:bg-gray-800/30 sm:bg-transparent
        rounded-xl sm:rounded-none backdrop-blur-md sm:backdrop-blur-0
      "
    >
      {/* Like */}
      <button
        onClick={() => likePost(post?._id, post?.owner._id)}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg transition-all hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90 ${
          post?.hahas?.includes(user?._id) ? 'hidden' : 'flex'
        }`}
      >
        {post?.likes?.includes(user?._id) ? (
          <IoIosHeart className="text-red-500 text-2xl" />
        ) : (
          <CiHeart className="text-gray-500 text-2xl" />
        )}
        <span className="text-xs sm:text-sm text-gray-500">{post?.likes?.length}</span>
      </button>

      {/* Haha */}
      <button
        onClick={() => hahaPost(post?._id)}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg transition-all hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90 ${
          post?.likes?.includes(user?._id) ? 'hidden' : 'flex'
        }`}
      >
        {post?.hahas?.includes(user?._id) ? (
          <LuLaugh className="text-yellow-500 text-2xl" />
        ) : (
          <LuLaugh className="text-gray-500 text-2xl" />
        )}
        <span className="text-xs sm:text-sm text-gray-500">{post?.hahas?.length}</span>
      </button>

      {/* Comment */}
      {!post?.isCommentOff && (
        <Link
          href={`/Pages/Post/${post?._id}`}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90"
        >
          <FaRegCommentDots className="text-gray-500 text-2xl" />
          <span className="text-xs sm:text-sm text-gray-500">{post?.comments?.length}</span>
        </Link>
      )}

      {/* Share */}
      <div
        onClick={() => sharePost(post?.originalPost ? post?.originalPost?._id : post?._id, post?.owner?._id)}
        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90 cursor-pointer"
      >
        <IoIosShareAlt className="text-gray-500 text-2xl" />
      </div>

      {/* Repost */}
      <div
        onClick={() => setOpenModel(true)}
        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90 cursor-pointer"
      >
        <BiRepost className="text-gray-500 text-2xl" />
      </div>

      {/* Save */}
      <div
        onClick={() => savePost(post?._id)}
        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-90 cursor-pointer"
      >
        <CiBookmark
          className={`${post?.saved?.includes(user?._id)
              ? 'text-yellow-400'
              : 'text-gray-500'
            } text-2xl`}
        />
        <span className="text-xs sm:text-sm text-gray-500">{post?.saved?.length}</span>
      </div>
    </div>
  )
}

export default PostActions
