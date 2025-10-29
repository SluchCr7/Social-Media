'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useStory } from '../Context/StoryContext'
import StoryViewer from './StoryViewer'
import StorySkeleton from '../Skeletons/StoriesSkeleton'
import { useAuth } from '../Context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'

const Stories = () => {
  const { user } = useAuth()
  const { stories, isLoading, viewStory,isStory, setIsStory } = useStory()
  const [viewerStories, setViewerStories] = useState(null)
  const groupedArray = useMemo(() => {
    if (!stories?.length) return []
    const filteredStories = stories.filter(
      story =>
        story?.owner?._id === user?._id ||
        user?.following?.includes(story?.owner?._id)
    )
    const groupedStories = filteredStories.reduce((acc, story) => {
      const userId = story?.owner?._id
      if (!acc[userId]) acc[userId] = { user: story?.owner, stories: [] }
      acc[userId].stories.push(story)
      return acc
    }, {})
    return Object.values(groupedStories)
  }, [stories, user?.following])

  const handleOpenViewer = (userStories) => {
    setViewerStories(userStories)
    userStories.forEach(story => viewStory(story._id))
  }

  // 🟢 conic-gradient border generator
  const getBorderStyle = (stories, userId) => {
    const total = stories.length
    if (total === 1) {
      const unseen = !stories[0]?.views?.some(v => v?._id === userId)
      return unseen
        ? "conic-gradient(#ff006a 0deg 360deg, transparent 0deg)"
        : "conic-gradient(#a1a1a1 0deg 360deg, transparent 0deg)"
    }

    const step = 360 / total
    let gradients = []

    stories.forEach((story, i) => {
      const start = i * step
      const end = (i + 1) * step
      const unseen = !story?.views?.some(v => v?._id === userId)
      gradients.push(
        `${unseen ? "#ff006a" : "#a1a1a1"} ${start}deg ${end}deg`
      )
    })

    return `conic-gradient(${gradients.join(", ")})`
  }

  return (
    <div className="w-[90%] mx-auto md:w-full">
      {isLoading ? (
        <div className="w-full overflow-x-auto flex gap-4 py-4 rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <StorySkeleton key={i} circle />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto flex items-center gap-4 pt-3 pb-3 rounded-lg snap-x snap-mandatory scroll-smooth scrollbar-hide">
          
          {/* 🟢 Create Story Button */}
          <div
            className="relative cursor-pointer group flex flex-col items-center snap-start"
            title="Create Story"
            onClick={() => setIsStory(true)}
          >
            <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center border border-white/10 shadow-md transition-transform group-hover:scale-105 duration-300">
                <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full p-2 shadow-lg">
                  <FiPlus className="text-white text-xl" />
                </div>
              </div>
            </div>
            <p className="text-xs mt-2 text-gray-700 dark:text-gray-200 text-center truncate w-16">
              Create
            </p>
          </div>

          {/* 🟣 Other User Stories */}
          {groupedArray.map((group, index) => (
            <div
              key={index}
              className="relative cursor-pointer group flex flex-col items-center snap-start"
              onClick={() => handleOpenViewer(group.stories)}
              title={group?.user?.username}
            >
              {/* Profile Image with dynamic conic border */}
              <div
                className="relative w-16 h-16 rounded-full p-[2px]"
                style={{
                  background: getBorderStyle(group.stories, user?._id)
                }}
              >
                <div className="w-full h-full rounded-full bg-black p-[2px] overflow-hidden">
                  <Image
                    src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                    alt={group?.user?.username}
                    fill
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </div>
              </div>

              <p className="text-xs mt-2 text-gray-700 dark:text-gray-200 text-center truncate w-16">
                {group?.user?.username}
              </p>

              {group.stories.length > 1 && (
                <span className="absolute top-0 right-0 bg-black/60 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {group.stories.length}
                </span>
              )}
            </div>
          ))}

          {/* 🟠 Story Viewer Modal */}
          <AnimatePresence>
            {viewerStories && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[999]"
              >
                <StoryViewer
                  stories={viewerStories}
                  onClose={() => setViewerStories(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default Stories
