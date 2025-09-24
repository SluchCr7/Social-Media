'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useStory } from '../Context/StoryContext'
import StoryViewer from './StoryViewer'
import StorySkeleton from '../Skeletons/StoriesSkeleton'
import { useAuth } from '../Context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const Stories = () => {
  const { user } = useAuth()
  const { stories, isLoading, viewStory } = useStory()
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

  const getBorderClass = (userStories) => {
    const hasUnseen = userStories.some(story => !story?.views?.some(v => v?._id === user?._id))
    return hasUnseen
      ? 'bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 animate-pulse'
      : 'bg-gray-500'
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
        <div className="w-full overflow-x-auto flex gap-4 pt-4 pb-2 rounded-lg snap-x snap-mandatory scroll-smooth -webkit-overflow-scrolling: touch">
          {groupedArray.map((group, index) => (
            <div
              key={index}
              className="relative cursor-pointer group flex flex-col items-center snap-start"
              onClick={() => handleOpenViewer(group.stories)}
              title={group?.user?.username}
            >
              {/* Profile Image with dynamic border */}
              <div className={`relative w-16 h-16 rounded-full p-[2px] ${getBorderClass(group.stories)}`}>
                <div className="w-full h-full rounded-full bg-black p-[2px]">
                  <Image
                    src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                    alt={group?.user?.username}
                    fill
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </div>
              </div>

              {/* User name */}
              <p className="text-xs mt-2 text-black dark:text-white text-center truncate w-16">
                {group?.user?.username}
              </p>

              {/* Story count */}
              {group.stories.length > 1 && (
                <span className="absolute top-0 right-0 bg-black/50 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {group.stories.length}
                </span>
              )}

              {/* New story indicator */}
              {group.stories.some(story => !story?.views?.some(v => v?._id === user?._id)) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-md"></span>
              )}
            </div>
          ))}

          {/* Story Viewer */}
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
