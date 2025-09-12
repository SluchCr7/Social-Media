'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useStory } from '../Context/StoryContext'
import StoryViewer from './StoryViewer'
import StorySkeleton from '../Skeletons/StoriesSkeleton'

const Stories = () => {
  const { stories, isLoading } = useStory()
  const [viewerStories, setViewerStories] = useState(null)

  // 🧠 تحسين الأداء: Memoize grouping
  const groupedArray = useMemo(() => {
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.owner._id
      if (!acc[userId]) {
        acc[userId] = {
          user: story.owner,
          stories: [],
        }
      }
      acc[userId].stories.push(story)
      return acc
    }, {})
    return Object.values(groupedStories)
  }, [stories])

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full overflow-x-auto flex gap-4 py-4 rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <StorySkeleton key={i} circle />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto flex gap-4 pt-4 pb-2 rounded-lg snap-x snap-mandatory">
          {groupedArray.map((group, index) => (
            <div
              key={index}
              className="relative cursor-pointer group flex flex-col items-center snap-start"
              onClick={() => setViewerStories(group.stories)}
            >
              {/* صورة البروفايل مع إطار متحرك Gradient */}
              <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-500 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-black p-[2px]">
                  <Image
                    src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                    alt={group?.user?.username}
                    fill
                    loading="lazy"
                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* اسم المستخدم مع Tooltip لو طويل */}
              <p
                className="text-xs mt-2 text-gray-200 text-center truncate w-16"
                title={group?.user?.username}
              >
                {group?.user?.username}
              </p>

              {/* عدد الستوريهات */}
              {group.stories.length > 1 && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {group.stories.length}
                </span>
              )}
            </div>
          ))}

          {/* Story Viewer */}
          {viewerStories && (
            <StoryViewer
              stories={viewerStories}
              onClose={() => setViewerStories(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Stories

