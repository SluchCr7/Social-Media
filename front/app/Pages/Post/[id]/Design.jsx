'use client';

import React, { memo, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiCheckBadge, HiChatBubbleLeftRight, HiSignal } from 'react-icons/hi2';
import { ShareModal } from "@/app/Component/AddandUpdateMenus/SharePost";
import PostImage from "@/app/Component/Post/PostImage";
import PostHeader from "@/app/Component/Post/PostHeader";
import RenderPostText from "@/app/Component/Post/RenderText";
import PostLinks from "@/app/Component/Post/PostLinks";
import SharedPost from "@/app/Component/Post/SharedPost";
import PostPhotos from "@/app/Component/Post/PostPhotos";
import PostHashtags from "@/app/Component/Post/PostHashtags";
import PostActions from "@/app/Component/Post/PostActions";
import SharedTitle from "@/app/Component/Post/SharedTitle";
import { useTranslation } from "react-i18next";
import PostMusicPlayer from "@/app/Component/Post/PostMusic";

const Comment = dynamic(() => import("@/app/Component/Comment"), {
  loading: () => <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />,
});
import CommentSkeleton from "@/app/Skeletons/CommentSkeleton";

const DesignPostSelect = memo(({
  post,
  isShared,
  original,
  user,
  isLogin,
  isCommunityPost,
  showMenu,
  setShowMenu,
  likePost,
  sharePost,
  hahaPost,
  savePost,
  setImageView,
  comments,
  isLoading,
  commentText,
  setCommentText,
  handleAddComment,
  openModel, setOpenModel,
  canComment
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-8">
      {/* 🎭 Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <ShareModal
        post={post}
        isOpen={openModel}
        onClose={() => setOpenModel(false)}
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 🚀 Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              {t('Focus Entry')}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-4 py-1.5 rounded-full">
            <HiSignal className="w-3 h-3 animate-pulse" />
            Live Sync
          </div>
        </div>

        {/* 💎 Main Post Card (The Prism) */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
        >
          {/* Decorative Header */}
          <div className="p-8 pb-4 flex flex-wrap gap-2">
            {post.isPinned && (
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-widest">
                Pinned Terminal
              </span>
            )}
            {isShared && (
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] font-black uppercase tracking-widest">
                Shared Resonance
              </span>
            )}
          </div>

          <div className="px-8 pb-8 space-y-8">
            {/* User Info Header */}
            <PostHeader
              post={post}
              user={user}
              isLogin={isLogin}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isCommunityPost={isCommunityPost}
            />

            {/* Content Body */}
            <div className="space-y-6">
              {post.text && (
                <div className="text-2xl md:text-3xl font-medium leading-tight dark:text-white/90 tracking-tight">
                  <RenderPostText
                    text={post.text}
                    mentions={post.mentions}
                    hashtags={post.Hashtags}
                  />
                </div>
              )}

              {/* Media Blocks */}
              <div className="space-y-4">
                {post?.music && <PostMusicPlayer music={post.music} />}

                {!isShared && post.Photos?.length > 0 && (
                  <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl">
                    <PostPhotos
                      photos={post.Photos}
                      setImageView={setImageView}
                      postId={post._id}
                    />
                  </div>
                )}

                {isShared && original && (
                  <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 p-6">
                    <SharedTitle user={user} post={post} original={original} />
                    <SharedPost
                      original={original}
                      user={user}
                      setImageView={setImageView}
                    />
                  </div>
                )}

                <PostLinks links={post?.links} />
              </div>

              {post?.Hashtags?.length > 0 && (
                <div className="pt-4">
                  <PostHashtags post={post} />
                </div>
              )}
            </div>

            {/* Premium Action Footer */}
            {isLogin && (
              <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                <PostActions
                  post={post}
                  user={user}
                  likePost={likePost}
                  hahaPost={hahaPost}
                  sharePost={sharePost}
                  savePost={savePost}
                  setOpenModel={setOpenModel}
                />
              </div>
            )}
          </div>
        </motion.article>

        {/* 💬 Discourse Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pl-4">
            <HiChatBubbleLeftRight className="w-5 h-5 text-indigo-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              {t('Active Discourse')} ({comments?.length || 0})
            </h2>
          </div>

          {/* Comment Input Box */}
          {!post.isCommentOff && isLogin && (
            canComment() ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl p-4 md:p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex items-center gap-4"
              >
                <div className="relative shrink-0">
                  <Image
                    src={user?.profilePhoto?.url || '/default-profile.png'}
                    alt="User"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0B0F1A] rounded-full" />
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={`${t('Contribute to discourse')}...`}
                    className="w-full bg-transparent text-lg font-medium outline-none placeholder-gray-400 dark:placeholder-gray-600 px-2"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${commentText.trim()
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <HiPaperAirplane className="w-5 h-5 -rotate-45" />
                </motion.button>
              </motion.div>
            ) : (
              <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-amber-600 flex items-center gap-3">
                <HiCheckBadge className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  {t("Privileged Access Required")} • @{post.owner?.username} {t("discourse limit active")}
                </span>
              </div>
            )
          )}

          {/* Feed of Comments */}
          <div className="space-y-4">
            {post.isCommentOff ? (
              <div className="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
                Discourse Disabled for this Entity
              </div>
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
            ) : comments?.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Comment comment={comment} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest">
                No Signals Detected Yet
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

DesignPostSelect.displayName = 'DesignPostSelect';
export default DesignPostSelect;
