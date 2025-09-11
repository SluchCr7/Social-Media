'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosShareAlt, IoIosHeart, IoIosSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { usePost } from '@/app/Context/PostContext';
import { useAuth } from '@/app/Context/AuthContext';
import { useComment } from '@/app/Context/CommentContext';
import PostMenu from '@/app/Component/PostMenu';
import Comment from '@/app/Component/Comment';
import CommentSkeleton from '@/app/Skeletons/CommentSkeleton';
import Loading from '@/app/Component/Loading';

const PostPage = ({ params }) => {
  const id = params.id;
  const { user, isLogin } = useAuth();
  const { posts, likePost, savePost, sharePost, setImageView } = usePost();
  const { comments, AddComment, fetchCommentsByPostId, isLoading } = useComment();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const matchedPost = posts.find(p => p?._id === id);
    if (matchedPost) setPost(matchedPost);
  }, [id, posts]);

  useEffect(() => {
    if (post?._id) {
      fetchCommentsByPostId(post._id);
      setLoading(false);
    }
  }, [post]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    AddComment(commentText, post._id, post.owner._id);
    setCommentText('');
  };

  if (!post) return <Loading />;

  const isShared = post.isShared && post.originalPost;
  const original = post.originalPost;
  const isCommunityPost = post.community !== null;

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Pinned / Shared Tags */}
      {post.isPinned && (
        <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
          📌 Pinned Post
        </div>
      )}
      {isShared && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
          🔁 Shared Post
        </div>
      )}

      {/* Shared By Info */}
      {isShared && (
        <div className="text-sm text-gray-900 dark:text-gray-300 italic mb-2">
          <Link
            href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
            className="font-semibold hover:underline"
          >
            {post.owner.username}
          </Link>{' '}
          shared a post from{' '}
          <Link
            href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
            className="font-semibold hover:underline"
          >
            {original?.owner?.username}
          </Link>
        </div>
      )}

      <div className="flex items-start gap-4 bg-white dark:bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition hover:scale-[1.01]">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <Image
            src={isCommunityPost ? post.community?.Picture?.url : post.owner?.profilePhoto?.url}
            alt={isCommunityPost ? "community-profile" : "user-profile"}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 aspect-square object-cover"
          />
          <div className="border border-gray-600 h-[80px] w-[1px] mt-2"></div>
        </div>

        <div className="flex flex-col w-full gap-3">
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-tight">
                {isCommunityPost ? (
                  <>
                    <Link
                      href={`/Pages/Community/${post.community?._id}`}
                      className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline"
                    >
                      {post.community?.Name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>@{post.owner?.username}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
                      className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline"
                    >
                      {post.owner?.username}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.owner?.profileName}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Menu */}
            {isLogin && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl text-gray-500 hover:text-gray-700 transition"
                >
                  <BsThreeDots />
                </button>
                <PostMenu post={post} showMenu={showMenu} setShowMenu={setShowMenu} />
              </div>
            )}
          </div>

          {/* Post Text */}
          {post.text && (
            <p className="text-sm text-gray-600 dark:text-gray-200 break-all whitespace-pre-wrap">
              {post.text}
            </p>
          )}

          {/* Original Shared Post */}
          {isShared && original && (
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-3 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-400">
              <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center">
                <Link
                  href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                  className="text-darkMode-fg font-semibold text-sm hover:underline flex items-center gap-2"
                >
                  <Image
                    src={original?.owner?.profilePhoto?.url}
                    alt="Shared_profile_post"
                    width={500}
                    height={500}
                    className="rounded-full w-7 h-7 aspect-square object-cover"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-black dark:text-white text-base">{original?.owner?.username}</span>
                    <span className="text-gray-500 text-xs">({original?.owner?.profileName})</span>
                  </div>
                </Link>
                <span className="text-gray-500 text-xs">{new Date(original?.createdAt).toDateString()}</span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 italic break-all whitespace-pre-wrap">
                {original?.text}
              </p>

              {original?.Photos?.length > 0 && (
                <div className={`grid gap-2 ${original.Photos.length > 1 ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                  {original.Photos.map((photo, i) => (
                    <motion.div key={i} onClick={() => setImageView({ url: photo?.url, postId: original._id })} className="cursor-pointer overflow-hidden rounded-xl">
                      <Image src={photo?.url} alt={`photo-${i}`} width={500} height={500} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Photos */}
          {!isShared && post.Photos?.length > 0 && (
            <div className={`grid gap-2 ${post.Photos.length > 1 ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {post.Photos.map((photo, i) => (
                <motion.div key={i} onClick={() => setImageView({ url: photo?.url, postId: post._id })} className="cursor-pointer overflow-hidden rounded-xl">
                  <Image src={photo?.url} alt={`photo-${i}`} width={500} height={500} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          {isLogin && (
            <div className="flex items-center gap-6 pt-4 w-full justify-around">
              <ActionIcon onClick={() => likePost(post._id, post.owner._id)} Icon={post.likes?.includes(user?._id) ? IoIosHeart : CiHeart} count={post.likes?.length} className={post.likes?.includes(user?._id) ? 'text-red-500' : ''} />
              {!post.isCommentOff && <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />}
              <ActionIcon onClick={() => sharePost(post._id)} Icon={IoIosShareAlt} count={post.shares?.length} />
              <ActionIcon onClick={() => savePost(post._id)} Icon={CiBookmark} count={post.saved?.length} className={post.saved?.includes(user?._id) ? 'text-yellow-400' : ''} />
            </div>
          )}

          {/* Add Comment Input */}
          {!post.isCommentOff && isLogin && (
            <div className="flex items-center gap-3 mt-3">
              <Image src={user?.profilePhoto?.url} alt="me" width={35} height={35} className="rounded-full object-cover w-9 h-9" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-lightMode-bg border border-gray-700 dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
              />
              <IoIosSend onClick={handleAddComment} className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer" />
            </div>
          )}

          {/* Comments List */}
          <div className="flex flex-col gap-4 border-t border-gray-700 pt-6">
            {post.isCommentOff ? (
              <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg border border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                  />
                </svg>
                <p className="text-gray-400 text-sm font-medium">
                  Comments are turned off
                </p>
              </div>
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
            ) : comments?.length > 0 ? (
              comments.map((comment) => <Comment key={comment._id} comment={comment} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg border border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                  />
                </svg>
                <p className="text-gray-400 text-sm font-medium">
                  No comments yet
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const ActionIcon = ({ Icon, count, onClick, className }) => (
  <motion.div onClick={onClick} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 cursor-pointer">
    <Icon className={`text-2xl text-gray-400 ${className || ''}`} />
    <span className="text-gray-400 text-sm">{count}</span>
  </motion.div>
);

export default PostPage;
