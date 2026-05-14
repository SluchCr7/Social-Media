'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import { ShareModal } from './AddandUpdateMenus/SharePost';
import PostHeader from './Post/PostHeader';
import PostMedia from './Post/PostMedia';
import PostLinks from './Post/PostLinks';
import PostHashtags from './Post/PostHashtags';
import RenderPostText from './Post/RenderText';
import PostActions from './Post/PostActions';
import SharedPost from './Post/SharedPost';
import SharedTitle from './Post/SharedTitle';
import PostImage from './Post/PostImage';
import HighlightedComment from './Post/highlightedComment';
import { useTranslate } from '../Context/TranslateContext';
import { franc } from 'franc';
import { iso6391Map } from '../utils/Data';
import { useTranslation } from 'react-i18next';
import { getHighlightedComment } from '../utils/getHighlitedComment';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ShowSensitiveContent from './Post/ShowSensitiveContent';
import PostMusicPlayer from './Post/PostMusic';
import Image from 'next/image';
import Link from 'next/link'
import { Avatar } from './ui/Avatar'

const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost, hahaPost, savePost, sharePost, setImageView } = usePost();
  const { user, isLogin } = useAuth();
  const { t } = useTranslation();
  const { translate, loading, language } = useTranslate();

  const [openModel, setOpenModel] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isShared = post?.isShared && post?.originalPost;
  const original = post?.originalPost;
  const highlightedComment = getHighlightedComment(post);
  const pathname = usePathname();
  const isView = pathname?.includes('/Pages/Saved');

  useEffect(() => {
    if (!post?.text || !language) return;
    if (post.text.length < 3) return setShowTranslateButton(false);
    const langCode3 = franc(post.text, { minLength: 3 });
    if (langCode3 === 'und') return setShowTranslateButton(false);
    const textLang = iso6391Map[langCode3] || 'en';
    setShowTranslateButton(textLang !== language);
  }, [post?.text, language]);

  const handleTranslate = async () => {
    if (!post?.text || !language) return;
    const result = await translate(post.text, language);
    if (result) {
      setTranslated(result);
      setShowOriginal(true);
      setShowTranslateButton(false);
    }
  };

  const handleShowOriginal = () => {
    setShowOriginal(false);
    setShowTranslateButton(true);
  };

  const handleShowTranslated = () => {
    setShowOriginal(true);
    setShowTranslateButton(false);
  };

  useEffect(() => {
    if (post?.isContainWorst) setShowSensitive(true);
  }, [post?.isContainWorst]);

  return (
    <div className="relative w-full mb-6 md:mb-12">
      <ShareModal
        post={post}
        isOpen={openModel}
        onClose={() => setOpenModel(false)}
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)}
      />

      <motion.div
        ref={ref}
        id={post?._id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/30 dark:hover:border-white/10"
      >
        {/* Decorative Ambient Logic */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <AnimatePresence>
          {showSensitive && (
            <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
          )}
        </AnimatePresence>

        <div className={`p-5 md:p-8 flex flex-col gap-5 md:gap-6 transition-all ${showSensitive ? 'blur-2xl pointer-events-none' : ''}`}>

          {/* Top Metadata Row */}
          <div className="flex flex-col items-start md:flex-row md:items-center gap-2 md:justify-between">
            <div className="flex gap-2">
              {post?.isPinned && (
                <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-500">
                  {t("Pinned")}
                </div>
              )}
              {isShared && (
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-500">
                  {t("Shared Vision")}
                </div>
              )}
            </div>
            {isShared && <SharedTitle user={user} post={post} original={original} />}
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            {/* Header with User Info */}
            <PostHeader
              post={post}
              user={user}
              isLogin={isLogin}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isCommunityPost={!!post?.community}
            />

            {/* Content Area */}
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="text-base md:text-xl font-medium leading-relaxed text-gray-800 dark:text-white/90">
                <RenderPostText
                  text={showOriginal && translated ? translated : post?.text}
                  mentions={post?.mentions}
                  hashtags={post?.Hashtags}
                  italic={post?.isShared}
                />
              </div>

              {/* Translation Widget */}
              <AnimatePresence mode="wait">
                {showTranslateButton && !showOriginal && (
                  <motion.button
                    key="translate-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTranslate}
                    disabled={loading}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 w-fit flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-all disabled:opacity-50"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 ${loading ? 'animate-ping' : 'animate-pulse'}`} />
                    {loading ? (t("Translating...") || "Translating...") : (t("Translate Post") || "Translate Post")}
                  </motion.button>
                )}

                {translated && showOriginal && (
                  <motion.div
                    key="translated-info"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/30"
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.188 16.503 6 20" />
                      </svg>
                      {t("Translated by Zocial AI")}
                    </span>
                    <button
                      onClick={handleShowOriginal}
                      className="text-indigo-500 hover:text-indigo-400 transition-colors underline underline-offset-4"
                    >
                      {t("See Original")}
                    </button>
                  </motion.div>
                )}

                {translated && !showOriginal && (
                  <motion.button
                    key="show-translated-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleShowTranslated}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 w-fit transition-all"
                  >
                    {t("Show Translation")}
                  </motion.button>
                )}
              </AnimatePresence>

              {post?.music && <PostMusicPlayer music={post.music} />}

              {/* Media Section */}
              <div className="rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                {!isShared && (post?.media?.length > 0 || post?.Photos?.length > 0) && (
                  <PostMedia
                    media={post.media}
                    photos={post.Photos}
                    setImageView={setImageView}
                  />
                )}
                {isShared && original && (
                  <SharedPost
                    original={original}
                    user={user}
                    setImageView={setImageView}
                  />
                )}
              </div>

              {post?.links && <PostLinks links={post?.links} />}
              {post?.Hashtags?.length > 0 && <PostHashtags post={post} />}
            </div>

            {/* Action Bar - Premium Dock */}
            {isLogin && (
              <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-gray-100 dark:border-white/5">
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

            {/* Discussion Footer */}
            {!isView && (post?.comments?.length > 0 || highlightedComment) && (
              <div className="space-y-4 pt-4">
                {post?.comments?.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {post.comments.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-black overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm">
                          <Image
                            src={c?.owner?.profilePhoto?.url || '/default-avatar.png'}
                            alt="av"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <Link href={`/Pages/Post/${post?._id}`} className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      View Discourse ({post.comments.length})
                    </Link>
                  </div>
                )}
                {highlightedComment && (
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/30 rounded-full" />
                    <div className="pl-6">
                      <HighlightedComment highlightedComment={highlightedComment} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry;
