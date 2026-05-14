'use client';

import React, { forwardRef, useEffect, useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pin, 
  Share, 
  MessageCircle, 
  Languages, 
  Eye, 
  MoreHorizontal,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
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
import HighlightedComment from './Post/highlightedComment';
import { useTranslate } from '../Context/TranslateContext';
import { franc } from 'franc';
import { iso6391Map } from '../utils/Data';
import { useTranslation } from 'react-i18next';
import { getHighlightedComment } from '../utils/getHighlitedComment';
import { usePathname } from 'next/navigation';
import ShowSensitiveContent from './Post/ShowSensitiveContent';
import PostMusicPlayer from './Post/PostMusic';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from './ui/Avatar';

const SluchitEntry = memo(forwardRef(({ post }, ref) => {
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
  const highlightedComment = useMemo(() => getHighlightedComment(post), [post]);
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

  useEffect(() => {
    if (post?.isContainWorst) setShowSensitive(true);
  }, [post?.isContainWorst]);

  return (
    <div className="relative w-full mb-8 md:mb-16">
      <ShareModal
        post={post}
        isOpen={openModel}
        onClose={() => setOpenModel(false)}
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)}
      />

      <motion.div
        ref={ref}
        id={post?._id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="group relative overflow-hidden bg-white dark:bg-black border-b border-gray-100 dark:border-threads-border pb-8 md:pb-12"
      >
        <AnimatePresence>
          {showSensitive && (
            <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
          )}
        </AnimatePresence>

        <div className={`flex flex-col gap-5 transition-all ${showSensitive ? 'blur-3xl pointer-events-none scale-105' : ''}`}>
          
          {/* Top Metadata labels */}
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-2">
              {post?.isPinned && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                  <Pin size={10} />
                  <span>{t("Pinned")}</span>
                </div>
              )}
              {isShared && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                  <Share size={10} />
                  <span>{t("Shared")}</span>
                </div>
              )}
            </div>
            {isShared && <SharedTitle user={user} post={post} original={original} />}
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-4 px-2">
             {/* Profile Line (Threads Style) */}
             <div className="flex flex-col items-center">
                <Avatar src={post?.owner?.profilePhoto?.url} size="md" />
                <div className="flex-1 w-0.5 bg-gray-100 dark:bg-threads-border mt-3 mb-2 rounded-full opacity-50" />
                <div className="relative w-8 h-8 flex -space-x-2">
                   {post.comments?.slice(0, 2).map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-black overflow-hidden ring-1 ring-gray-100 dark:ring-white/10">
                        <Image src={c?.owner?.profilePhoto?.url || '/default-avatar.png'} alt="av" width={20} height={20} className="object-cover w-full h-full" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 space-y-4">
                <PostHeader
                  post={post}
                  user={user}
                  isLogin={isLogin}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  isCommunityPost={!!post?.community}
                />

                <div className="space-y-4">
                  <div className="text-[15px] md:text-[17px] font-medium leading-[1.6] text-black dark:text-white/95">
                    <RenderPostText
                      text={showOriginal && translated ? translated : post?.text}
                      mentions={post?.mentions}
                      hashtags={post?.Hashtags}
                      italic={post?.isShared}
                    />
                  </div>

                  {/* Translation Widget */}
                  {showTranslateButton && !showOriginal && (
                    <button
                      onClick={handleTranslate}
                      disabled={loading}
                      className="flex items-center gap-2 text-[11px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                    >
                      <Languages size={12} className={loading ? 'animate-spin' : ''} />
                      {loading ? t("Translating...") : t("Translate")}
                    </button>
                  )}

                  {translated && showOriginal && (
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                       <span>{t("Translated by AI")}</span>
                       <button onClick={() => setShowOriginal(false)} className="text-indigo-500">{t("See original")}</button>
                    </div>
                  )}

                  {post?.music && <PostMusicPlayer music={post.music} />}

                  {/* Media */}
                  <div className="rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    {!isShared && (post?.media?.length > 0 || post?.Photos?.length > 0) && (
                      <PostMedia media={post.media} photos={post.Photos} setImageView={setImageView} />
                    )}
                    {isShared && original && (
                      <SharedPost original={original} user={user} setImageView={setImageView} />
                    )}
                  </div>

                  {post?.links && <PostLinks links={post?.links} />}
                  {post?.Hashtags?.length > 0 && <PostHashtags post={post} />}
                </div>

                {/* Interactions */}
                {isLogin && (
                  <div className="pt-2">
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

                {/* Comment Summary */}
                {!isView && (post?.comments?.length > 0 || highlightedComment) && (
                  <div className="flex items-center gap-4 pt-2">
                    <Link href={`/Pages/Post/${post?._id}`} className="text-[14px] font-medium text-gray-400 hover:text-indigo-500 transition-colors">
                      {post.comments.length} {t("replies")}
                    </Link>
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                    <span className="text-[14px] font-medium text-gray-400">
                      {post.likes?.length || 0} {t("likes")}
                    </span>
                  </div>
                )}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}));

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry;
