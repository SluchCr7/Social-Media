// import React, { useState } from "react";
// import Link from 'next/link';
// import Image from 'next/image';
// import { CiHeart, CiBookmark } from 'react-icons/ci';
// import { FaRegCommentDots } from 'react-icons/fa';
// import { IoIosShareAlt, IoIosHeart, IoIosSend } from 'react-icons/io';
// import { BsThreeDots, BsEye } from 'react-icons/bs';
// import { motion } from 'framer-motion';
// import PostMenu from '@/app/Component/PostMenu';
// import Comment from '@/app/Component/Comment';
// import CommentSkeleton from '@/app/Skeletons/CommentSkeleton';
// import { LuLaugh } from "react-icons/lu";
// import PostPhotos from "@/app/Component/Post/PostPhotos";
// import RenderPostText from "@/app/Component/Post/RenderText";
// import SharedTitle from "@/app/Component/Post/SharedTitle";
// import { HiBadgeCheck } from "react-icons/hi";
// import PostLinks from "@/app/Component/Post/PostLinks";
// import PostHashtags from "@/app/Component/Post/PostHashtags";
// import SharedPost from "@/app/Component/Post/SharedPost";
// import PostImage from "@/app/Component/Post/PostImage";
// import PostActions from "@/app/Component/Post/PostActions";
// import ProfileHeader from "@/app/Component/UserComponents/ProfileHeader";
// import { ShareModal } from "@/app/Component/AddandUpdateMenus/SharePost";
// import PostHeader from "@/app/Component/Post/PostHeader";
// import { useTranslation } from "react-i18next";

// const DesignPostSelect = ({
//   post,
//   isShared,
//   original,
//   user,
//   isLogin,
//   isCommunityPost,
//   showMenu,
//   setShowMenu,
//   likePost,
//   sharePost,
//   hahaPost,
//   savePost,
//   setImageView,
//   comments,
//   isLoading,
//   commentText,
//   setCommentText,
//   handleAddComment,
//   openModel, setOpenModel,
//   canComment
// }) => {
//   const {t} = useTranslation()
//   return (
//     <div className="relative w-[90%] md:w-full mx-auto">
//       <ShareModal
//         post={post} 
//         isOpen={openModel} 
//         onClose={() => setOpenModel(false)} 
//         onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
//       /> 
//       <motion.div
//         className="w-full max-w-5xl mx-auto p-3 sm:p-6 flex flex-col gap-6"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {/* Tags */}
//         <div className="flex flex-wrap gap-2">
//           {post.isPinned && (
//             <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 rounded-full shadow-md">
//               📌 {t("Pinned")}
//             </span>
//           )}
//           {isShared && (
//             <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-md">
//               🔁 {t("Shared")}
//             </span>
//           )}
//         </div>

//         {/* Shared Info */}
//         {isShared && <SharedTitle user={user} post={post} original={original} />}

//         {/* Post Card */}
//         <div className="flex flex-row gap-4 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 transition-transform hover:scale-[1.01]">
          
//           {/* Profile */}
//           <PostImage
//             post={post}
//             isCommunityPost={isCommunityPost}
//           />

//           {/* Main Content */}
//           <div className="flex-1 flex flex-col gap-3">
//             <PostHeader
//               post={post}
//               user={post?.owner}
//               isLogin={isLogin}
//               showMenu={showMenu}
//               setShowMenu={setShowMenu}
//               isCommunityPost={isCommunityPost}
//             />
//             {/* Text */}
//             {post.text && (
//               <RenderPostText text={post.text} mentions={post.mentions} hashtags={post.Hashtags} />
//             )}
//             <PostLinks links={post?.links}/>

//             {/* Shared Original */}
//             {isShared && original && (
//               <SharedPost
//                 original={original}
//                 user={user}
//                 setImageView={setImageView}
//               />
//             )}

//             {/* Photos */}
//             {!isShared && post.Photos?.length > 0 && (
//               <PostPhotos photos={post.Photos} setImageView={setImageView} postId={post._id} />
//             )}
//             {/* 🔗 Hashtags */}
//             {post?.Hashtags?.length > 0 && (
//               <PostHashtags post={post} />
//             )}
//             {/* Actions */}
//             {isLogin && (
//               <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <PostActions
//                   post={post}
//                   user={user}
//                   likePost={likePost}
//                   hahaPost={hahaPost}
//                   sharePost={sharePost}
//                   savePost={savePost}
//                   setOpenModel={setOpenModel}
//                 />
//               </div>
//             )}

//             {!post.isCommentOff && isLogin && (
//               canComment() ? (
//                 <div className="flex items-start sm:items-center gap-3 mt-4 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-400 transition-all">
//                   {/* User Avatar */}
//                   <Image
//                     src={user?.profilePhoto?.url || '/default-profile.png'}
//                     alt="User Profile"
//                     width={40}
//                     height={40}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />

//                   {/* Textarea */}
//                   <div className="flex-1 relative">
//                     <textarea
//                       value={commentText}
//                       onChange={(e) => setCommentText(e.target.value)}
//                       placeholder={`${t("Write a comment")}...`}
//                       rows={1}
//                       onInput={(e) => {
//                         e.target.style.height = 'auto'
//                         e.target.style.height = `${e.target.scrollHeight}px`
//                       }}
//                       className="w-full bg-transparent text-[15px] resize-none outline-none placeholder-gray-400 dark:placeholder-gray-500 px-2 py-1 leading-snug text-gray-800 dark:text-gray-100 min-h-[38px] max-h-[160px] overflow-y-auto"
//                     />
//                   </div>

//                   {/* Send Button */}
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleAddComment}
//                     disabled={!commentText.trim()}
//                     className={`p-2.5 rounded-full transition-all ${
//                       commentText.trim()
//                         ? 'bg-blue-500 hover:bg-blue-400'
//                         : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
//                     }`}
//                   >
//                     <IoIosSend className="text-white text-lg" />
//                   </motion.button>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl text-sm text-yellow-800 dark:text-yellow-300">
//                   {t("You must follow or be followed by")} @{post.owner?.username} to comment on this post.
//                 </div>
//               )
//             )}

//             {/* Comments List */}
//             <div className="flex flex-col gap-4 border-t border-gray-700 pt-6">
//               {post.isCommentOff ? (
//                 <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
//                   <p>{t("Comments are turned off")}</p>
//                 </div>
//               ) : isLoading ? (
//                 Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
//               ) : comments?.length > 0 ? (
//                 comments.map((comment) => <Comment key={comment._id} comment={comment} />)
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
//                   <p>{t("No comments yet")}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default DesignPostSelect;

import React from "react";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoIosSend } from 'react-icons/io';
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
import Comment from "@/app/Component/Comment";
import CommentSkeleton from "@/app/Skeletons/CommentSkeleton";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="relative w-[90%] md:w-full mx-auto">
      {/* Share Modal */}
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
              📌 {t("Pinned")}
            </span>
          )}
          {isShared && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-md">
              🔁 {t("Shared")}
            </span>
          )}
        </div>

        {/* Shared Info */}
        {isShared && <SharedTitle user={user} post={post} original={original} />}

        {/* Post Card */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 transition-transform hover:scale-[1.01]">

          {/* Profile / Post Image */}
          <PostImage
            post={post}
            isCommunityPost={isCommunityPost}
            className="w-full sm:w-[150px] rounded-xl"
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-3">
            <PostHeader
              post={post}
              user={post?.owner}
              isLogin={isLogin}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isCommunityPost={isCommunityPost}
            />

            {/* Text */}
            {post.text && (
              <RenderPostText
                text={post.text}
                mentions={post.mentions}
                hashtags={post.Hashtags}
              />
            )}

            {/* Links */}
            <PostLinks links={post?.links} />

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
              <PostPhotos
                photos={post.Photos}
                setImageView={setImageView}
                postId={post._id}
              />
            )}

            {/* Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <PostHashtags post={post} />
            )}

            {/* Actions */}
            {isLogin && (
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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

            {/* Comment Input */}
            {!post.isCommentOff && isLogin && (
              canComment() ? (
                <div className="flex items-start sm:items-center gap-3 mt-4 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <Image
                    src={user?.profilePhoto?.url || '/default-profile.png'}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={`${t("Write a comment")}...`}
                      rows={1}
                      onInput={(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      className="w-full bg-transparent text-[15px] resize-none outline-none placeholder-gray-400 dark:placeholder-gray-500 px-2 py-1 leading-snug text-gray-800 dark:text-gray-100 min-h-[38px] max-h-[160px] overflow-y-auto"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className={`p-2.5 rounded-full transition-all ${
                      commentText.trim()
                        ? 'bg-blue-500 hover:bg-blue-400'
                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <IoIosSend className="text-white text-lg" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl text-sm text-yellow-800 dark:text-yellow-300">
                  {t("You must follow or be followed by")} @{post.owner?.username} {t("to comment on this post")}.
                </div>
              )
            )}

            {/* Comments List */}
            <div className="flex flex-col gap-4 border-t border-gray-700 pt-6">
              {post.isCommentOff ? (
                <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
                  <p>{t("Comments are turned off")}</p>
                </div>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
              ) : comments?.length > 0 ? (
                comments.map((comment) => <Comment key={comment._id} comment={comment} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-black dark:text-white">
                  <p>{t("No comments yet")}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DesignPostSelect;
