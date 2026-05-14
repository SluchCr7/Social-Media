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
    <div className="relative w-full mb-10 md:mb-20">
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
        className="group relative bg-white dark:bg-black border-b border-gray-100 dark:border-threads-border pb-10 md:pb-14"
      >
        <AnimatePresence>
          {showSensitive && (
            <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
          )}
        </AnimatePresence>

        <div className={`flex flex-col gap-6 transition-all ${showSensitive ? 'blur-3xl pointer-events-none' : ''}`}>
          
          {/* Top Metadata labels - Professional & Subtle */}
          <div className="flex items-center justify-between px-2 h-6">
            <div className="flex gap-2">
              {post?.isPinned && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase tracking-widest">
                  <Pin size={10} />
                  <span>{t("Pinned")}</span>
                </div>
              )}
              {isShared && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                  <Share size={10} />
                  <span>{t("Shared")}</span>
                </div>
              )}
            </div>
            {isShared && <SharedTitle user={user} post={post} original={original} />}
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-5 px-1 sm:px-4">
             {/* Profile Line (Threads Style) */}
             <div className="flex flex-col items-center shrink-0">
                <Link href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}>
                  <Avatar src={post?.owner?.profilePhoto?.url} size="md" className="ring-4 ring-white dark:ring-black" />
                </Link>
                <div className="flex-1 w-px bg-gray-100 dark:bg-threads-border mt-4 mb-4 rounded-full opacity-30" />
                <div className="relative h-10 flex -space-x-1.5 items-end pb-1">
                   {post.comments?.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-black overflow-hidden ring-1 ring-gray-100 dark:ring-white/10 grayscale hover:grayscale-0 transition-all">
                        <Image src={c?.owner?.profilePhoto?.url || '/default-avatar.png'} alt="av" width={16} height={16} className="object-cover w-full h-full" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 flex flex-col gap-4 min-w-0">
                <PostHeader
                  post={post}
                  user={user}
                  isLogin={isLogin}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  isCommunityPost={!!post?.community}
                  hideAvatar={true}
                />

                <div className="flex flex-col gap-4">
                  <div className="text-[16px] md:text-[18px] font-medium leading-relaxed text-black dark:text-white/90">
                    <RenderPostText
                      text={showOriginal && translated ? translated : post?.text}
                      mentions={post?.mentions}
                      hashtags={post?.Hashtags}
                      italic={post?.isShared}
                    />
                  </div>

                  {/* Translation Action */}
                  {showTranslateButton && !showOriginal && (
                    <button
                      onClick={handleTranslate}
                      disabled={loading}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 hover:text-indigo-500 transition-all w-fit"
                    >
                      {loading ? t("Translating...") : t("Translate Post")}
                    </button>
                  )}

                  {post?.music && <PostMusicPlayer music={post.music} />}

                  {/* Media Frame */}
                  <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01]">
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

                {/* Interaction Footer */}
                {isLogin && (
                  <div className="pt-2 border-t border-gray-50 dark:border-white/[0.02]">
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
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}));

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry;
