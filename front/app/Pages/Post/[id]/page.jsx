'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosShareAlt, IoIosSend, IoIosHeart } from 'react-icons/io';
import { usePost } from '@/app/Context/PostContext';
import { useComment } from '@/app/Context/CommentContext';
import { useAuth } from '@/app/Context/AuthContext';
import Loading from '@/app/Component/Loading';
import PostMenu from '@/app/Component/PostMenu';
import Comment from '@/app/Component/Comment';
import CommentSkeleton from '@/app/Skeletons/CommentSkeleton';
import { motion } from 'framer-motion';

const Page = ({ params }) => {
  const id = params.id;
  const [post, setPost] = useState({});
  const [commentText, setCommentText] = useState('');
  const { user, isLogin } = useAuth();
  const { posts, likePost, savePost, sharePost, setImageView } = usePost();
  const { comments, AddComment, fetchCommentsByPostId, isLoading } = useComment();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const matchedPost = posts.find((p) => p?._id === id);
    if (matchedPost) setPost(matchedPost);
  }, [id, posts]);

  useEffect(() => {
    if (post?._id) {
      fetchCommentsByPostId(post?._id);
      setLoading(true);
    }
  }, [post]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    AddComment(commentText, post?._id, post?.owner?._id);
    setCommentText('');
  };

  return loading ? (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={post?.owner?.profilePhoto?.url}
            alt="profile"
            width={50}
            height={50}
            className="rounded-full object-cover w-12 h-12"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-lightMode-text dark:text-darkMode-text">
              {post?.owner?.username}
            </span>
            <span className="text-sm text-gray-400">{post?.owner?.profileName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLogin && user?._id !== post?.owner?._id && (
            <button className="px-3 py-1 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-500 transition">
              Follow
            </button>
          )}
          <div className="relative">
            <BsThreeDots
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 text-2xl cursor-pointer hover:text-lightMode-text dark:hover:text-darkMode-text"
            />
            <PostMenu showMenu={showMenu} setShowMenu={setShowMenu} post={post} />
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="bg-dark/40 p-4 rounded-2xl shadow-lg border border-gray-800">
        <p className="text-lightMode-fg dark:text-darkMode-fg text-base pb-3 leading-relaxed">
          {post?.text}
        </p>

        {/* Photos */}
        {post?.Photos?.length > 0 && (
          <div
            className={`$ {
              post?.Photos.length > 1 ? 'grid grid-cols-2 gap-2' : 'flex justify-center'
            }`}
          >
            {post?.Photos.map((photo, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => setImageView({ url: photo?.url, postId: post?._id })}
                className="cursor-pointer"
              >
                <Image
                  src={photo?.url}
                  alt={`photo-${index}`}
                  width={500}
                  height={500}
                  className="w-full h-[400px] object-cover rounded-xl"
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mt-2">
          {new Date(post?.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Actions */}
      {isLogin && (
        <div className="flex justify-around border-y border-gray-800 py-3">
          <ActionIcon
            onClick={() => likePost(post?._id, post?.owner?._id)}
            Icon={post?.likes?.includes(user?._id) ? IoIosHeart : CiHeart}
            count={post?.likes?.length}
            className={post?.likes?.includes(user?._id) ? 'text-red-500' : ''}
          />
          <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />
          <ActionIcon
            onClick={() => sharePost(post?._id)}
            Icon={IoIosShareAlt}
            count={post?.shares?.length}
          />
          <ActionIcon
            onClick={() => savePost(post?._id)}
            Icon={CiBookmark}
            count={post?.saved?.length}
            className={post?.saved?.includes(user?._id) ? 'text-yellow-500' : ''}
          />
        </div>
      )}

      {/* Comment input */}
      {!post?.isCommentOff && isLogin && (
        <div className="flex items-center gap-3 mt-3">
          <Image
            src={user?.profilePhoto?.url}
            alt="me"
            width={35}
            height={35}
            className="rounded-full object-cover w-9 h-9"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-lightMode-bg border border-gray-700 dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
          />
          <IoIosSend
            onClick={handleAddComment}
            className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer"
          />
        </div>
      )}

      {/* Comments */}
      <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
        {post?.isCommentOff ? (
          <div className="text-sm text-gray-500 text-center">comments are off</div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
        ) : comments.length > 0 ? (
          comments.slice(0, 3).map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">no comments</p>
        )}

        {comments.length > 3 && (
          <button className="text-blue-500 text-sm self-center hover:underline">
            show All Comments
          </button>
        )}
      </div>
    </motion.div>
  ) : (
    <Loading />
  );
};

const ActionIcon = ({ Icon, count, onClick, className }) => (
  <motion.div
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    className="flex items-center gap-2 cursor-pointer"
  >
    <Icon className={`text-xl text-gray-400 ${className || ''}`} />
    <span className="text-sm text-lightMode-text dark:text-darkMode-text">{count}</span>
  </motion.div>
);

export default Page;
