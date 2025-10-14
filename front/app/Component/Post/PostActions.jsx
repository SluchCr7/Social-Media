'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { LuLaugh } from "react-icons/lu"
import { BiRepost } from "react-icons/bi"
import { BsEye } from 'react-icons/bs'

const PostActions = ({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  const [isInPostPage, setIsInPostPage] = useState(false)

  useEffect(() => {
    setIsInPostPage(window.location.pathname.startsWith('/Pages/Post/'))
  }, [])

  const ActionButton = ({ onClick, icon, label, active, color }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
        px-3 py-2 rounded-xl transition-all duration-200 ease-in-out
        hover:bg-gradient-to-tr hover:from-white/20 hover:to-transparent
        active:scale-95 select-none
      `}
    >
      <span className={`${active ? color : 'text-gray-500 dark:text-gray-400'} text-[22px] sm:text-[24px]`}>
        {icon}
      </span>
      <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
    </motion.button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        grid grid-cols-4 sm:flex sm:flex-nowrap justify-around sm:justify-between
        items-center gap-3 mt-3 p-3
        bg-white/30 dark:bg-gray-800/30 
        backdrop-blur-lg rounded-2xl border border-white/10
        shadow-md sm:shadow-none
      "
    >

      {/* ❤️ Like */}
      {!post?.hahas?.includes(user?._id) && (
        <ActionButton
          onClick={() => likePost(post?._id, post?.owner._id)}
          icon={post?.likes?.includes(user?._id)
            ? <IoIosHeart className="text-red-500" />
            : <CiHeart />}
          label={post?.likes?.length || 0}
          active={post?.likes?.includes(user?._id)}
          color="text-red-500"
        />
      )}

      {/* 😂 Haha */}
      {!post?.likes?.includes(user?._id) && (
        <ActionButton
          onClick={() => hahaPost(post?._id)}
          icon={<LuLaugh />}
          label={post?.hahas?.length || 0}
          active={post?.hahas?.includes(user?._id)}
          color="text-yellow-400"
        />
      )}

      {/* 💬 Comment */}
      {!post?.isCommentOff && (
        isInPostPage ? (
          <ActionButton
            icon={<FaRegCommentDots />}
            label={post?.comments?.length || 0}
          />
        ) : (
          <Link href={`/Pages/Post/${post?._id}`}>
            <ActionButton
              icon={<FaRegCommentDots />}
              label={post?.comments?.length || 0}
            />
          </Link>
        )
      )}

      {/* 🔖 Save */}
      <ActionButton
        onClick={() => savePost(post?._id)}
        icon={<CiBookmark />}
        label={post?.saved?.length || 0}
        active={post?.saved?.includes(user?._id)}
        color="text-yellow-400"
      />

      {/* 🔁 Share */}
      <ActionButton
        onClick={() => sharePost(post?.originalPost ? post.originalPost._id : post._id, post?.owner?._id)}
        icon={<IoIosShareAlt />}
      />
      {
        user?._id === post.owner?._id && (
          <ActionButton
            icon={<BsEye />}
            label={post?.views?.length || 0}
          />
        )
      }

      {/* 🔄 Repost */}
      <ActionButton
        onClick={() => setOpenModel(true)}
        icon={<BiRepost />}
      />
    </motion.div>
  )
}

export default PostActions
