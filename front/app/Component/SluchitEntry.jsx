'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import { ShareModal } from './AddandUpdateMenus/SharePost'
import PostMenu from './PostMenu'
import PostHeader from './Post/PostHeader'
import PostPhotos from './Post/PostPhotos'
import PostLinks from './Post/PostLinks'
import PostHashtags from './Post/PostHashtags'
import RenderPostText from './Post/RenderText'
import PostActions from './Post/PostActions'
import SharedPost from './Post/SharedPost'
import SharedTitle from './Post/SharedTitle'
import PostImage from './Post/PostImage'
import HighlightedComment from './Post/highlightedComment'
import { useTranslate } from '../Context/TranslateContext'
import { franc } from 'franc'
import { iso6391Map } from '../utils/Data'
import { useTranslation } from 'react-i18next'
import { getHighlightedComment } from '../utils/getHighlitedComment'
import { usePathname } from 'next/navigation'
import {motion , AnimatePresence} from 'framer-motion'
import ShowSensitiveContent from './Post/ShowSensitiveContent'
import PostMusicPlayer from './Post/PostMusic'
const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost, hahaPost, savePost, sharePost, setImageView } = usePost()
  const { user, isLogin } = useAuth()
  const { t } = useTranslation()
  const { translate, loading, language } = useTranslate()

  const [showMenu, setShowMenu] = useState(false)
  const [openModel, setOpenModel] = useState(false)
  const [translated, setTranslated] = useState(null)
  const [showTranslateButton, setShowTranslateButton] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)

  const isShared = post?.isShared && post?.originalPost
  const original = post?.originalPost
  const highlightedComment = getHighlightedComment(post)
  const pathname = usePathname()
  const isView = pathname?.includes('/Pages/Saved')

  // ======= فحص اللغة =======
  useEffect(() => {
    if (!post?.text || !language) return
    if (post.text.length < 3) return setShowTranslateButton(false)

    const langCode3 = franc(post.text, { minLength: 3 })
    if (langCode3 === 'und') return setShowTranslateButton(false)

    const textLang = iso6391Map[langCode3] || 'en'
    setShowTranslateButton(textLang !== language)
  }, [post?.text, language])

  // ======= ترجمة =======
  const handleTranslate = async () => {
    if (!post?.text || !language) return
    const result = await translate(post.text, language)
    setTranslated(result)
    setShowOriginal(true)
    setShowTranslateButton(false)
  }

  const handleShowOriginal = () => {
    setShowOriginal(false)
    setTranslated(null)
    setShowTranslateButton(true)
  }

  // ======= فحص المحتوى الحساس =======
  useEffect(() => {
    if (post?.isContainWorst) setShowSensitive(true)
  }, [post?.isContainWorst])

  return (
    <div className="relative w-full">
      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={openModel}
        onClose={() => setOpenModel(false)}
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)}
      />

      <motion.div
        ref={ref}
        id={post?._id}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="
          relative w-[95%] md:w-full mx-auto mb-6
          rounded-2xl shadow-[0_0_25px_-10px_rgba(0,0,0,0.3)]
          bg-white/90 dark:bg-black/40 backdrop-blur-xl
          border border-gray-200/70 dark:border-gray-700/60
          transition-all duration-300
        "
      >
      <AnimatePresence>
        {showSensitive && (
          <ShowSensitiveContent setShowSensitive={setShowSensitive} t={t} />
        )}
      </AnimatePresence>

        {/* ======= محتوى البوست ======= */}
        <div className={`p-4 sm:p-6 flex flex-col gap-5 transition-all ${showSensitive ? 'blur-md pointer-events-none select-none' : ''}`}>
          {/* ======= Pinned or Shared ======= */}
          <div className="flex flex-wrap items-center gap-2">
            {post?.isPinned && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 shadow-md">
                📌 {t('Pinned')}
              </span>
            )}
            {isShared && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md">
                🔁 {t('Shared')}
              </span>
            )}
          </div>

          {/* ======= Shared Info ======= */}
          {isShared && <SharedTitle user={user} post={post} original={original} />}

          <div className="flex flex-col items-start sm:flex-row gap-5 w-full">
            <PostImage
              post={post}
              isCommunityPost={!!post?.community}
              className="w-full sm:w-[160px] h-auto rounded-xl"
            />

            <div className="flex flex-col flex-1 gap-3 w-full">
              <PostHeader
                post={post}
                user={user}
                isLogin={isLogin}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                isCommunityPost={!!post?.community}
              />

              <RenderPostText
                text={post?.text}
                mentions={post?.mentions}
                hashtags={post?.Hashtags}
                italic={post?.isShared}
              />

              {post?.links && <PostLinks links={post?.links} />}
              {post?.music && <PostMusicPlayer music={post.music} />}

              {/* ======= Translation Section ======= */}
              <div className="mt-2 space-y-3">
                {showTranslateButton && !showOriginal && (
                  <button
                    onClick={handleTranslate}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-1.5 w-fit text-blue-600 dark:text-blue-400 border border-blue-500/40 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all"
                  >
                    {loading ? `${t('Translating')}...` : t('Translate')}
                    {loading && (
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full opacity-60" />
                    )}
                  </button>
                )}

                {translated && showOriginal && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {t('Translation')}
                      </span>
                      <button
                        onClick={handleShowOriginal}
                        className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 underline"
                      >
                        {t('Show Original')}
                      </button>
                    </div>

                    <RenderPostText
                      text={translated}
                      mentions={post?.mentions}
                      hashtags={post?.Hashtags}
                      italic={post?.isShared}
                    />
                  </div>
                )}
              </div>

              {isShared && original && (
                <SharedPost
                  original={original}
                  user={user}
                  setImageView={setImageView}
                />
              )}

              {!isShared && post?.Photos?.length > 0 && (
                <PostPhotos
                  photos={post.Photos}
                  setImageView={setImageView}
                  postId={post._id}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden"
                />
              )}

              {post?.Hashtags?.length > 0 && <PostHashtags post={post} />}

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

              {!isView && (
                <>
                  {post?.comments?.length > 0 && (
                    <div className="flex items-center gap-2 pt-3">
                      <div className="flex -space-x-2">
                        {post.comments.slice(0, 3).map((comment, i) => (
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
                      <span className="text-gray-500 text-xs">
                        {post.comments.length} {t('comments')}
                      </span>
                    </div>
                  )}

                  {highlightedComment && (
                    <HighlightedComment highlightedComment={highlightedComment} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
})

SluchitEntry.displayName = 'SluchitEntry'
export default SluchitEntry
