import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosShareAlt, IoIosHeart, IoIosSend } from 'react-icons/io';
import { BsThreeDots, BsEye } from 'react-icons/bs';
import { motion } from 'framer-motion';
import PostMenu from '@/app/Component/PostMenu';
import Comment from '@/app/Component/Comment';
import CommentSkeleton from '@/app/Skeletons/CommentSkeleton';
import { LuLaugh } from "react-icons/lu";
import PostPhotos from "@/app/Component/Post/PostPhotos";
import RenderPostText from "@/app/Component/Post/RenderText";
import SharedTitle from "@/app/Component/Post/SharedTitle";
import { HiBadgeCheck } from "react-icons/hi";
import PostLinks from "@/app/Component/Post/PostLinks";
import PostHashtags from "@/app/Component/Post/PostHashtags";
import SharedPost from "@/app/Component/Post/SharedPost";
import PostImage from "@/app/Component/Post/PostImage";
import PostActions from "@/app/Component/Post/PostActions";
import ProfileHeader from "@/app/Component/UserComponents/ProfileHeader";
import { ShareModal } from "@/app/Component/AddandUpdateMenus/SharePost";

const DesignPostSelect = ({
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

  return (
    <div className="relative w-[90%] md:w-full mx-auto">
      <ShareModal
        post={post} 
        isOpen={openModel} 
        onClose={() => setOpenModel(false)} 
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
      /> 
      <motion.div
        className="w-full max-w-5xl mx-auto p-3 sm:p-6 flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.isPinned && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 rounded-full shadow-md">
              📌 Pinned
            </span>
          )}
          {isShared && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-md">
              🔁 Shared
            </span>
          )}
        </div>

        {/* Shared Info */}
        {isShared && <SharedTitle user={user} post={post} original={original} />}

        {/* Post Card */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 transition-transform hover:scale-[1.01]">
          
          {/* Profile */}
          <PostImage
            post={post}
            isCommunityPost={isCommunityPost}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Header */}
            {/* <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                {isCommunityPost ? (
                  <div className="flex flex-col text-sm">
                    <Link href={`/Pages/Community/${post.community?._id}`} className="font-semibold hover:underline text-gray-900 dark:text-gray-100">
                      {post.community?.Name}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>@{post.owner?.username}</span>
                      <span className="hidden sm:inline-block w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col text-sm">
                    <Link
                      href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
                      className="font-semibold hover:underline text-gray-900 dark:text-gray-100 flex items-center gap-1"
                    >
                      {post.owner?.username}
                      {post?.owner?.isAccountWithPremiumVerify && (
                        <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                      )}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{post.owner?.profileName}</span>
                      <span className="hidden sm:inline-block w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="relative self-end sm:self-auto">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <BsThreeDots className="text-xl text-gray-500 hover:text-gray-700" />
                  </button>
                  <PostMenu post={post} showMenu={showMenu} setShowMenu={setShowMenu} />
                </div>
              )}
            </div> */}
            <ProfileHeader
              post={post}
              user={post?.owner}
              isLogin={isLogin}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isCommunityPost={isCommunityPost}
            />
            {/* Text */}
            {post.text && (
              <RenderPostText text={post.text} mentions={post.mentions} hashtags={post.Hashtags} />
            )}
            <PostLinks links={post?.links}/>

            {/* Shared Original */}
            {isShared && original && (
              <SharedPost
                original={original}
                user={user}
                setImageView={setImageView}
              />
            )}

            {/* Photos */}
            {!isShared && post.Photos?.length > 0 && (
              <PostPhotos photos={post.Photos} setImageView={setImageView} postId={post._id} />
            )}
            {/* 🔗 Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <PostHashtags post={post} />
            )}
            {/* Actions */}
            {isLogin && (
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* <ActionIcon onClick={() => likePost(post._id, post.owner._id)} Icon={post.likes?.includes(user?._id) ? IoIosHeart : CiHeart} count={post.likes?.length} active={post.likes?.includes(user?._id)} />
                <ActionIcon onClick={() => hahaPost(post._id)} Icon={LuLaugh} count={post.hahas?.length} activeHaha={post.hahas?.includes(user?._id)} />
                {!post.isCommentOff && <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />}
                <ActionIcon onClick={() => sharePost(post._id)} Icon={IoIosShareAlt} count={post.shares?.length} />
                <ActionIcon onClick={() => savePost(post._id)} Icon={CiBookmark} count={post.saved?.length} active={post.saved?.includes(user?._id)} /> */}
                <PostActions
                  post={post}
                  user={user}
                  likePost={likePost}
                  hahaPost={hahaPost}
                  sharePost={sharePost}
                  savePost={savePost}
                  setOpenModel={setOpenModel}
                />
                {user?._id === post.owner?._id && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm ml-auto sm:ml-0">
                    <BsEye />
                    <span>{post?.views?.length || 0}</span>
                  </div>
                )}
                
              </div>
            )}

            {!post.isCommentOff && isLogin && (
              canComment() ? (
                <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <Image
                    src={user?.profilePhoto?.url || '/default-profile.png'}
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-transparent text-sm resize-none outline-none placeholder-gray-400 dark:placeholder-gray-500 px-2 min-h-[36px]"
                    rows={1}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddComment}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition"
                  >
                    <IoIosSend className="text-white text-lg" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl text-sm text-yellow-800 dark:text-yellow-300">
                  You must follow or be followed by @{post.owner?.username} to comment on this post.
                </div>
              )
            )}

            {/* Comments List */}
            <div className="flex flex-col gap-4 border-t border-gray-700 pt-6">
              {post.isCommentOff ? (
                <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
                  <p>Comments are turned off</p>
                </div>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
              ) : comments?.length > 0 ? (
                comments.map((comment) => <Comment key={comment._id} comment={comment} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
                  <p>No comments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const ActionIcon = ({ Icon, count, onClick, active, activeHaha }) => (
  <motion.button 
    onClick={onClick} 
    whileTap={{ scale: 0.9 }} 
    className="flex items-center gap-1 sm:gap-2 cursor-pointer min-w-[50px] justify-center sm:justify-start transition"
  >
    <Icon className={`text-2xl ${activeHaha ? 'text-yellow-500' : ''} ${active ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`} />
    <span className="text-gray-400 text-xs sm:text-sm">{count}</span>
  </motion.button>
);

export default DesignPostSelect;
