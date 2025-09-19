
'use client'
import React, { forwardRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import PostMenu from './PostMenu'
import EditPostModal from './EditPostModel'
import { useReport } from '../Context/ReportContext'
import { renderTextWithMentionsAndHashtags } from '../utils/CheckText'
import { BiRepost } from "react-icons/bi";
import { ShareModal } from './SharePost'

const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost, savePost, sharePost, setPostIsEdit, imageView, setImageView } = usePost();
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLogin } = useAuth();
  const [openModel, setOpenModel] = useState(false);
  const isShared = post?.isShared && post?.originalPost;
  const original = post?.originalPost;
  const isCommunityPost = post?.community !== null;
  const isInCommunityPage = typeof window !== 'undefined' && window.location.href.includes('/Pages/Community/');

  return (
    <div ref={ref} className='relative w-full'>
      <ShareModal 
        post={post} 
        isOpen={openModel} 
        onClose={() => setOpenModel(false)} 
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
      />    
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-gray-700 w-[90%] md:w-full mx-auto p-6 rounded-2xl flex flex-col gap-5 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        {/* Pinned or Shared Tags */}
        {post?.isPinned && (
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
          <div className='text-sm text-gray-900 dark:text-gray-300 italic mb-2'>
            <Link
              href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}
              className='text-lightMode-fg dark:text-darkMode-fg font-semibold'
            >
              {post?.owner?.username}
            </Link>{' '}
            shared a post from{' '}
            <Link
              href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
              className='text-lightMode-fg dark:text-darkMode-fg font-semibold'
            >
              {original?.owner?.username}
            </Link>
          </div>
        )}

        <div className='flex items-start gap-4'>
          {/* Profile Image */}
          <div className='flex flex-col items-center'>
            {isCommunityPost && !isInCommunityPage ? (
              <Image
                src={post?.community?.Picture?.url}
                alt='community-profile'
                width={40}
                height={40}
                className="rounded-full w-10 h-10 min-w-10 aspect-square object-cover"
              />
            ) : (
              <Image
                  src={post?.owner?.profilePhoto?.url}
                  alt='user-profile'
                  width={40}
                  height={40}
                  className={` ${post?.owner?.stories?.length > 0 ? 'animate-pulse' : ''} rounded-full w-10 h-10 min-w-10 aspect-square object-cover `}
              />
            )}
            <div className='border border-gray-600 h-[80px] w-[1px] mt-2'></div>
          </div>

          <div className='flex flex-col w-full gap-3'>
            {/* Header Info */}
            <div className="flex justify-between items-center w-full">
              {/* Left Side */}
              <div className="flex items-center gap-3">
                {/* Owner Info */}
                {isCommunityPost && !isInCommunityPage ? (
                  <div className="flex flex-col leading-tight">
                    <Link
                      href={`/Pages/Community/${post?.community?._id}`}
                      className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline"
                    >
                      {post?.community?.Name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>@{post?.owner?.username}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col leading-tight">
                    <Link
                      href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}
                      className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline"
                    >
                      {post?.owner?.username}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post?.owner?.profileName}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Menu */}
              {isLogin && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl text-gray-500 hover:text-gray-700 transition"
                  >
                    <BsThreeDots />
                  </button>

                  <PostMenu
                    post={post}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                  />
                </div>
              )}

            </div>

            {/* Shared Post Text */}
            {isShared && post?.text && (() => {
              const isArabic = /[\u0600-\u06FF]/.test(post?.text);
              return (
                <p
                  className={`text-sm break-all whitespace-pre-wrap ${
                    isArabic ? 'text-right' : 'text-left'
                  } text-gray-600 dark:text-gray-200`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {renderTextWithMentionsAndHashtags(post?.text, post?.mentions || [], post?.Hashtags || [])}
                </p>
              );
            })()}


            {/* Original Post Content */}
            {isShared && original && (
              <Link href={`/Pages/Post/${original?._id}`} className='bg-white/40 dark:bg-white/5 backdrop-blur-md 
                              border border-gray-200/40 dark:border-gray-700/40 
                              rounded-xl p-4 flex flex-col gap-3 
                              shadow-md hover:shadow-lg transition-all duration-300 
                              border-l-4 border-blue-400'>

                <div className='flex flex-col items-start md:flex-row md:justify-between md:items-center'>
                  <Link
                    href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                    className='text-darkMode-fg font-semibold text-sm hover:underline flex items-center gap-2'
                  >
                    <Image src={original?.owner?.profilePhoto?.url} alt='Shared_profile_post' width={500} height={500} className='rounded-full w-7 h-7 aspect-square object-cover'/>
                    <div className='flex items-start flex-col md:items-center md:flex-row gap-[2px] md:gap-[4px]'>
                      <span className='text-black dark:text-white text-base'>{original?.owner?.username}{' '}</span>
                      <span className='text-gray-500 text-xs pt-1'>{original?.owner?.profileName}</span>
                    </div>
                  </Link>
                  <span className='text-gray-500 text-xs'>{new Date(original?.createdAt).toDateString()}</span>
                </div>

                {/* Original Post Content */}
                {original?.text && (() => {
                  const isArabic = /[\u0600-\u06FF]/.test(original?.text);
                  return (
                    <p
                      className={`text-sm italic break-all whitespace-pre-wrap ${
                        isArabic ? 'text-right' : 'text-left'
                      } text-gray-700 dark:text-gray-300`}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      {renderTextWithMentionsAndHashtags(original?.text, original?.mentions || [], original?.Hashtags || [])}
                    </p>
                  );
                })()}


                {original?.Photos && (
                  <div className={`grid gap-2 ${original?.Photos.length > 1 ? 'grid-cols-2 sm:grid-cols-2' : ''}`}>
                    {original?.Photos?.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => setImageView({ url: photo?.url, postId: original?._id })}
                        className="cursor-pointer"
                      >
                        <Image
                          src={photo?.url}
                          alt={`photo-${index}`}
                          width={500}
                          height={500}
                          className="w-full max-h-[500px] object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            )}

            {/* Normal Post Text */}
            {!isShared && post?.text && (() => {
              const isArabic = /[\u0600-\u06FF]/.test(post?.text);
              return (
                <p
                  className={`text-sm break-all whitespace-pre-wrap ${
                    isArabic ? 'text-right' : 'text-left'
                  } text-gray-600 dark:text-gray-200`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {renderTextWithMentionsAndHashtags(post?.text, post?.mentions || [], post?.Hashtags || [])}
                </p>
              );
            })()}


            {/* Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {post?.Hashtags.map((tag, i) => (
                  <span key={i} className='bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full'>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Photos */}
            {!isShared && post?.Photos && (
              <div className={`grid gap-2 ${post?.Photos.length > 1 ? 'grid-cols-2 sm:grid-cols-2' : ''}`}>
                {post?.Photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setImageView({ url: photo?.url, postId: post?._id })}
                    className="cursor-pointer"
                  >
                    <Image
                      src={photo?.url}
                      alt={`photo-${i}`}
                      width={500}
                      height={500}
                      className="w-full max-h-[500px] object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {isLogin && (
              <div className='flex items-center gap-6 pt-4'>
                <div onClick={() => likePost(post?._id, post?.owner._id)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                  {post?.likes?.includes(user?._id) ? (
                    <IoIosHeart className='text-red-500 text-2xl' />
                  ) : (
                    <CiHeart className='text-gray-500 text-2xl' />
                  )}
                  <span className='text-gray-400 text-sm font-medium'>{post?.likes?.length}</span>
                </div>
                {!post?.isCommentOff && (
                  <Link href={`/Pages/Post/${post?._id}`} className='flex items-center gap-2 transition-all hover:scale-110'>
                    <FaRegCommentDots className='text-gray-500 text-xl' />
                    <span className='text-gray-400 text-sm font-medium'>{post?.comments?.length}</span>
                  </Link>
                )}
                <div 
                  onClick={() => sharePost(
                    post?.originalPost ? post?.originalPost?._id : post?._id, 
                    post?.owner?._id
                  )} 
                  className="flex items-center gap-2 cursor-pointer transition-all hover:scale-110"
                >
                  <IoIosShareAlt className="text-gray-500 text-2xl" />
                  {/* <span className="text-gray-400 text-sm font-medium">{post?.shares?.length}</span> */}
                </div>
                <div onClick={() => setOpenModel(true)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                  <BiRepost className='text-gray-500 text-2xl' />
                  {/* <span className='text-gray-400 text-sm font-medium'>{post?.shares?.length}</span> */}
                </div>

                <div onClick={() => savePost(post?._id)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                  <CiBookmark className={`${post?.saved?.includes(user?._id) ? 'text-yellow-400' : 'text-gray-500'} text-2xl`} />
                  <span className='text-gray-400 text-sm font-medium'>{post?.saved?.length}</span>
                </div>
              </div>
            )} 

            {/* Comment Avatars */}
            {post?.comments?.length > 0 && (
              <div className='flex items-center gap-2 pt-2'>
                <div className='flex -space-x-2'>
                  {post?.comments?.slice(0, 3).map((comment, i) => (
                    <Image
                      key={i}
                      src={comment?.owner?.profilePhoto?.url}
                      alt='comment-avatar'
                      width={24}
                      height={24}
                      className='rounded-full border-2 border-white dark:border-black w-6 h-6 object-cover'
                    />
                  ))}
                </div>
                <span className='text-gray-500 text-xs'>{post?.comments?.length} comments</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry
