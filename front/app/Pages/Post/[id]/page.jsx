'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosShareAlt, IoIosHeart, IoIosSend } from 'react-icons/io';
import { BsThreeDots, BsEye } from 'react-icons/bs';
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
  const { posts, likePost, savePost, sharePost, setImageView, viewPost } = usePost();
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

  useEffect(() => {
    if (post?._id) {
      viewPost(post._id);
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
      className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tags */}
      <div className="flex gap-2">
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
      {isShared && (
        <div className="text-sm text-gray-800 dark:text-gray-200 italic">
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

      {/* Post Card */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 transition-transform hover:scale-[1.01]">
        
        {/* Profile */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Image
            src={isCommunityPost ? post.community?.Picture?.url : post.owner?.profilePhoto?.url}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full w-12 h-12 object-cover"
          />
          <div className="border-l border-gray-400 h-full w-1 mt-2 hidden sm:block"></div>
        </div>

        <div className="flex-1 flex flex-col gap-3">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              {isCommunityPost ? (
                <div className="flex flex-col text-sm">
                  <Link href={`/Pages/Community/${post.community?._id}`} className="font-semibold hover:underline text-gray-900 dark:text-gray-100">
                    {post.community?.Name}
                  </Link>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>@{post.owner?.username}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
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
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{post.owner?.profileName}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="relative">
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
          {post.text && <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{post.text}</p>}

          {/* Shared Original */}
          {isShared && original && (
            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <Link
                  href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Image
                    src={original?.owner?.profilePhoto?.url}
                    alt="Shared Profile"
                    width={35}
                    height={35}
                    className="rounded-full object-cover w-9 h-9"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-900 dark:text-gray-100">{original?.owner?.username}</span>
                    <span className="text-gray-500 text-xs">{original?.owner?.profileName}</span>
                  </div>
                </Link>
                <span className="text-gray-500 text-xs">{new Date(original?.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic whitespace-pre-wrap">{original?.text}</p>
              {original?.Photos?.length > 0 && (
                <div className={`grid gap-2 ${original.Photos.length === 1 ? 'grid-cols-1' : original.Photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {original.Photos.map((photo, i) => (
                    <motion.div key={i} onClick={() => setImageView({ url: photo?.url, postId: original._id })} className="cursor-pointer rounded-xl overflow-hidden">
                      <Image src={photo?.url} alt={`photo-${i}`} width={500} height={500} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {!isShared && post.Photos?.length > 0 && (
            <div className={`grid gap-2 ${post.Photos.length === 1 ? 'grid-cols-1' : post.Photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {post.Photos.map((photo, i) => (
                <motion.div key={i} onClick={() => setImageView({ url: photo?.url, postId: post._id })} className="cursor-pointer rounded-xl overflow-hidden">
                  <Image src={photo?.url} alt={`photo-${i}`} width={500} height={500} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          {isLogin && (
            <div className="flex items-center gap-6 pt-4 justify-around sm:justify-start sm:gap-10">
              <ActionIcon onClick={() => likePost(post._id, post.owner._id)} Icon={post.likes?.includes(user?._id) ? IoIosHeart : CiHeart} count={post.likes?.length} active={post.likes?.includes(user?._id)} />
              {!post.isCommentOff && <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />}
              <ActionIcon onClick={() => sharePost(post._id)} Icon={IoIosShareAlt} count={post.shares?.length} />
              <ActionIcon onClick={() => savePost(post._id)} Icon={CiBookmark} count={post.saved?.length} active={post.saved?.includes(user?._id)} />
              {/* Views for owner */}
              {user?._id === post.owner?._id && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <BsEye />
                  <span>{post?.views?.length || 0}</span>
                </div>
              )}
            </div>
          )}

          {/* Add Comment */}
          {!post.isCommentOff && isLogin && (
            <div className="flex items-center gap-3 mt-3">
              <Image src={user?.profilePhoto?.url} alt="me" width={35} height={35} className="rounded-full object-cover w-9 h-9" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white/20 dark:bg-black/20 border border-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
              />
              <IoIosSend onClick={handleAddComment} className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer" />
            </div>
          )}

          {/* Comments List */}
          <div className="flex flex-col gap-4 border-t border-gray-700 pt-6">
            {post.isCommentOff ? (
              <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg border border-gray-700 text-gray-400">
                <p>Comments are turned off</p>
              </div>
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
            ) : comments?.length > 0 ? (
              comments.map((comment) => <Comment key={comment._id} comment={comment} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg border border-gray-700 text-gray-400">
                <p>No comments yet</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const ActionIcon = ({ Icon, count, onClick, active }) => (
  <motion.div onClick={onClick} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 cursor-pointer">
    <Icon className={`text-2xl ${active ? 'text-red-500' : 'text-gray-400'}`} />
    <span className="text-gray-400 text-sm">{count}</span>
  </motion.div>
);

export default PostPage;
