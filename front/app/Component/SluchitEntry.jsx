
'use client'
import React, { forwardRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart, CiBookmark } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoIosShareAlt, IoIosHeart } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import { LuLaugh } from "react-icons/lu";
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import PostMenu from './PostMenu'
import EditPostModal from './EditPostModel'
import { useReport } from '../Context/ReportContext'
import { renderTextWithMentionsAndHashtags } from '../utils/CheckText'
import { BiRepost } from "react-icons/bi";
import { ShareModal } from './SharePost'
import { getHighlightedComment } from '../utils/getHighlitedComment';
import UserHoverCard from './UserHoverCard'
import { FaFaceGrinSquintTears } from "react-icons/fa6";
import RenderPostText from './Post/RenderText';
import PostActions from './Post/PostActions';
import PostPhotos from './Post/PostPhotos';

const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost,hahaPost, savePost, sharePost, setPostIsEdit, imageView, setImageView } = usePost();
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLogin } = useAuth();
  const [openModel, setOpenModel] = useState(false);
  const isShared = post?.isShared && post?.originalPost;
  const original = post?.originalPost;
  const isCommunityPost = post?.community !== null;
  const isInCommunityPage = typeof window !== 'undefined' && window.location.href.includes('/Pages/Community/');
  const highlightedComment = getHighlightedComment(post);

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
                    <UserHoverCard userSelected={post?.owner}>
                      <Link
                        href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}
                        className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline"
                      >
                        {post?.owner?.username}
                      </Link>
                    </UserHoverCard>
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
            {isShared && (
              <RenderPostText
                text={post?.text} 
                mentions={post?.mentions} 
                hashtags={post?.Hashtags} 
              />
            )}

            {/* Original Post Content */}
            {isShared && original && (
              <Link href={`/Pages/Post/${original?._id}`} className='bg-white/40 dark:bg-white/5 backdrop-blur-md 
                              border border-gray-200/40 dark:border-gray-700/40 
                              rounded-xl p-4 flex flex-col gap-3 
                              shadow-md hover:shadow-lg transition-all duration-300 
                              border-l-4 border-blue-400'>

                <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4'>
                  <Link
                    href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                    className='flex items-center gap-3 hover:underline'
                  >
                    <Image
                      src={original?.owner?.profilePhoto?.url}
                      alt='Shared_profile_post'
                      width={50}
                      height={50}
                      className='w-12 h-12 rounded-full object-cover border-2 border-blue-400'
                    />
                    <div className='flex flex-col'>
                      <span className='font-semibold text-gray-900 dark:text-white'>{original?.owner?.username}</span>
                      <span className='text-gray-500 text-xs'>{original?.owner?.profileName}</span>
                    </div>
                  </Link>
                  <span className='text-gray-400 text-xs whitespace-nowrap'>
                    {new Date(original?.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {/* Original Post Content */}
                {isShared && (
                  <RenderPostText
                    text={original?.text}
                    mentions={original?.mentions}
                    hashtags={original?.Hashtags}
                    italic={true}
                  />
                )}


                {original?.Photos && (
                  <PostPhotos photos={original?.Photos} setImageView={setImageView} postId={original?._id} />
                )}
              </Link>
            )}

            {/* Normal Post Text */}
            {!isShared &&
              <RenderPostText
                text={post?.text} 
                mentions={post?.mentions} 
                hashtags={post?.Hashtags} 
              />
            }


            {/* Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {post?.Hashtags.map((tag, i) => (
                  <Link href={`/Pages/Hashtag/${encodeURIComponent(tag)}`} key={i} className='bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full'>
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Post Photos */}
            {!isShared && post?.Photos && (
              <PostPhotos photos={post?.Photos} setImageView={setImageView} postId={post?._id} />
            )}

            {/* Actions */}
            {isLogin && (
              <PostActions
                post={post}
                user={user}
                likePost={likePost}
                hahaPost={hahaPost}
                sharePost={sharePost}
                savePost={savePost}
                setOpenModel={setOpenModel}
              />
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
            {/* Self Reply Preview */}
            {highlightedComment && (
              <div className="mt-4 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                <div className="flex items-start gap-3">
                  <Image
                    src={highlightedComment?.owner?.profilePhoto?.url || "/default-avatar.png"}
                    alt="comment-user"
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover border border-gray-300 dark:border-gray-600"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {highlightedComment?.owner?.username}
                      </span>
                       {highlightedComment?.label && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          {highlightedComment?.label}
                        </span>
                      )} 
                    </div>

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-snug">
                      {highlightedComment?.text}
                    </p>
                  </div>
                </div>
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
