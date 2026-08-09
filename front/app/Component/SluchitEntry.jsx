'use client';

import React, { forwardRef, useEffect, useState, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pin, 
  Share, 
  Languages, 
  MoreHorizontal,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
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
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from './ui/Avatar';

// 🚀 Dynamic Imports للمكونات الفرعية لتخفيف العبء على التحميل الأولي
const ShareModal = dynamic(() => import('./AddandUpdateMenus/SharePost').then(mod => mod.ShareModal), { ssr: false });
const PostMusicPlayer = dynamic(() => import('./Post/PostMusic'), { ssr: false });
const ShowSensitiveContent = dynamic(() => import('./Post/ShowSensitiveContent'), { ssr: false });

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
    <div className="relative w-full mb-6 md:mb-8">
      {openModel && (
        <ShareModal
          post={post}
          isOpen={openModel}
          onClose={() => setOpenModel(false)}
          onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)}
        />
      )}

      <motion.div
        ref={ref}
        id={post?._id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <AnimatePresence>
          {showSensitive && (
            <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
          )}
        </AnimatePresence>

        <div className={`flex flex-col gap-4 transition-all ${showSensitive ? 'blur-3xl pointer-events-none' : ''}`}>
          
          {/* Top Metadata labels */}
          {(post?.isPinned || isShared) && (
            <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-neutral-900 text-xs">
              <div className="flex items-center gap-2">
                {post?.isPinned && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold tracking-wider text-[10px]">
                    <Pin size={12} />
                    <span>{t("Pinned")}</span>
                  </div>
                )}
                {isShared && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider text-[10px]">
                    <Share size={12} />
                    <span>{t("Shared")}</span>
                  </div>
                )}
              </div>
              {isShared && <SharedTitle user={user} post={post} original={original} />}
            </div>
          )}

          {/* Main Content Layout */}
          <div className="flex gap-4">
             {/* Profile Avatar & Thread Line */}
             <div className="flex flex-col items-center shrink-0">
                <Link href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`} className="transition-transform hover:scale-105">
                  <Avatar src={post?.owner?.profilePhoto?.url} size="md" className="ring-2 ring-gray-100 dark:ring-neutral-800" />
                </Link>
                <div className="flex-1 w-0.5 bg-gray-100 dark:bg-neutral-800 my-3 rounded-full" />
                <div className="relative h-8 flex -space-x-1.5 items-end pb-0.5">
                   {post.comments?.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full border border-white dark:border-black overflow-hidden shadow-xs">
                        <Image src={c?.owner?.profilePhoto?.url || '/default-avatar.png'} alt="av" width={14} height={14} className="object-cover w-full h-full" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 flex flex-col gap-3 min-w-0">
                <PostHeader
                  post={post}
                  user={user}
                  isLogin={isLogin}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  isCommunityPost={!!post?.community}
                  hideAvatar={true}
                />

                <div className="flex flex-col gap-3">
                  <div className="text-[15px] md:text-[16px] leading-relaxed text-gray-900 dark:text-gray-100 font-normal break-words">
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
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline w-fit flex items-center gap-1 mt-1"
                    >
                      <Languages size={14} />
                      <span>{loading ? t("Translating...") : t("Translate Post")}</span>
                    </button>
                  )}

                  {post?.music && <PostMusicPlayer music={post.music} />}

                  {/* Media Frame */}
                  <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
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
                  <div className="pt-3 mt-1 border-t border-gray-100 dark:border-neutral-800/60">
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