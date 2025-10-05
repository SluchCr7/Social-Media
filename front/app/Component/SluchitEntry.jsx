'use client'
import React, { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsThreeDots } from 'react-icons/bs';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostMenu from './PostMenu';
import { ShareModal } from './SharePost';
import { getHighlightedComment } from '../utils/getHighlitedComment';
import UserHoverCard from './UserHoverCard';
import RenderPostText from './Post/RenderText';
import PostActions from './Post/PostActions';
import PostPhotos from './Post/PostPhotos';
import SharedTitle from './Post/SharedTitle';
import { HiBadgeCheck } from 'react-icons/hi';
import { useTranslate } from '../Context/TranslateContext';
import franc from 'franc';
import { languageMap , iso6391Map} from '../utils/Data';
const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost, hahaPost, savePost, sharePost, setImageView } = usePost();
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLogin } = useAuth();
  const [openModel, setOpenModel] = useState(false);
  const { translate, loading } = useTranslate();
  const [translated, setTranslated] = useState(null);
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const isShared = post?.isShared && post?.originalPost;
  const original = post?.originalPost;
  const isCommunityPost = post?.community !== null;
  const isInCommunityPage = typeof window !== 'undefined' && window.location.href.includes('/Pages/Community/');
  const highlightedComment = getHighlightedComment(post);
   // فحص إذا كان يجب إظهار زر الترجمة
  useEffect(() => {
    if (!post?.text || !post?.owner?.preferredLanguage) return;

    const preferredLangText = post?.owner?.preferredLanguage;
    const preferredLang = languageMap[preferredLangText] || null;
    if (!preferredLang) return;

    const langCode3 = franc(post.text);
    const textLang = iso6391Map[langCode3] || 'en';

    setShowTranslateButton(textLang !== preferredLang);
  }, [post?.text, post?.owner?.preferredLanguage]);

  // دالة الترجمة
  const handleTranslate = async () => {
    if (!post?.text || !post?.owner?.preferredLanguage) return;

    const targetLang = languageMap[post.owner.preferredLanguage];
    if (!targetLang) return;

    const result = await translate(post.text, targetLang);
    setTranslated(result);
    setShowOriginal(true);
    setShowTranslateButton(false);
  };

  // دالة الرجوع للنص الأصلي
  const handleShowOriginal = () => {
    setShowOriginal(false);
    setTranslated(null);
    setShowTranslateButton(true);
  };
  return (
    <div ref={ref} className="relative w-full">
      {/* 🔄 Share Modal */}
      <ShareModal 
        post={post} 
        isOpen={openModel} 
        onClose={() => setOpenModel(false)} 
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
      />    

      {/* 📰 Post Card */}
      <div className="
        bg-white/80 dark:bg-black/30 backdrop-blur-xl
        border border-gray-200/70 dark:border-gray-700/50
        w-full p-4 sm:p-6 
        rounded-2xl flex flex-col gap-5 shadow-lg
        transition-all duration-300 hover:scale-[1.01]
      ">
        {/* 📌 Tags */}
        {post?.isPinned && (
          <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 
            text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
            📌 Pinned Post
          </div>
        )}
        {isShared && (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 
            text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
            🔁 Shared Post
          </div>
        )}

        {/* 👥 Shared By Info */}
        {isShared && <SharedTitle user={user} post={post} original={original} />}

        <div className="flex items-start gap-4">
          {/* 👤 Profile Image */}
          <div className="flex flex-col items-center">
            <Image
              src={isCommunityPost && !isInCommunityPage 
                ? post?.community?.Picture?.url 
                : post?.owner?.profilePhoto?.url}
              alt="profile"
              width={44}
              height={44}
              className={`rounded-full w-11 h-11 min-w-11 object-cover 
                ${post?.owner?.stories?.length > 0 ? "ring-2 ring-pink-500 animate-pulse" : ""}
              `}
            />
            <div className="hidden sm:block border border-gray-600 h-[70px] w-[1px] mt-2"></div>
          </div>

          {/* 📄 Main Content */}
          <div className="flex flex-col w-full gap-3">
            {/* 🔝 Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1">
                    <UserHoverCard userSelected={post?.owner}>
                      <Link
                        href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}
                        className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline truncate max-w-[150px] sm:max-w-[200px]"
                      >
                        {post?.owner?.username}
                      </Link>
                    </UserHoverCard>
                    {post?.owner?.isAccountWithPremiumVerify && (
                      <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <span className="truncate max-w-[120px]">{post?.owner?.profileName}</span>
                    <span className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full" />
                    <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* 📋 Menu */}
              {isLogin && (
                <div className="relative self-end sm:self-auto">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-xl text-gray-500 hover:text-gray-700 transition"
                  >
                    <BsThreeDots />
                  </button>
                  <PostMenu post={post} showMenu={showMenu} setShowMenu={setShowMenu} />
                </div>
              )}
            </div>

            {/* 📝 Text */}
            <RenderPostText
              text={showOriginal ? translated : post?.text}
              mentions={post?.mentions}
              hashtags={post?.Hashtags}
              italic={post?.isShared}
            />

            {/* زر الترجمة / العودة للنص الأصلي */}
            {showTranslateButton && (
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="text-blue-500 mt-2 hover:underline"
              >
                {loading ? 'جارٍ الترجمة...' : 'Translate'}
              </button>
            )}

            {showOriginal && (
              <button
                onClick={handleShowOriginal}
                className="text-blue-500 mt-2 hover:underline"
              >
                Show Original
              </button>
            )}

            {/* 🖼️ Original Post if Shared */}
            {isShared && original && (
              <Link href={`/Pages/Post/${original?._id}`} 
                className="bg-white/40 dark:bg-white/5 backdrop-blur-md 
                  border border-gray-200/40 dark:border-gray-700/40 
                  rounded-xl p-4 flex flex-col gap-3 
                  shadow-md hover:shadow-lg transition-all duration-300 
                  border-l-4 border-blue-400"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                  <Link
                    href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <Image
                      src={original?.owner?.profilePhoto?.url}
                      alt="Shared_profile_post"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                    />
                    <UserHoverCard userSelected={original?.owner}>
                      <div className="flex flex-col">
                        <div className='flex items-center gap-1'>
                          <span className="font-semibold text-gray-900 dark:text-white">{original?.owner?.username}</span>
                          {original?.owner?.isAccountWithPremiumVerify && (
                            <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                          )}
                        </div>
                        <span className="text-gray-500 text-xs">{original?.owner?.profileName}</span>
                      </div>
                    </UserHoverCard>
                  </Link>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {new Date(original?.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <RenderPostText
                  text={original?.text}
                  mentions={original?.mentions}
                  hashtags={original?.Hashtags}
                  italic={true}
                />

                {original?.Photos && (
                  <PostPhotos photos={original?.Photos} setImageView={setImageView} postId={original?._id} />
                )}
              </Link>
            )}

            {/* 🖼️ Normal Post Photos */}
            {!isShared && post?.Photos && (
              <PostPhotos 
                photos={post?.Photos} 
                setImageView={setImageView} 
                postId={post?._id} 
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden"
              />
            )}

            {/* 🔗 Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post?.Hashtags.map((tag, i) => (
                  <Link
                    href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                    key={i}
                    className="bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 🎛️ Actions */}
            {isLogin && (
              <div className="mt-2">
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

            {/* 💬 Comment Avatars */}
            {post?.comments?.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  {post?.comments?.slice(0, 3).map((comment, i) => (
                    <Image
                      key={i}
                      src={comment?.owner?.profilePhoto?.url}
                      alt="comment-avatar"
                      width={24}
                      height={24}
                      className="rounded-full border-2 border-white dark:border-black w-6 h-6 object-cover"
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-xs">{post?.comments?.length} comments</span>
              </div>
            )}

            {/* 📨 Highlighted Comment */}
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
});

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry;
