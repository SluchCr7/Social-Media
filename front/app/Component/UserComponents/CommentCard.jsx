'use client'

import Image from 'next/image'
import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const CommentCard = memo(({ comment }) => {
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
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_-22px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[#0f1117]/90 dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-fuchsia-500/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Image
              src={profilePhoto}
              alt="Commenter"
              width={44}
              height={44}
              loading="lazy"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-[#0f1117]"
            />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0f1117]" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                {comment.owner?.username}
              </p>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
                Comment
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {comment.owner?.profileName || 'Member'}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-slate-200/80 bg-slate-50/70 px-3 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          {createdAt}
        </span>
      </div>

      {comment.text && (
        <div className="relative mt-4 rounded-[1.25rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100/80 p-4 shadow-sm dark:border-white/10 dark:from-white/[0.04] dark:via-white/[0.03] dark:to-white/[0.02]">
          <div className="absolute left-4 top-0 h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500" />
          <p className="pl-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
            {comment.text}
          </p>
        </div>
      )}

      {comment.postId && (
        <div className="mt-4 rounded-[1.25rem] border border-slate-200/80 bg-slate-50/70 p-3 transition-colors duration-200 hover:bg-slate-100/80 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Image
                src={postPhoto}
                alt="Post Owner"
                width={38}
                height={38}
                loading="lazy"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200/80 dark:ring-white/10"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {comment.postId?.owner?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {comment.postId?.owner?.profileName || 'Post owner'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {postCreatedAt}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {comment.postId?.text || 'No post content available.'}
          </p>
        </div>
      )}
    </motion.div>
  )
})

CommentCard.displayName = 'CommentCard'
export default CommentCard
