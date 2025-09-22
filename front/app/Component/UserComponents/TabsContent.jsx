'use client'
import React from 'react'
import CommentCard from './CommentCard'
import SluchitEntry from '../SluchitEntry'
import { motion, AnimatePresence } from 'framer-motion'
import { usePost } from '@/app/Context/PostContext'

const TabsContent = ({ activeTab, combinedPosts, posts, userSelected }) => {
  const {imageView, setImageView} = usePost()
  return (
    <div className="mt-6 w-full">
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'Posts' && (
          <motion.div key="posts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 w-[90%] mx-auto">
            {combinedPosts?.length > 0
              ? combinedPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
              : <div className="text-center text-gray-500 py-10">No posts yet.</div>}
          </motion.div>
        )}

        {activeTab === 'Saved' && (
          <motion.div key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 w-[90%] mx-auto">
            {posts?.filter((p) => p.saved.includes(userSelected?._id)).length > 0
              ? posts.filter((p) => p.saved.includes(userSelected?._id)).map((post) => <SluchitEntry key={post?._id} post={post} />)
              : <div className="text-center text-gray-500 py-10">You haven’t saved any posts yet.</div>}
          </motion.div>
        )}

        {activeTab === 'Comments' && (
          <motion.div key="comments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 w-[90%] mx-auto">
            {userSelected?.comments?.length > 0
              ? userSelected.comments.map((comment) => (
                <CommentCard key={comment?._id} comment={comment} />
              ))
              : <div className="text-center text-gray-500 py-10">You haven’t commented yet.</div>}
          </motion.div>
        )}
        {activeTab === 'Reels' && (
          <motion.div
            key="reels"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[95%] mx-auto"
          >
            {userSelected?.reels?.length > 0 ? (
              userSelected.reels.map((reel) => (
                <div
                  key={reel?._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  {/* الفيديو */}
                  <video
                    src={reel?.videoUrl}
                    controls
                    className="w-full h-[300px] object-cover bg-black"
                  />

                  {/* caption + owner */}
                  <div className="p-3">
                    <p className="text-gray-800 text-sm">{reel?.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                You haven’t uploaded any reels yet.
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'Photos' && (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-[95%] mx-auto"
          >
            {posts?.filter((p) => p?.Photos?.length > 0).length > 0 ? (
              posts
                .filter((p) => p?.Photos?.length > 0)
                .flatMap((p) => p.Photos.map((img, i) => (
                  <div
                    key={`${p._id}-${i}`}
                    className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition duration-300"
                    onClick={()=>setImageView({ url: img?.url, postId: p?._id })}
                  >
                    <img
                      src={img?.url || img}
                      alt="post photo"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                You haven’t uploaded any photos yet.
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default TabsContent