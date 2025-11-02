// 'use client'
// import React, { useMemo } from 'react'
// import CommentCard from './CommentCard'
// import SluchitEntry from '../SluchitEntry'
// import { motion, AnimatePresence } from 'framer-motion'
// import { usePost } from '@/app/Context/PostContext'
// import PostSkeleton from '@/app/Skeletons/PostSkeleton'
// import MusicCard from './MusicCard'
// import { useTranslation } from 'react-i18next'

// const TabsContent = ({ activeTab, combinedPosts, userSelected, filters }) => {
//   const { setImageView , userIsLoading } = usePost()
//   const {t} = useTranslation()
//   // ✅ فلترة وترتيب البوستات حسب الفلاتر
//   const filteredPosts = useMemo(() => {
//     let result = [...(combinedPosts || [])]

//     // فلترة
//     if (filters.year !== "all") {
//       result = result.filter(p => new Date(p.createdAt).getFullYear().toString() === filters.year)
//     }
//     if (filters.month !== "all") {
//       result = result.filter(p => (new Date(p.createdAt).getMonth() + 1).toString() === filters.month)
//     }

//     // الترتيب (مع احترام الـ pinned)
//     if (filters.sort === "latest") {
//       result = result.sort((a, b) => {
//         if (a.isPinned && !b.isPinned) return -1
//         if (!a.isPinned && b.isPinned) return 1
//         return new Date(b.createdAt) - new Date(a.createdAt)
//       })
//     } else if (filters.sort === "mostLiked") {
//       result = result.sort((a, b) => {
//         if (a.isPinned && !b.isPinned) return -1
//         if (!a.isPinned && b.isPinned) return 1
//         return (b.likes?.length || 0) - (a.likes?.length || 0)
//       })
//     } else if (filters.sort === "mostCommented") {
//       result = result.sort((a, b) => {
//         if (a.isPinned && !b.isPinned) return -1
//         if (!a.isPinned && b.isPinned) return 1
//         return (b.comments?.length || 0) - (a.comments?.length || 0)
//       })
//     }

//     return result
//   }, [combinedPosts, filters])


//   return (
//     <div className="mt-6 w-full">
//       <AnimatePresence mode="wait" initial={false}>
//         {activeTab === 'Posts' && (
//           <motion.div key="posts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 w-full">
//             {filteredPosts?.length > 0
//               ? filteredPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
//               : Array.from({ length: 4 }).map((_, i) => (
//                   <PostSkeleton key={i} className="animate-pulse w-full" />
//                 ))
//             }
//             {userIsLoading && <PostSkeleton className="animate-pulse" />}
//           </motion.div>
//         )}


//         {activeTab === 'Comments' && (
//           <motion.div key="comments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 w-full">
//             {userSelected?.comments?.length > 0
//               ? userSelected.comments.map((comment) => (
//                 <CommentCard key={comment?._id} comment={comment} />
//               ))
//               : <div className="text-center text-gray-500 py-10">{t("You haven’t commented yet.")}</div>}
//           </motion.div>
//         )}
//         {activeTab === 'Reels' && (
//           <motion.div
//             key="reels"
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.25 }}
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[95%] mx-auto"
//           >
//             {userSelected?.reels?.length > 0 ? (
//               userSelected.reels.map((reel) => (
//                 <div
//                   key={reel?._id}
//                   className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
//                 >
//                   {/* الفيديو */}
//                   <video
//                     src={reel?.videoUrl}
//                     controls
//                     className="w-full h-[300px] object-cover bg-black"
//                   />

//                   {/* caption + owner */}
//                   <div className="p-3">
//                     <p className="text-gray-800 text-sm">{reel?.caption}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center text-gray-500 py-10">
//                 {t("You haven’t uploaded any reels yet.")}
//               </div>
//             )}
//           </motion.div>
//         )}
//         {
//           activeTab === 'Music' && (
//             <motion.div
//               key="music"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.25 }}
//               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-[95%] mx-auto"
//             >
//               {userSelected?.audios?.length > 0 ? (
//                 userSelected.audios.map((music) => (
//                   <MusicCard key={music?._id} music={music} />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center text-gray-500 py-10">
//                   {t("You haven’t uploaded any music yet.")}
//                 </div>
//               )}
//             </motion.div>
//           )
//         }
//         {activeTab === 'Photos' && (
//           <motion.div
//             key="photos"
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.25 }}
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-[95%] mx-auto"
//           >
//             {filteredPosts?.filter((p) => p?.Photos?.length > 0).length > 0 ? (
//               filteredPosts
//                 .filter((p) => p?.Photos?.length > 0)
//                 .flatMap((p) => p.Photos.map((img, i) => (
//                   <div
//                     key={`${p._id}-${i}`}
//                     className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition duration-300"
//                     onClick={()=>setImageView({ url: img?.url, postId: p?._id })}
//                   >
//                     <img
//                       src={img?.url || img}
//                       alt="post photo"
//                       className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
//                 )))
//             ) : (
//               <div className="col-span-full text-center text-gray-500 py-10">
//                 {t("You haven’t uploaded any photos yet.")}
//               </div>
//             )}

//           </motion.div>
//         )}

//       </AnimatePresence>
//     </div>
//   )
// }

// export default TabsContent

'use client'
import React, { useMemo, useCallback, memo } from 'react'
import CommentCard from './CommentCard'
import SluchitEntry from '../SluchitEntry'
import { motion, AnimatePresence } from 'framer-motion'
import { usePost } from '@/app/Context/PostContext'
import PostSkeleton from '@/app/Skeletons/PostSkeleton'
import MusicCard from './MusicCard'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { MdEventAvailable } from 'react-icons/md'

const TabsContent = ({ activeTab, combinedPosts, userSelected, filters }) => {
  const { setImageView , userIsLoading } = usePost()
  const { t } = useTranslation()

  // ✅ تحسين: فلترة وترتيب البوستات بميمو مع deep compare بسيطة للفلاتر
  const filteredPosts = useMemo(() => {
    if (!combinedPosts?.length) return []

    let result = [...combinedPosts]

    if (filters.year !== "all") {
      result = result.filter(p => new Date(p.createdAt).getFullYear().toString() === filters.year)
    }
    if (filters.month !== "all") {
      result = result.filter(p => (new Date(p.createdAt).getMonth() + 1).toString() === filters.month)
    }

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      switch (filters.sort) {
        case "mostLiked":
          return (b.likes?.length || 0) - (a.likes?.length || 0)
        case "mostCommented":
          return (b.comments?.length || 0) - (a.comments?.length || 0)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    return result
  }, [combinedPosts, filters.year, filters.month, filters.sort])

  // ✅ تحسين: حفظ دالة setImageView داخل useCallback
  const handleImageClick = useCallback(
    (url, postId) => setImageView({ url, postId }),
    [setImageView]
  )

  // ✅ متغيرات للتحكم بالأنميشن لتقليل التكرار
  const motionSettings = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
  }

  return (
    <div className="mt-6 w-full">
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'Posts' && (
          <motion.div key="posts" {...motionSettings} className="flex flex-col gap-4 w-full">
            {filteredPosts?.length > 0
              ? filteredPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
              :
              (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <MdEventAvailable size={40} className="mb-3 text-gray-500" />
                  <span>{t("You haven’t posted anything yet.")}</span>
                </div>
              )
            }
            {userIsLoading && (
                Array.from({ length: 4 }).map((_, i) => (
                  <PostSkeleton key={i} className="animate-pulse w-full" />
                ))
              )
            }
          </motion.div>
        )}

        {activeTab === 'Comments' && (
          <motion.div key="comments" {...motionSettings} className="flex flex-col gap-4 w-full">
            {userSelected?.comments?.length > 0
              ? userSelected.comments.map((comment) => (
                <CommentCard key={comment?._id} comment={comment} />
              ))
              : <div className="text-center text-gray-500 py-10">{t("You haven’t commented yet.")}</div>}
          </motion.div>
        )}

        {activeTab === 'Reels' && (
          <motion.div key="reels" {...motionSettings} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[95%] mx-auto">
            {userSelected?.reels?.length > 0 ? (
              userSelected.reels.map((reel) => (
                <div key={reel?._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                  <video src={reel?.videoUrl} controls className="w-full h-[300px] object-cover bg-black" />
                  <div className="p-3">
                    <p className="text-gray-800 text-sm">{reel?.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                {t("You haven’t uploaded any reels yet.")}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'Music' && (
          <motion.div key="music" {...motionSettings} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-[95%] mx-auto">
            {userSelected?.audios?.length > 0 ? (
              userSelected.audios.map((music) => <MusicCard key={music?._id} music={music} />)
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                {t("You haven’t uploaded any music yet.")}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'Photos' && (
          <motion.div key="photos" {...motionSettings} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-[95%] mx-auto">
            {filteredPosts?.some((p) => p?.Photos?.length > 0) ? (
              filteredPosts.flatMap((p) =>
                p.Photos.map((img, i) => (
                  <div
                    key={`${p._id}-${i}`}
                    className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition duration-300"
                    onClick={() => handleImageClick(img?.url, p?._id)}
                  >
                    <Image
                      width={500}
                      height={500}
                      src={img?.url || img}
                      alt="post photo"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              )
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                {t("You haven’t uploaded any photos yet.")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(TabsContent)
