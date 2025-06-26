'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosShareAlt, IoIosSend, IoIosHeart } from "react-icons/io";
import { usePost } from '@/app/Context/PostContext';
import { useComment } from '@/app/Context/CommentContext';
import Comment from '@/app/Component/Comment';
import { useAuth } from '@/app/Context/AuthContext';
import Loading from '@/app/Component/Loading';
import PostMenu from '@/app/Component/PostMenu';

const Page = ({ params }) => {
  const id = params.id;
  const [post, setPost] = React.useState({});
  const [comment, setComment] = React.useState('');
  const {user} = useAuth()
  const { posts , likePost , savePost, sharePost } = usePost();
  const { AddComment } = useComment();
  const [loading, setLoading] = useState(false)
  const [showMenu , setShowMenu] = useState(false)
  useEffect(() => {
    const matchedPost = posts.find((post) => post._id === id);
    if (matchedPost) {
      setPost(matchedPost);
    }
  }, [id, posts]);
  useEffect(() => {
    if (post) {
      setLoading(true)
    }
  },[post])
  return (
    <>
      {
        loading ?
          <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
            
            {/* Post Header */}
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
                  <span className="text-lg font-semibold text-lightMode-text dark:text-darkMode-text">{post?.owner?.username}</span>
                  <span className="text-sm text-gray-400">{post?.owner?.profileName}</span>
                </div>
              </div>
              <div className='relative'>
                <BsThreeDots onClick={() => setShowMenu(!showMenu)} className="text-gray-500 text-2xl cursor-pointer hover:text-lightMode-text dark:text-darkMode-text" />
                <PostMenu showMenu={showMenu} setShowMenu={setShowMenu} post={post}/>
              </div>
            </div>

            {/* Post Content */}
          <div className="bg-dark/40 p-4 rounded-xl shadow-md border border-gray-800">
            <p className="text-gray-200 text-base pb-3">{post?.text}</p>
            {post?.Photos &&
            <div className={post?.Photos.length > 1 ? 'grid grid-cols-2 gap-2' : ''}>
              {
                  post?.Photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={photo.url}
                      alt={`photo-${index}`}
                      width={500}
                      height={500}
                      className={`${post?.Photos.length > 1 ? 'w-full' : 'w-[500px]'} h-[500px] object-cover rounded-lg`}
                    />
                ))
              }
            </div>
            }
            <div className="text-sm text-gray-500 mt-2">{new Date(post?.createdAt).toDateString()}</div>

            {/* Shared Original Post */}
            {
              post?.originalPost && (
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
                      <span className="text-sm font-medium text-lightMode-text dark:text-darkMode-text">{post.originalPost?.owner?.username}</span>
                      <span className="text-xs text-gray-400">{post.originalPost?.owner?.profileName}</span>
                    </div>
                  </div>
                    <p className="text-sm text-gray-300">{post.originalPost?.text}</p>
                    {post.originalPost.Photos &&
                      <div className={post.originalPost.Photos.length > 1 ? 'grid grid-cols-2 gap-2' : ''}>
                        {
                            post.originalPost.Photos.map((photo, index) => (
                              <Image
                                key={index}
                                src={photo.url}
                                alt={`original-photo-${index}`}
                                width={500}
                                height={500}
                                className={`${post.originalPost.Photos.length > 1 ? 'w-full' : 'w-[500px]'} h-[500px] object-cover rounded-lg`}
                              />
                            ))
                        }
                      </div>}
                  <div className="text-xs text-gray-500 mt-2">{new Date(post.originalPost?.createdAt).toDateString()}</div>
                </div>
              )
            }
          </div>

            {/* Post Actions */}
            <div className="flex justify-around border-y border-gray-800 py-4">
              <div onClick={()=> likePost(post?._id)} className='flex cursor-pointer items-center gap-2'>
                  {
                    post?.likes?.includes(user?._id) ? (
                      <IoIosHeart className='text-red-500 text-xl'/>
                    ) : (
                      <CiHeart className='text-gray-500 text-xl'/>
                    )
                  }
                  <span className='text-gray-500 text-sm'>{post?.likes?.length}</span>
              </div>
              <IconWithLabel Icon={FaRegCommentDots} label={post?.comments?.length } />
              <IconWithLabel ClickFunc={()=> sharePost(post._id)} Icon={IoIosShareAlt} label={post?.shares?.length} />
              <div
                onClick={() => savePost(post._id)}
                className='flex cursor-pointer items-center gap-2'
              >
                <CiBookmark
                  className={`${
                    post?.saved?.includes(user._id) ? 'text-red-500' : 'text-gray-500'
                  } text-xl`}
                />
                <span className='text-gray-500 text-sm'>{post?.saved?.length}</span>
              </div>            
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-4 mt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-lightMode-text dark:text-darkMode-text px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
              />
              <IoIosSend
                onClick={() => AddComment(comment, post._id , post?.owner?._id)}
                className="text-blue-500 hover:text-blue-400 transition-all text-2xl cursor-pointer"
              />
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
              {post?.comments?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          </div>
          :
          <Loading/>
      }
    </>
  );
};

const IconWithLabel = ({ Icon, label , ClickFunc }) => (
  <div onClick={ClickFunc} className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
    <Icon className={`text-gray-400 text-xl group-hover:text-lightMode-text dark:text-darkMode-text`} />
    <span className="text-sm text-gray-400 group-hover:text-lightMode-text dark:text-darkMode-text">{label}</span>
  </div>
);

export default Page;
