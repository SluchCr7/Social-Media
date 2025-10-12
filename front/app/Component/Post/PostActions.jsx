'use client'
import React from 'react'
import Link from 'next/link'
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { LuLaugh } from "react-icons/lu"
import { BiRepost } from "react-icons/bi"

const PostActions = ({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  const isInPostPage = window.location.pathname === `/Pages/Post/`
  return (
    <div
      className="
        grid grid-cols-4 sm:flex sm:flex-nowrap justify-around sm:justify-between
        items-center gap-3 mt-3 p-3 sm:p-0
        bg-white/30 dark:bg-gray-800/30 sm:bg-transparent
        rounded-xl sm:rounded-none backdrop-blur-md sm:backdrop-blur-0
        shadow-sm sm:shadow-none border border-white/10 sm:border-0
      "
    >

      {/* ❤️ Like */}
      <button
        onClick={() => likePost(post?._id, post?.owner._id)}
        title="Like"
        className={`
          flex flex-col sm:flex-row items-center justify-center
          gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
          transition-all duration-200 ease-in-out
          hover:bg-white/10 dark:hover:bg-gray-700/30
          active:scale-95
          ${post?.hahas?.includes(user?._id) ? 'hidden' : 'flex'}
        `}
      >
        {post?.likes?.includes(user?._id) ? (
          <IoIosHeart className="text-red-500 text-xl sm:text-2xl" />
        ) : (
          <CiHeart className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
        )}
        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {post?.likes?.length}
        </span>
      </button>

      {/* 😂 Haha */}
      <button
        onClick={() => hahaPost(post?._id)}
        title="React Haha"
        className={`
          flex flex-col sm:flex-row items-center justify-center
          gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
          transition-all duration-200 ease-in-out
          hover:bg-white/10 dark:hover:bg-gray-700/30
          active:scale-95
          ${post?.likes?.includes(user?._id) ? 'hidden' : 'flex'}
        `}
      >
        {post?.hahas?.includes(user?._id) ? (
          <LuLaugh className="text-yellow-500 text-xl sm:text-2xl" />
        ) : (
          <LuLaugh className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
        )}
        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {post?.hahas?.length}
        </span>
      </button>

      {/* 💬 Comment */}
      {!post?.isCommentOff && (
          isInPostPage ? 
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              className="flex items-center gap-1 sm:gap-2 cursor-pointer min-w-[50px] justify-center sm:justify-start transition"
            >
              <FaRegCommentDots className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {post?.comments?.length}
              </span>
            </motion.button>
          :
          <Link
            href={`/Pages/Post/${post?._id}`}
            title="Comments"
            className="
              flex flex-col sm:flex-row items-center justify-center
              gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
              hover:bg-white/10 dark:hover:bg-gray-700/30
              transition-all duration-200 ease-in-out
              active:scale-95
            "
          >
          <FaRegCommentDots className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
          <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {post?.comments?.length}
          </span>
        </Link> 
      )}
      {/* 🔖 Save */}
      <div
        title="Save Post"
        onClick={() => savePost(post?._id)}
        className="
          flex flex-col sm:flex-row items-center justify-center
          gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
          hover:bg-white/10 dark:hover:bg-gray-700/30
          transition-all duration-200 ease-in-out
          active:scale-95 cursor-pointer
        "
      >
        <CiBookmark
          className={`
            ${post?.saved?.includes(user?._id)
              ? 'text-yellow-400'
              : 'text-gray-500 dark:text-gray-400'
            } text-xl sm:text-2xl
          `}
        />
        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {post?.saved?.length}
        </span>
      </div>
      {/* 🔁 Share */}
      <div
        title="Share Post"
        onClick={() => sharePost(post?.originalPost ? post?.originalPost?._id : post?._id, post?.owner?._id)}
        className="
          flex flex-col sm:flex-row items-center justify-center
          gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
          hover:bg-white/10 dark:hover:bg-gray-700/30
          transition-all duration-200 ease-in-out
          active:scale-95 cursor-pointer
        "
      >
        <IoIosShareAlt className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
      </div>

      {/* 🔄 Repost */}
      <div
        title="Repost"
        onClick={() => setOpenModel(true)}
        className="
          flex flex-col sm:flex-row items-center justify-center
          gap-1 sm:gap-2 p-2 sm:p-1 rounded-lg
          hover:bg-white/10 dark:hover:bg-gray-700/30
          transition-all duration-200 ease-in-out
          active:scale-95 cursor-pointer
        "
      >
        <BiRepost className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl" />
      </div>
    </div>
  )
}

export default PostActions
