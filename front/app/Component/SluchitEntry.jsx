'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import { ShareModal } from './AddandUpdateMenus/SharePost';
import PostHeader from './Post/PostHeader';
import PostPhotos from './Post/PostPhotos';
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
    setTranslated(result);
    setShowOriginal(true);
    setShowTranslateButton(false);
  };

  const handleShowOriginal = () => {
    setShowOriginal(false);
    setTranslated(null);
    setShowTranslateButton(true);
  };

  useEffect(() => {
    if (post?.isContainWorst) setShowSensitive(true);
  }, [post?.isContainWorst]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
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
        viewport={{ once: true, margin: "-100px" }}
        className="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all hover:border-white/10"
      >
        {/* Decorative Ambient Logic */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <AnimatePresence>
          {showSensitive && (
            <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
          )}
        </AnimatePresence>

        <div className={`p-6 md:p-8 flex flex-col gap-6 transition-all ${showSensitive ? 'blur-2xl pointer-events-none' : ''}`}>

          {/* Top Metadata Row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {post?.isPinned && (
                <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                  Pinned
                </div>
              )}
              {isShared && (
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  Shared Vision
                </div>
              )}
            </div>
            {isShared && <SharedTitle user={user} post={post} original={original} />}
          </div>

          <div className="flex flex-col gap-6">
            {/* Header with User Info */}
            <PostHeader
              post={post}
              user={user}
              isLogin={isLogin}
              isCommunityPost={!!post?.community}
            />

            {/* Content Area */}
            <div className="flex flex-col gap-5">
              <div className="text-lg md:text-xl font-medium leading-relaxed dark:text-white/90">
                <RenderPostText
                  text={post?.text}
                  mentions={post?.mentions}
                  hashtags={post?.Hashtags}
                  italic={post?.isShared}
                />
              </div>

              {post?.music && <PostMusicPlayer music={post.music} />}

              {/* Media Section */}
              <div className="rounded-[1.5rem] overflow-hidden border border-white/5 bg-white/[0.02]">
                {!isShared && post?.Photos?.length > 0 && (
                  <PostPhotos
                    photos={post.Photos}
                    setImageView={setImageView}
                    postId={post._id}
                    className="aspect-video"
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

            {/* Translation Widget */}
            <AnimatePresence>
              {showTranslateButton && !showOriginal && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleTranslate}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 w-fit"
                >
                  {loading ? "Decrypting..." : "Translate Logic"}
                </motion.button>
              )}
              {translated && showOriginal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2"
                >
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                    <span>Translated Output</span>
                    <button onClick={handleShowOriginal} className="hover:text-white transition-colors">Original Version</button>
                  </div>
                  <div className="text-base text-white/70">
                    <RenderPostText text={translated} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar - Premium Dock */}
            {isLogin && (
              <div className="mt-4 pt-6 border-t border-white/5">
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
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-black overflow-hidden bg-gray-800">
                          <img src={c?.owner?.profilePhoto?.url} alt="av" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <Link href={`/Pages/Post/${post?._id}`} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-indigo-400 transition-colors">
                      View Discourse ({post.comments.length})
                    </Link>
                  </div>
                )}
                {highlightedComment && (
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
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
