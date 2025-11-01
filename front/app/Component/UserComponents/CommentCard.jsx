'use client'

import Image from 'next/image'
import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const CommentCard = memo(({ comment }) => {
  // ✅ استخدم useMemo لتقليل العمليات في كل render
  const createdAt = useMemo(
    () => new Date(comment.createdAt).toLocaleDateString(),
    [comment.createdAt]
  )

  const postCreatedAt = useMemo(
    () =>
      comment.postId?.createdAt
        ? new Date(comment.postId.createdAt).toLocaleDateString()
        : null,
    [comment.postId?.createdAt]
  )

  const profilePhoto = useMemo(
    () => comment.owner?.profilePhoto?.url || '/default-profile.png',
    [comment.owner?.profilePhoto?.url]
  )

  const postPhoto = useMemo(
    () => comment.postId?.owner?.profilePhoto?.url || '/default-profile.png',
    [comment.postId?.owner?.profilePhoto?.url]
  )

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="
        w-full 
        bg-lightMode-menu dark:bg-darkMode-menu
        border border-lightMode-text/10 dark:border-darkMode-text/20 
        rounded-xl p-5 shadow-md
        flex flex-col gap-4
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={profilePhoto}
            alt="Commenter"
            width={40}
            height={40}
            loading="lazy"
            className="rounded-full object-cover ring-2 ring-lightMode-text/20 dark:ring-darkMode-text/30"
          />
          <div>
            <p
              className="
                text-sm font-semibold 
                text-lightMode-text dark:text-darkMode-text 
                hover:underline cursor-pointer
                transition-colors
              "
            >
              {comment.owner?.username}
            </p>
            <p className="text-xs text-lightMode-text2 dark:text-gray-400">
              {comment.owner?.profileName}
            </p>
          </div>
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {createdAt}
        </span>
      </div>

      {/* Comment text */}
      {comment.text && (
        <p
          className="
            text-sm leading-relaxed px-4 py-2 rounded-lg
            bg-lightMode-bg dark:bg-darkMode-bg 
            text-lightMode-text2 dark:text-gray-200
            border border-lightMode-text/10 dark:border-darkMode-text/20
          "
        >
          {comment.text}
        </p>
      )}

      {/* Linked post preview */}
      {comment.postId && (
        <div className="flex gap-3 items-start border-t border-lightMode-text/10 dark:border-darkMode-text/20 pt-4">
          <Image
            src={postPhoto}
            alt="Post Owner"
            width={40}
            height={40}
            loading="lazy"
            className="rounded-full w-10 h-10 object-cover ring-1 ring-lightMode-text/10 dark:ring-darkMode-text/20"
          />
          <div
            className="
              flex flex-col w-full 
              bg-lightMode-bg dark:bg-[#1C1D21]
              px-4 py-3 rounded-lg 
              border border-lightMode-text/10 dark:border-darkMode-text/20 
              hover:bg-lightMode-menu dark:hover:bg-[#2B2D31]
              transition-colors duration-200
            "
          >
            <div className="flex justify-between items-center mb-1">
              <div>
                <p
                  className="
                    text-sm font-semibold 
                    text-lightMode-text dark:text-darkMode-text
                    hover:underline cursor-pointer
                  "
                >
                  {comment.postId?.owner?.username}
                </p>
                <p className="text-xs text-lightMode-text2 dark:text-gray-400">
                  {comment.postId?.owner?.profileName}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {postCreatedAt}
              </span>
            </div>

            <p className="text-sm text-lightMode-text2 dark:text-gray-200 line-clamp-3">
              {comment.postId?.text || 'No post content available.'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
})
CommentCard.displayName = 'CommentCard'
export default CommentCard
