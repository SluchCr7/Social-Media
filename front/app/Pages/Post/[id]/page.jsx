'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { CiHeart, CiBookmark } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoIosShareAlt, IoIosSend, IoIosHeart } from 'react-icons/io';
import { usePost } from '@/app/Context/PostContext';
import { useComment } from '@/app/Context/CommentContext';
import Comment from '@/app/Component/Comment';
import { useAuth } from '@/app/Context/AuthContext';
import Loading from '@/app/Component/Loading';
import PostMenu from '@/app/Component/PostMenu';
import { generateMeta } from '@/app/utils/MetaDataHelper';
import CommentSkeleton from '@/app/Skeletons/CommentSkeleton';


const Page = ({ params }) => {
  const id = params.id;
  const [post, setPost] = useState({});
  const [commentText, setCommentText] = useState('');
  const { user , isLogin } = useAuth();
  const { posts, likePost, savePost, sharePost  , setImageView} = usePost();
  const { comments, AddComment, fetchCommentsByPostId , isLoading} = useComment();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // الحصول على البوست الحالي
  useEffect(() => {
    const matchedPost = posts.find((post) => post?._id === id);
    if (matchedPost) {
      setPost(matchedPost);
    }
  }, [id, posts]);

  // عند تعيين البوست، اجلب التعليقات الخاصة به
  useEffect(() => {
    if (post?._id) {
      fetchCommentsByPostId(post?._id);
      setLoading(true);
    }
  }, [post]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    AddComment(commentText, post?._id, post?.owner?._id); // parent = null
    setCommentText('');
  };

  return loading ? (
    <div className="w-full mx-auto px-4 py-6 flex flex-col gap-6">
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
        <div className="relative">
          <BsThreeDots
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 text-2xl cursor-pointer hover:text-lightMode-text dark:text-darkMode-text"
          />
          <PostMenu showMenu={showMenu} setShowMenu={setShowMenu} post={post} />
        </div>
      </div>

      {/* Post content */}
      <div className="bg-dark/40 p-4 rounded-xl shadow-md border border-gray-800">
        <p className="text-lightMode-fg dark:text-darkMode-fg text-base pb-3">{post?.text}</p>
        {post?.Photos?.length > 0 && (
          <div className={post?.Photos.length > 1 ? 'grid grid-cols-2 gap-2' : ''}>
            {post?.Photos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setImageView({ url: photo?.url, postId: post?._id })}
                  className="cursor-pointer"
                >
                  <Image
                    src={photo?.url}
                    alt={`photo-${index}`}
                    width={500}
                    height={500}
                    className={`${post?.Photos.length > 1 ? 'w-full' : 'w-[500px]'} h-[500px] object-cover rounded-lg`}
                  />
                </div>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-500 mt-2">{new Date(post?.createdAt).toDateString()}</div>

        {/* If post is shared */}
        {post?.originalPost && (
          <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={post.originalPost?.owner?.profilePhoto?.url}
                alt="original user"
                width={35}
                height={35}
                className="rounded-full object-cover w-9 h-9"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-lightMode-text dark:text-darkMode-text">
                  {post.originalPost?.owner?.username}
                </span>
                <span className="text-xs text-gray-400">{post.originalPost?.owner?.profileName}</span>
              </div>
            </div>
            <p className="text-sm text-gray-300">{post.originalPost?.text}</p>
            {post.originalPost?.Photos?.length > 0 && (
              <div
                className={post?.originalPost?.Photos?.length > 1 ? 'grid grid-cols-2 gap-2' : ''}
              >
                {post?.originalPost?.Photos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => setImageView({ url: photo?.url, postId: post?._id })}
                    className="cursor-pointer"
                  >
                    <Image
                      src={photo?.url}
                      alt={`photo-${index}`}
                      width={500}
                      height={500}
                      className={`${post?.Photos.length > 1 ? 'w-full' : 'w-[500px]'} h-[500px] object-cover rounded-lg`}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {new Date(post.originalPost?.createdAt).toDateString()}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-around border-y border-gray-800 py-4">
        <ActionIcon
          onClick={() => likePost(post?._id, post?.owner?._id)}
          Icon={post?.likes?.includes(user?._id) ? IoIosHeart : CiHeart}
          count={post?.likes?.length}
          className={post?.likes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'}
        />
        <ActionIcon Icon={FaRegCommentDots} count={comments?.length} />
        <ActionIcon onClick={() => sharePost(post?._id)} Icon={IoIosShareAlt} count={post?.shares?.length} />
        <ActionIcon
          onClick={() => savePost(post?._id)}
          Icon={CiBookmark}
          count={post?.saved?.length}
          className={post?.saved?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'}
        />
      </div>

      {/* Comment input */}
      {!post?.isCommentOff && isLogin && (
        <div className="flex items-center gap-4 mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-lightMode-bg border border-gray-800 dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4 py-2 rounded-lg  outline-none focus:ring-2 focus:ring-blue-600"
          />
          <IoIosSend
            onClick={handleAddComment}
            className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer"
          />
        </div>
      )}
      {
        post?.isCommentOff ?
          <div className="flex flex-col gap-4 border-t border-gray-800 pt-4 items-center w-full justify-center min-h-[50vh]">
            <div className="text-sm text-gray-500">Comments are currently disabled</div>
          </div>
        :
        <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No comments Found</p>
          )}
        </div>

      }
    </div>
  ) : (
    <Loading />
  );
};

const ActionIcon = ({ Icon, count, onClick, className }) => (
  <div onClick={onClick} className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
    <Icon className={`text-xl ${className || 'text-gray-400'}`} />
    <span className="text-sm text-lightMode-text dark:text-darkMode-text">{count}</span>
  </div>
);

export default Page;

