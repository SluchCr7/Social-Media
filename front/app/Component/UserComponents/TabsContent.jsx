import React from 'react'
import CommentCard from './CommentCard'
import SluchitEntry from '../SluchitEntry'
import { motion, AnimatePresence } from 'framer-motion'

const TabsContent = ({ activeTab, combinedPosts, posts, userSelected }) => (
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
    </AnimatePresence>
  </div>
)

export default TabsContent