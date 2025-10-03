import React from "react";
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
}) => {
  return (
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
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Image
            src={isCommunityPost ? post.community?.Picture?.url : post.owner?.profilePhoto?.url}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover"
          />
          <div className="border-l border-gray-400 h-full w-1 mt-2 hidden sm:block"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              {isCommunityPost ? (
                <div className="flex flex-col text-sm">
                  <Link href={`/Pages/Community/${post.community?._id}`} className="font-semibold hover:underline text-gray-900 dark:text-gray-100">
                    {post.community?.Name}
                  </Link>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>@{post.owner?.username}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:inline-block" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col text-sm">
                  <Link
                    href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
                    className="font-semibold hover:underline text-gray-900 dark:text-gray-100"
                  >
                    {post.owner?.username}
                  </Link>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <div>
                      <span>{post.owner?.profileName}</span>
                      {post?.owner?.isAccountWithPremiumVerify && (
                        <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                      )}
                    </div>
                    <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:inline-block" />
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
          </div>

          {/* Text */}
          {post.text && (
            <RenderPostText text={post.text} mentions={post.mentions} hashtags={post.Hashtags} />
          )}

          {/* Shared Original */}
          {isShared && original && (
            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-xl p-3 sm:p-4 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <Link
                  href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Image
                    src={original?.owner?.profilePhoto?.url}
                    alt="Shared Profile"
                    width={35}
                    height={35}
                    className="rounded-full object-cover w-8 h-8 sm:w-9 sm:h-9"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-900 dark:text-gray-100">{original?.owner?.username}</span>
                    <span className="text-gray-500 text-xs">{original?.owner?.profileName}</span>
                  </div>
                </Link>
                <span className="text-gray-500 text-xs">{new Date(original?.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic whitespace-pre-wrap">
                <RenderPostText text={original?.text} mentions={original?.mentions} hashtags={original?.Hashtags} />
              </p>
              {original?.Photos?.length > 0 && (
                <PostPhotos photos={original.Photos} setImageView={setImageView} postId={original._id} />
              )}
            </div>
          )}

          {/* Photos */}
          {!isShared && post.Photos?.length > 0 && (
            <PostPhotos photos={post.Photos} setImageView={setImageView} postId={post._id} />
          )}

          {/* Actions */}
          {isLogin && (
            <div className="flex flex-wrap gap-4 sm:gap-8 pt-4 justify-around sm:justify-start">
              <ActionIcon condition={post.hahas?.includes(user?._id)} onClick={() => likePost(post._id, post.owner._id)} Icon={post.likes?.includes(user?._id) ? IoIosHeart : CiHeart} count={post.likes?.length} active={post.likes?.includes(user?._id)} />
              <ActionIcon condition={post.likes?.includes(user?._id)} onClick={() => hahaPost(post._id)} Icon={LuLaugh} count={post.hahas?.length} activeHaha={post.hahas?.includes(user?._id)} />
              {!post.isCommentOff && <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />}
              <ActionIcon onClick={() => sharePost(post._id)} Icon={IoIosShareAlt} count={post.shares?.length} />
              <ActionIcon onClick={() => savePost(post._id)} Icon={CiBookmark} count={post.saved?.length} active={post.saved?.includes(user?._id)} />
              {user?._id === post.owner?._id && (
                <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
                  <BsEye />
                  <span>{post?.views?.length || 0}</span>
                </div>
              )}
            </div>
          )}

          {/* Add Comment */}
          {!post.isCommentOff && isLogin && (
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Image
                src={user?.profilePhoto?.url || '/default-profile.png'}
                alt="User Profile"
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover"
              />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent text-sm resize-none outline-none placeholder-gray-400 dark:placeholder-gray-500 w-full sm:w-auto"
                rows={1}
              />
              <button onClick={handleAddComment} className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition self-end sm:self-auto">
                <IoIosSend className="text-white text-lg" />
              </button>
            </div>
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
  )
}

const ActionIcon = ({ Icon, count, onClick, active, activeHaha , condition }) => (
  <motion.button 
    onClick={onClick} 
    whileTap={{ scale: 0.9 }} 
    className={`${condition ? "hidden" : "flex"} items-center gap-2 cursor-pointer min-w-[70px] justify-center sm:justify-start`}
  >
    <Icon className={`text-2xl ${activeHaha ? 'text-yellow-500' : ''} ${active ? 'text-red-500' : 'text-gray-400'}`} />
    <span className="text-gray-400 text-xs sm:text-sm">{count}</span>
  </motion.button>
);

export default DesignPostSelect;
